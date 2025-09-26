import os
import pyodbc
import datetime
import uuid
import logging
import shutil  # Importar el módulo para mover archivos
from typing import Optional, Tuple, Any

# Configuración del archivo de log
LOG_FILE = "procesar_pedidos.log"
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# --- Configuración de la conexión a la base de datos ---
DB_CONFIG = {
    'driver': '{ODBC Driver 17 for SQL Server}',
    'server': 'PROFITSERVER',
    'database': 'CRISTM25',
    'uid': 'profit',
    'pwd': 'profit',
    'autocommit': False,  # Mejor control de transacciones
    'timeout': 30  # Tiempo de espera para conexión
}

def conectar_bd() -> Optional[pyodbc.Connection]:
    """Establece una conexión a la base de datos con manejo de errores mejorado."""
    try:
        conexion_str = ';'.join([f'{key}={value}' for key, value in DB_CONFIG.items() 
                                if not callable(value) and not key.startswith('__')])
        return pyodbc.connect(conexion_str)
    except pyodbc.Error as ex:
        print(f"Error al conectar a la base de datos: {str(ex)}")
        return None

def limpiar_valor(valor: Any) -> str:
    """Limpia un valor eliminando espacios en blanco y convirtiendo a string."""
    return str(valor).strip() if valor is not None else ''

def ejecutar_consulta(conexion: pyodbc.Connection, query: str, params: Tuple = (), 
                     commit: bool = False) -> Optional[pyodbc.Cursor]:
    """Ejecuta una consulta SQL con manejo de errores y transacciones."""
    try:
        cursor = conexion.cursor()
        cursor.execute(query, params)
        if commit:
            conexion.commit()
        return cursor
    except pyodbc.Error as ex:
        print(f"Error en consulta SQL: {str(ex)}")
        print(f"Consulta: {query}")
        print(f"Parámetros: {params}")
        conexion.rollback()
        return None

def obtener_datos_articulo(cod_art: str) -> Optional[Tuple]:
    """Obtiene datos de un artículo por su código, incluyendo la categoría (co_cat)."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return None

    try:
        cod_art_limpio = limpiar_valor(cod_art)
        query = """
            SELECT stock_act, prec_vta1, prec_vta2, prec_vta3, prec_vta4, prec_vta5, tipo_imp, co_sucu, co_cat, 
                   cos_pro_un, ult_cos_un, ult_cos_om, art_des
            FROM art
            WHERE RTRIM(co_art) = ?
        """
        cursor = ejecutar_consulta(conexion, query, (cod_art_limpio,))
        if cursor:
            articulo = cursor.fetchone()
            return tuple(limpiar_valor(value) if isinstance(value, str) else value for value in articulo) if articulo else None
        return None
    finally:
        conexion.close()



def obtener_nuevo_fact_num() -> Optional[int]:
    """Obtiene el siguiente número de factura disponible."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return None

    try:
        query = "SELECT ISNULL(MAX(CAST(fact_num AS INT)), 0) + 1 FROM pedidos"
        cursor = ejecutar_consulta(conexion, query)
        if cursor:
            resultado = cursor.fetchone()
            return int(resultado[0]) if resultado else 1
        return None
    finally:
        conexion.close()

def obtener_co_ven_por_cliente(cod_cliente: str) -> str:
    """Obtiene el valor de co_ven para un cliente dado con valor predeterminado."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return '000008'  # Valor predeterminado

    try:
        cod_cliente_limpio = limpiar_valor(cod_cliente)
        query = "SELECT co_ven FROM clientes WHERE RTRIM(co_cli) = ?"
        cursor = ejecutar_consulta(conexion, query, (cod_cliente_limpio,))
        if cursor:
            resultado = cursor.fetchone()
            return limpiar_valor(resultado[0]) if resultado else '000008'
        return '000008'
    finally:
        conexion.close()

def obtener_tipo_cliente(cod_cliente: str) -> Optional[str]:
    """Obtiene el tipo de cliente desde la tabla clientes."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return None

    try:
        cod_cliente_limpio = limpiar_valor(cod_cliente)
        query = "SELECT tipo FROM clientes WHERE RTRIM(co_cli) = ?"
        cursor = ejecutar_consulta(conexion, query, (cod_cliente_limpio,))
        if cursor:
            resultado = cursor.fetchone()
            return limpiar_valor(resultado[0]) if resultado else None
        return None
    finally:
        conexion.close()

