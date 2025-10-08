import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportGasolinaGeneralExcel(data) {
    if (!Array.isArray(data)) {
        console.error('No se puede generar el Excel: data no es un array válido.');
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Surtidos Gasolina');

    worksheet.columns = [
        { header: 'Vehículo', key: 'vehiculo', width: 15 },
        { header: 'Placa', key: 'placa', width: 12 },
        { header: 'N° Factura', key: 'factura', width: 12 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Precio', key: 'precio', width: 10 },
        { header: 'Km Actual', key: 'km_actual', width: 12 },
        { header: 'Recorrido Km', key: 'recorrido', width: 15 },
        { header: 'Litros', key: 'litros', width: 10 },
        { header: 'Total $', key: 'total', width: 10 },
        { header: 'Observaciones', key: 'observaciones', width: 20 },
        { header: 'Diferencia Litros', key: 'diferencia', width: 12 },
        { header: 'Conductor', key: 'conductor', width: 20 },
        { header: 'Supervisor', key: 'admin', width: 20 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF49AF4E' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    let totalLitros = 0;
    let totalDiferencia = 0;

    data.forEach((registro) => {
        totalLitros += parseFloat(registro.litros || 0);
        totalDiferencia += parseFloat(registro.diferencia || 0);

        const row = worksheet.addRow({
            vehiculo: registro.vehiculo,
            placa: registro.placa,
            factura: registro.factura,
            fecha: registro.fecha,
            precio: registro.precio,
            km_actual: registro.km_actual,
            recorrido: registro.recorrido,
            litros: registro.litros,
            total: registro.total,
            observaciones: registro.observaciones,
            diferencia: registro.diferencia,
            conductor: registro.conductor,
            admin: registro.admin,
        });

        row.eachCell((cell, colNumber) => {
            const key = worksheet.columns[colNumber - 1].key;

            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

            if (key === 'precio' || key === 'total') {
                cell.numFmt = '"$"#,##0.00';
            }

            if (key === 'diferencia') {
                const value = parseFloat(cell.value);
                if (!isNaN(value) && value < 0) {
                    cell.font = { color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF0000' },
                    };
                }
            }
        });
    });

    // Fila de totales
    const totalRow = worksheet.addRow({
        vehiculo: 'TOTALES',
        litros: totalLitros,
        diferencia: totalDiferencia,
    });

    totalRow.eachCell((cell, colNumber) => {
        const key = worksheet.columns[colNumber - 1].key;

        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };

        if (key === 'litros' || key === 'diferencia') {
            cell.numFmt = '#,##0.00';
        }

        if (key === 'diferencia' && totalDiferencia < 0) {
            cell.font.color = { argb: 'FFFFFFFF' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' },
            };
        }
    });

    worksheet.eachRow((row) => {
        row.height = 20;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const nombreArchivo = `surtidos_gasolina_general_${new Date().toISOString().slice(0, 10)}.xlsx`;
    saveAs(blob, nombreArchivo);
}
