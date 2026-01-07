# 🚗 Control de Vehículos - Documentación Técnica

## 📋 Descripción General

**Control de Vehículos** es una plataforma robusta desarrollada para la gestión integral de flotas de transporte. El sistema centraliza la información de fichas técnicas, revisiones mecánicas, control de combustible (surtidos), gestión de conductores y auditoría de procesos. Está construido sobre una arquitectura monolítica moderna utilizando **Laravel** como backend y **React (vía Inertia.js)** para el frontend, garantizando una experiencia de usuario fluida (SPA) con la robustez de un framework MVC.

---

## 🛠 Stack Tecnológico

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React 18 (TypeScript), Inertia.js
- **Estilos**: Tailwind CSS
- **Base de Datos**: MySQL / MariaDB
- **Build Tool**: Vite
- **Excel Export**: Maatwebsite/Excel
- **Autenticación**: Laravel Breeze / Custom Auth

---

## 🧠 Arquitectura y Flujo de Datos

El proyecto utiliza **Inertia.js** para servir vistas de React directamente desde los controladores de Laravel, eliminando la necesidad de una API REST completa para el consumo interno.

1.  **Routing**: Definido en `routes/web.php`. Las rutas están protegidas por middlewares de autenticación (`auth`, `verified`) y roles (`admin`, `role`).
2.  **Controladores**: Manejan la lógica de negocio y retornan respuestas con `Inertia::render`.
3.  **Vistas (Pages)**: Componentes de React en `resources/js/pages` que reciben los datos como props directamente del controlador.

---

## 🚀 Módulos Principales y Funciones Complejas

### 1. Gestión de Combustible (Surtidos)

**Ubicación**: `App\Http\Controllers\SurtidosController.php`

Este módulo no solo registra cargas de combustible, sino que realiza cálculos de eficiencia y detección de anomalías.

- **Cálculo de Consumo Ideal (`surtido_ideal`)**:
  Al registrar un surtido, el sistema calcula automáticamente cuántos litros _debería_ haber consumido el vehículo basándose en el kilometraje recorrido desde la última carga y un factor de rendimiento constante (`valorCarburador`):
    - `CARRO`: 0.10 L/km
    - `OTROS`: 0.035 L/km

    ```php
    $surtido_ideal = ($kilometraje_actual - $kilometraje_anterior) * $valorCarburador;
    $diferencia = $surtido_ideal - $litros_reales;
    ```

    _Esto permite detectar robos de combustible o fallas mecánicas._

- **Exportación Inteligente (`exportSelected`)**:
  Función compleja que permite seleccionar múltiples facturas de surtido y generar un reporte en Excel.
    - Calcula el rendimiento promedio del periodo seleccionado.
    - Maneja casos borde (división por cero si el kilometraje no ha cambiado).
    - Utiliza `App\Exports\GasolinaSelectionExport` para formatear el archivo.

### 2. Ficha Técnica Centralizada

**Ubicación**: `App\Http\Controllers\FichaTecnica\FichaTecnicaController.php`

El controlador actúa como un **agregador de datos**, consolidando información de múltiples tablas relacionadas para presentar una vista unificada del vehículo.

- **Carga de Relaciones**: Trae en una sola consulta (`show` method):
    - `Usuario` (Conductor principal) y usuarios adicionales (Ayudantes).
    - `VehiculoEspecificaciones`: Estado técnico del vehículo.
    - `VehiculoAccesorios`: Inventario de accesorios.
    - `VehiculoPiezas`: Estado de piezas críticas.
    - `VehiculoPermisos`: Estado legal (seguros, permisos de ruta).

- **Gestión de Permisología (`storePermisos`)**:
  Maneja la lógica de subida de archivos polimórfica (acepta tanto Imágenes como PDF).
    - Utiliza `App\Services\Multimedia` para determinar el tipo MIME y almacenar el archivo en la ruta correcta (`storage/uploads/pdf-documentos` o `storage/uploads/fotos-documentos`).
    - Al detectarse un permiso próximo a vencer, dispara alertas y puede notificar globalmente.

### 3. Sistema de Auditoría (Middleware Personalizado)

**Ubicación**: `App\Http\Middleware\AuditAction.php`

Para garantizar la trazabilidad de todas las operaciones críticas, se implementó un middleware personalizado `audit`.

- **Uso en Rutas**:
    ```php
    Route::post(...)->middleware('audit:Actualizo el expediente del vehiculo, Expediente');
    ```
- **Funcionamiento**:
  Intercepta la solicitud _después_ de que se ejecuta el controlador (terminable middleware) o antes, registrando:
    - Usuario responsable.
    - Acción realizada (definida en el parámetro del middleware).
    - Entidad afectada.
    - Timestamp.

### 4. Revisiones Diarias y Semanales

**Ubicación**: `App\Http\Controllers\RevisionDiariaController.php`, `RevisionSemanalController.php`

Separa la lógica de mantenimiento en dos niveles:

- **Diaria (Fluidos)**: Chequeo rápido de niveles (aceite, agua, frenos).
- **Semanal**: Inspección profunda.
  Ambos controladores gestionan estados históricos, permitiendo ver la evolución del mantenimiento del vehículo en el tiempo.

---

## 🔧 Instalación y Configuración

1.  **Clonar el repositorio**

    ```bash
    git clone <url_repositorio>
    cd control-vehiculos
    ```

2.  **Instalar dependencias de Backend**

    ```bash
    composer install
    ```

3.  **Instalar dependencias de Frontend**

    ```bash
    npm install
    ```

4.  **Configurar Entorno**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    _Configurar base de datos en .env_

5.  **Correr Migraciones**

    ```bash
    php artisan migrate
    ```

6.  **Iniciar Servidores de Desarrollo**
    _Terminal 1 (Laravel)_:
    ```bash
    php artisan serve
    ```
    _Terminal 2 (Vite)_:
    ```bash
    npm run dev
    ```

## 🔒 Seguridad y Roles

El sistema implementa dos niveles principales de control de acceso:

1.  **Roles (`AdminMiddleware`)**: Restringe el acceso a rutas administrativas (creación de usuarios, auditoría global).
2.  **Permisos de Vehículo**: Los usuarios regulares solo pueden ver/editar vehículos que tienen asignados explícitamente a través del `AsignacionesController`.

---

_Documentación generada automáticamente por Asistente de IA - 2024_