def obtener_precio_a(tipo_cliente: str) -> Optional[str]:
    """Obtiene el valor de precio_a y des_tipo desde la tabla tipo_cli."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return None

    try:
        tipo_cliente_limpio = limpiar_valor(tipo_cliente)
        query = """
            SELECT precio_a, tip_cli, des_tipo
            FROM tipo_cli
            WHERE RTRIM(tip_cli) = ?
        """
        cursor = ejecutar_consulta(conexion, query, (tipo_cliente_limpio,))
        if cursor:
            resultado = cursor.fetchone()
            if resultado:
                precio_a, tip_cli, des_tipo = (limpiar_valor(resultado[0]), limpiar_valor(resultado[1]), limpiar_valor(resultado[2]))
                print(f"Consulta exitosa: tipo_cliente='{tip_cli}', precio_a='{precio_a}', des_tipo='{des_tipo}'")
                return precio_a
            print(f"No se encontró registro en tipo_cli para tipo_cliente='{tipo_cliente_limpio}'")
        return None
    finally:
        conexion.close()






def insertar_pedido(fact_num: int, cod_cliente: str, tot_bruto: float, 
                   tot_neto: float, saldo: float, iva: float, fecha_actual: datetime.datetime, codigo_pedido: str) -> bool:
    """Inserta un nuevo pedido en la base de datos con manejo robusto de transacciones."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return False

    try:
        # Obtener el valor de co_ven con valor predeterminado
        co_ven = obtener_co_ven_por_cliente(cod_cliente)
        
        # Obtener el descuento global del cliente
        desc_glob = obtener_desc_glob_cliente(cod_cliente)
        porc_gdesc = desc_glob if desc_glob > 0 else ''

        # Definir todas las variables requeridas
        valores = {
            "fact_num": fact_num,
            "contrib": 1,
            "nombre": '',
            "rif": '',
            "nit": '',
            "status": 0,
            "comentario": '',
            "descrip": f"Pedido numero {codigo_pedido} de ICOMPRAS",
            "saldo": saldo,
            "fec_emis": fecha_actual,
            "fec_venc": fecha_actual,
            "co_cli": limpiar_valor(cod_cliente),
            "co_ven": co_ven,
            "co_tran": '03',
            "dir_ent": '',
            "forma_pag": '04',
            "tot_bruto": tot_bruto,
            "tot_neto": tot_neto,
            "iva": iva,
            "glob_desc": 0,
            "tot_reca": 0,
            "porc_gdesc": porc_gdesc,  # <--- Aquí se coloca el valor si es mayor a 0
            "porc_reca": '',
            "total_uc": 0,
            "total_cp": 0,
            "tot_flete": 0,
            "monto_dev": 0,
            "totklu": 0,
            "anulada": 0,
            "impresa": 0,
            "iva": 0,
            "iva_dev": 0,
            "feccom": fecha_actual,
            "numcom": 0,
            "tasa": 1,
            "moneda": 'US$',
            "dis_cen": '',
            "vuelto": 0,
            "seriales": 0,
            "tasag": 16,
            "tasag10": 16,
            "tasag20": 16,
            "campo1": '',
            "campo2": '',
            "campo3": '',
            "campo4": '',
            "campo5": '',
            "campo6": '',
            "campo7": '',
            "campo8": '',
            "co_us_in": '311',
            "fe_us_in": fecha_actual,
            "co_us_mo": '',
            "fe_us_mo": fecha_actual,
            "co_us_el": '',
            "fe_us_el": fecha_actual,
            "revisado": '',
            "trasnfe": '',
            "numcon": 0,
            "co_sucu": '01',
            "rowguid": str(uuid.uuid4()),
            "mon_ilc": 0,
            "otros1": 0,
            "otros2": 0,
            "otros3": 0,
            "num_turno": 0,
            "aux01": 0,
            "aux02": '',
            "ID": -1,
            "salestax": '',
            "origen": '',
            "origen_d": '',
            "sta_prod": '',
            "fec_reg": fecha_actual,
            "impfis": '',
            "impfisfac": '',
            "imp_nro_z": '',
            "ven_ter": 0,
            "ptovta": 0,
            "telefono": ''
        }

        # Construir la consulta dinámicamente
        columnas = ", ".join(valores.keys())
        placeholders = ", ".join(["?"] * len(valores))
        query = f"INSERT INTO pedidos ({columnas}) VALUES ({placeholders})"

        cursor = ejecutar_consulta(conexion, query, tuple(valores.values()), commit=True)
        if cursor:
            print(f"Pedido insertado con factura número: {fact_num}")
            return True
        return False
    except Exception as ex:
        print(f"Error inesperado al insertar pedido {fact_num}: {str(ex)}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def registrar_pista(fact_num: int, codigo_pedido: str) -> bool:
    """Registra una entrada en la tabla 'pistas'."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return False

    try:
        # Valores a insertar
        valores = {
            "usuario_id": '311',
            "usuario": 'ICOMPRAS',
            "fecha": datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),  # Formato ISO 8601
            "empresa": 'CRISTM25',
            "co_sucu": '01',
            "tabla": 'PEDIDOS',
            "num_doc": fact_num,
            "codigo": '',
            "tipo_op": 'I',
            "maquina": '198.12.221.39',
            "campos": '',  # Agregar el código de pedido
            "rowguid": str(uuid.uuid4()),
            "trasnfe": '',
            "AUX01": 0,
            "AUX02": ''
        }

        # Construir la consulta
        columnas = ", ".join(valores.keys())
        placeholders = ", ".join(["?"] * len(valores))
        query = f"INSERT INTO pistas ({columnas}) VALUES ({placeholders})"

        # Ejecutar la consulta
        cursor = ejecutar_consulta(conexion, query, tuple(valores.values()), commit=True)
        if cursor:
            print(f"Registro en 'pistas' exitoso para factura número: {fact_num}")
            return True
        return False
    except Exception as ex:
        print(f"Error al registrar en 'pistas': {str(ex)}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def obtener_descuento(cod_art: str, co_cat: str) -> Optional[float]:
    print("DATOS A BUSCAR",cod_art, co_cat)  # Depuración
    """Obtiene el porcentaje de descuento (porc1) para un artículo o categoría."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return None

    try:
        cod_art_limpio = limpiar_valor(cod_art)
        co_cat_limpio = limpiar_valor(co_cat)
        print(f"Buscando descuento para artículo '{cod_art_limpio}' o categoría '{co_cat_limpio}'")  # Depuración

        query = """
            SELECT porc1
            FROM descuen
            WHERE RTRIM(co_desc) = ? OR RTRIM(co_desc) = ?
        """
        print(f"Consulta SQL: {query}")  # Depuración
        print(f"Parámetros: {cod_art_limpio}, {co_cat_limpio}")  # Depuración

        cursor = ejecutar_consulta(conexion, query, (cod_art_limpio, co_cat_limpio))
        if cursor:
            resultado = cursor.fetchone()
            if resultado:
                print(f"Descuento encontrado: {resultado[0]}% para artículo '{cod_art_limpio}' o categoría '{co_cat_limpio}'")  # Depuración
                return float(resultado[0])
            else:
                print(f"No se encontró descuen  to para artículo '{cod_art_limpio}' ni categoría '{co_cat_limpio}'")  # Depuración
        else:
            print("La consulta no devolvió ningún cursor.")  # Depuración
        return None
    except Exception as ex:
        print(f"Error al buscar descuento: {str(ex)}")  # Depuración
        return None
    finally:
        conexion.close()

def procesar_linea_articulo(linea: str, archivo: str, precio_a: str) -> Optional[Tuple[float, float, float, float]]:
    """Procesa una línea de artículo y devuelve los totales calculados, aplicando descuentos si corresponde."""
    datos = linea.strip().split('|')
    if len(datos) < 8:
        print(f"Formato incorrecto en línea de {archivo}: {linea.strip()}")
        return None

    try:
        cod_art = limpiar_valor(datos[0])
        cant_producto = int(limpiar_valor(datos[2]))  # Cantidad como entero
        print(f"Buscando artículo: '{cod_art}'")

        datos_articulo = obtener_datos_articulo(cod_art)
        if not datos_articulo:
            print(f"⚠️ Alerta: Artículo '{cod_art}' no encontrado")
            return None

        # Usar siempre prec_vta3 (índice 3)
        precio = float(datos_articulo[3])

        # Obtener categoría del artículo
        co_cat = datos_articulo[8]

        # Buscar descuento en la tabla descuen
        descuento = obtener_descuento(cod_art, co_cat)
        if descuento:
            print(f"Descuento encontrado para artículo '{cod_art}': {descuento}%")
        else:
            descuento = 0.0

        # Calcular subtotal e impuestos
        subtotal = precio * cant_producto
        descuento_aplicado = subtotal * (descuento / 100)  # Descuento en valor real
        subtotal -= descuento_aplicado

        tipo_imp = int(datos_articulo[6])
        iva = 0
        if tipo_imp == 6:
            print(f"Artículo '{cod_art}' exento de impuestos")
        elif tipo_imp == 1:
            iva = subtotal * (16.000 / 100)  # IVA en valor real
            subtotal += iva
            print(f"IVA aplicado a '{cod_art}': {iva:.3f}")  # Mostrar IVA con 3 decimales
        else:
            print(f"Tipo impuesto desconocido ({tipo_imp}) para '{cod_art}'")

        print(f"Artículo: {cod_art}, Precio: {precio:.3f}, Cantidad: {cant_producto}, Subtotal: {subtotal:.3f}, Descuento aplicado: {descuento_aplicado:.3f}")
        return subtotal, subtotal, subtotal, precio  # tot_bruto, tot_neto, saldo, precio
    except ValueError as ve:
        print(f"Error de valor en línea {linea.strip()}: {str(ve)}")
        return None
    except Exception as ex:
        print(f"Error procesando línea {linea.strip()}: {str(ex)}")
        return None

def procesar_archivo_pedido(ruta_archivo: str) -> bool:
    """Procesa un archivo de pedido individual."""
    try:
        print(f"Procesando archivo: {ruta_archivo}")
        nombre_archivo = os.path.basename(ruta_archivo)
        codigo_pedido = obtener_codigo_pedido(nombre_archivo)  # Extraer el código de pedido
        print(f"Código de pedido extraído: {codigo_pedido}")

        # Verificar si el pedido ya existe
        if pedido_ya_existe(codigo_pedido):
            print(f"El pedido con código {codigo_pedido} ya existe en la base de datos. No se procesará nuevamente.")
            logging.warning(f"Pedido {codigo_pedido} ya existe en la base de datos. Archivo {nombre_archivo} no procesado.")
            return False

        # Leer el archivo
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            lineas = f.readlines()

        if not lineas:
            print(f"Archivo vacío: {ruta_archivo}")
            return False

        # Procesar la primera línea para obtener el cliente
        primera_linea = lineas[0].strip().split('|')
        if len(primera_linea) < 6:
            print(f"Formato incorrecto en primera línea de {ruta_archivo}")
            return False

        cod_cliente = limpiar_valor(primera_linea[5])
        print(f"Código de cliente extraído: {cod_cliente}")

        # Obtener tipo de cliente
        tipo_cliente = obtener_tipo_cliente(cod_cliente)
        if not tipo_cliente:
            print(f"No se encontró tipo para cliente '{cod_cliente}'")
            return False

        # Obtener precio_a
        precio_a = obtener_precio_a(tipo_cliente)   
        if not precio_a:
            print(f"No se encontró precio_a para tipo '{tipo_cliente}'")
            return False

        print(f"Tipo cliente: {tipo_cliente}, Precio a usar: {precio_a}")

        # Inicializar totales
        saldo = 0.0
        tot_bruto = 0.0
        tot_neto = 0.0
        iva_total = 0.0

        items = []

        # Procesar líneas de detalle
        for linea in lineas:
            resultado = procesar_linea_articulo(linea, ruta_archivo, precio_a)
            if resultado:
                subtotal, neto, saldo_linea, precio = resultado
                tot_bruto += subtotal
                tot_neto += neto
                saldo += saldo_linea
                items.append({
                    'co_art': limpiar_valor(linea.split('|')[0]),
                    'cant_producto': int(limpiar_valor(linea.split('|')[2])),
                    'precio': precio,
                    'descuento': 0,  # Placeholder for discount
                    'tipo_imp': 1,  # Placeholder for tax type
                    'subtotal': subtotal
                })

        # Dividir el pedido si excede 21 ítems
        pedidos_divididos = [items[i:i + 21] for i in range(0, len(items), 21)]

        for sub_pedido in pedidos_divididos:
            # Calcular totales para el sub-pedido
            sub_tot_bruto = sum(item['subtotal'] for item in sub_pedido)
            sub_tot_neto = sub_tot_bruto  # Ajustar si hay descuentos o impuestos
            sub_saldo = sub_tot_bruto  # Ajustar si hay saldos

            # Obtener número de factura
            fact_num = obtener_nuevo_fact_num()
            if not fact_num:
                print("Error al obtener número de factura")
                return False

            # Insertar el pedido
            if not insertar_pedido(fact_num, cod_cliente, sub_tot_bruto, sub_tot_neto, sub_saldo, iva_total, datetime.datetime.now(), codigo_pedido):
                print(f"Error al insertar el pedido con factura número: {fact_num}")
                return False

            # Insertar los renglones del pedido
            if not insertar_renglones_pedido(fact_num, sub_pedido, datetime.datetime.now()):
                print(f"Error al insertar los renglones del pedido con factura número: {fact_num}")
                return False

            # Registrar el pedido en la tabla pistas
            if not registrar_pista(fact_num, codigo_pedido):
                print(f"Error al registrar el pedido en la tabla 'pistas' para la factura número: {fact_num}")
                return False

            print(f"Sub-pedido con factura número {fact_num} subido correctamente a Profit.")
            logging.info(f"Pedido {codigo_pedido} (factura {fact_num}) montado correctamente desde archivo {nombre_archivo}.")

        return True
    except FileNotFoundError:
        print(f"Archivo no encontrado: {ruta_archivo}")
        return False
    except Exception as ex:
        print(f"Error procesando línea {linea.strip()}: {str(ex)}")
        logging.error(f"Error procesando archivo {ruta_archivo}: {str(ex)}")
        return False

def procesar_pedidos():
    
    """Procesa todos los archivos de pedidos en la carpeta especificada."""
    carpeta_descargados = 'archivos_descargados'
    carpeta_procesados = 'archivos_procesados'
    if not os.path.exists(carpeta_descargados):
        logging.error(f"Carpeta no existe: {carpeta_descargados}")
        return
    if not os.path.exists(carpeta_procesados):
        os.makedirs(carpeta_procesados)

    archivos_procesados = 0
    for archivo in os.listdir(carpeta_descargados):
        if archivo.endswith('.txt'):
            ruta_archivo = os.path.join(carpeta_descargados, archivo)
            ruta_procesado = os.path.join(carpeta_procesados, archivo)
            # Verificar si ya fue procesado
            if os.path.exists(ruta_procesado):
                print(f"El archivo {archivo} ya está en 'archivos_procesados'. No se procesará nuevamente.")
                # Eliminar el archivo duplicado de archivos_descargados
                try:
                    os.remove(ruta_archivo)
                    print(f"Archivo duplicado eliminado de 'archivos_descargados': {ruta_archivo}")
                    logging.warning(f"Archivo duplicado {archivo} eliminado de 'archivos_descargados'. Ya estaba en 'archivos_procesados'.")
                except Exception as e:
                    print(f"Error al eliminar archivo duplicado: {e}")
                continue
            logging.info(f"\nProcesando: {archivo}")
            if procesar_archivo_pedido(ruta_archivo):
                # Mover el archivo solo si el pedido se montó correctamente
                shutil.move(ruta_archivo, ruta_procesado)
                print(f"Archivo movido a la carpeta 'archivos_procesados': {ruta_procesado}")
                archivos_procesados += 1

    logging.info(f"\nProceso completado. Archivos procesados: {archivos_procesados}")

def insertar_renglones_pedido(fact_num: int, items: list, fecha_actual: datetime.datetime) -> bool:
    """
    Inserta los renglones del pedido en la tabla 'reng_ped' y actualiza el stock_com en la tabla 'art'.
    """
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return False

    try:
        reng_num = 1  # Contador para los renglones
        for item in items:
            # Obtener datos del artículo desde la tabla 'art'
            datos_articulo = obtener_datos_articulo(item['co_art'])
            if not datos_articulo:
                print(f"⚠️ Alerta: Artículo '{item['co_art']}' no encontrado")
                return False

            # Extraer valores necesarios del artículo
            cos_pro_un = datos_articulo[9]  # Índice de 'cos_pro_un'
            ult_cos_un = datos_articulo[10]  # Índice de 'ult_cos_un'
            ult_cos_om = datos_articulo[11]  # Índice de 'ult_cos_om'
            des_art = datos_articulo[12]  # Índice de 'art_des'
            tipo_imp = datos_articulo[6]  # Índice de 'tipo_imp'

            # Calcular el precio por unidad y el total del renglón
            prec_vta = item['precio']  # Precio por unidad
            reng_neto = item['cant_producto'] * prec_vta  # Total del renglón (cantidad * precio por unidad)

            # Obtener categoría del artículo
            co_art = item['co_art']
            co_cat = datos_articulo[8]  # Asegúrate que este índice corresponde a co_cat
            porc_desc = obtener_descuento_articulo(co_art, co_cat)

            # Construir los valores para la inserción
            valores = {
                'fact_num': fact_num,
                'reng_num': reng_num,
                'dis_cen': '',
                'tipo_doc': '',
                'reng_doc': 0,
                'num_doc': 0,
                'co_art': item['co_art'],
                'co_alma': '01',
                'total_art': item['cant_producto'],
                'stotal_art': 0,
                'pendiente': item['cant_producto'],
                'uni_venta': 'UND',
                'prec_vta': prec_vta,  # Precio por unidad
                "porc_desc": f"0.00+{porc_desc:.2f}+0.00",
                'tipo_imp': tipo_imp,
                'reng_neto': reng_neto,  # Total del renglón
                'cos_pro_un': cos_pro_un,
                'ult_cos_un': ult_cos_un,
                'ult_cos_om': ult_cos_om,
                'cos_pro_om': 0,
                'total_dev': 0,
                'monto_dev': 0,
                'prec_vta2': 0,
                'anulado': 0,
                'des_art': des_art,
                'seleccion': 0,
                'cant_imp': 0,
                'comentario': '',
                'rowguid': str(uuid.uuid4()),
                'total_uni': 1,
                'mon_ilc': 0,
                'otros': 0,
                'nro_lote': '',
                'fec_lote': fecha_actual,
                'pendiente2': 0,
                'tipo_doc2': '',
                'reng_doc2': 0,
                'num_doc2': 0,
                'co_alma2': '',
                'aux01': 0,
                'aux02': '',
                'cant_prod': 0,
                'imp_prod': 0
            }

            # Construir la consulta SQL para insertar en reng_ped
            columnas = ", ".join(valores.keys())
            placeholders = ", ".join(["?"] * len(valores))
            query = f"INSERT INTO reng_ped ({columnas}) VALUES ({placeholders})"

            # Ejecutar la consulta
            cursor = ejecutar_consulta(conexion, query, tuple(valores.values()), commit=True)
            if not cursor:
                print(f"Error al insertar renglón {reng_num} para factura {fact_num}")
                return False

            # Actualizar el stock_com en la tabla 'art'
            select_query = "SELECT stock_com FROM art WHERE RTRIM(co_art) = ?"
            select_cursor = ejecutar_consulta(conexion, select_query, (item['co_art'],))
            if select_cursor:
                resultado = select_cursor.fetchone()
                if resultado:
                    stock_actual = resultado[0] if resultado[0] is not None else 0
                    nuevo_stock = stock_actual + item['cant_producto']
                    update_query = "UPDATE art SET stock_com = ? WHERE RTRIM(co_art) = ?"
                    update_params = (nuevo_stock, item['co_art'])
                    update_cursor = ejecutar_consulta(conexion, update_query, update_params, commit=True)
                    if not update_cursor:
                        print(f"Error al actualizar stock_com para el artículo '{item['co_art']}' en la tabla 'art'")
                        return False
                    
                    # Actualizar el stock en la tabla 'st_almac'
                    update_st_almac_query = "UPDATE st_almac SET stock_act = ? WHERE RTRIM(co_art) = ? AND co_alma = '01'"
                    update_st_almac_params = (nuevo_stock, item['co_art'])
                    update_st_almac_cursor = ejecutar_consulta(conexion, update_st_almac_query, update_st_almac_params, commit=True)
                    if not update_st_almac_cursor:
                        print(f"Error al actualizar stock_act para el artículo '{item['co_art']}' en la tabla 'st_almac'")
                        return False
                else:
                    print(f"Artículo '{item['co_art']}' no encontrado en la tabla 'art'.")
                    return False
            else:
                print(f"Error al consultar stock_com para el artículo '{item['co_art']}' en la tabla 'art'")
                return False

            reng_num += 1  # Incrementar el número de renglón

        print(f"Renglones del pedido {fact_num} insertados correctamente y stock_com actualizado.")
        return True
    except Exception as ex:
        print(f"Error al insertar renglones del pedido {fact_num}: {str(ex)}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def obtener_codigo_pedido(nombre_archivo: str) -> str:
    """
    Extrae el código de pedido del nombre del archivo.
    Ejemplo: 'PED-FAR01677-72751-PR.txt' -> '72751'
    """
    partes = nombre_archivo.split('-')
    if len(partes) > 2:
        return partes[2]  # El tercer elemento es el código de pedido
    return ''

def pedido_ya_existe(codigo_pedido: str) -> bool:
    """
    Verifica si un pedido ya existe en la base de datos.
    Ahora revisa el campo 'descrip' de la tabla 'pedidos'.
    :param codigo_pedido: Código del pedido a verificar.
    :return: True si el pedido ya existe, False en caso contrario.
    """
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return True  # Asumimos que existe para evitar procesar en caso de error

    try:
        query = "SELECT COUNT(*) FROM pedidos WHERE descrip LIKE ?"
        parametros = (f"%Pedido numero {codigo_pedido} de ICOMPRAS%",)
        cursor = ejecutar_consulta(conexion, query, parametros)
        if cursor:
            resultado = cursor.fetchone()
            return resultado[0] > 0  # Retorna True si el pedido ya existe
        return False
    except Exception as ex:
        print(f"Error al verificar si el pedido ya existe: {str(ex)}")
        return True  # Asumimos que existe para evitar procesar en caso de error
    finally:
        conexion.close()

def obtener_desc_glob_cliente(cod_cliente: str) -> float:
    """Obtiene el valor de desc_glob para un cliente."""
    conexion = conectar_bd()
    if not conexion:
        print("No se pudo conectar a la base de datos.")
        return 0.0

    try:
        cod_cliente_limpio = limpiar_valor(cod_cliente)
        query = "SELECT desc_glob FROM clientes WHERE RTRIM(co_cli) = ?"
        cursor = ejecutar_consulta(conexion, query, (cod_cliente_limpio,))
        if cursor:
            resultado = cursor.fetchone()
            return float(resultado[0]) if resultado and resultado[0] is not None else 0.0
        return 0.0
    finally:
        conexion.close()

def obtener_descuento_articulo(co_art: str, co_cat: str) -> float:
    """
    Busca en la tabla 'descuen' un descuento para el artículo (co_art) o la categoría (co_cat).
    Retorna el valor de porc1 si existe, si no retorna 0.0.
    """
    conexion = conectar_bd()
    if not conexion:
        return 0.0
    try:
        query = """
            SELECT TOP 1 porc1
            FROM descuen
            WHERE co_desc = ? OR co_desc = ?
            ORDER BY CASE WHEN co_desc = ? THEN 1 ELSE 2 END
        """
        cursor = ejecutar_consulta(conexion, query, (co_art, co_cat, co_art))
        if cursor:
            resultado = cursor.fetchone()
            return float(resultado[0]) if resultado and resultado[0] is not None else 0.0
        return 0.0
    finally:
        conexion.close()

if __name__ == "__main__":
    procesar_pedidos()





