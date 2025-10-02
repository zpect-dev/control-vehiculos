import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportGasolinaExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Gasolina');

    worksheet.columns = [
        { header: 'N° Factura', key: 'factura', width: 12 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Vehículo', key: 'vehiculo', width: 15 },
        { header: 'Precio', key: 'precio', width: 10 },
        { header: 'Km Actual', key: 'km_actual', width: 12 },
        { header: 'Recorrido Km', key: 'recorrido', width: 15 },
        { header: 'Litros', key: 'litros', width: 10 },
        { header: 'Total $', key: 'total', width: 10 },
        { header: 'Observaciones', key: 'observaciones', width: 20 },
        { header: 'Diferencia Litros', key: 'diferencia', width: 12 },
        { header: 'Conductor', key: 'conductor', width: 20 },
        { header: 'Supervisor', key: 'supervisor', width: 20 },

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

    data.forEach((rowData) => {
        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

            if (['precio', 'total'].includes(worksheet.columns[colNumber - 1].key)) {
                cell.numFmt = '"$"#,##0.00';
            }
        });
    });

    worksheet.eachRow((row) => {
        row.height = 20;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'historial_gasolina.xlsx');
}
