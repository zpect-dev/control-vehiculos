import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportAuditoriaExcel(data, vehiculo) {
    const workbook = new ExcelJS.Workbook();

    // Hoja principal: Auditoría
    const auditoriaSheet = workbook.addWorksheet('Auditoría');

    auditoriaSheet.columns = [
        { header: 'N° Factura', key: 'fact_num', width: 15 },
        { header: 'Fecha Emisión', key: 'fec_emis', width: 15 },
        { header: 'Vehículo', key: 'placa', width: 12 },
        { header: 'Supervisor', key: 'conductor', width: 20 },
        { header: '¿Cubre empresa?', key: 'cubre_empresa', width: 15 },
        { header: 'Usuario que paga', key: 'cubre_usuario', width: 20 },
        { header: 'Aprobado', key: 'aprobado', width: 12 },
        { header: 'Total Bruto', key: 'tot_bruto', width: 15 },
        { header: 'Total Neto', key: 'tot_neto', width: 15 },
        { header: 'Descripción', key: 'descripcion', width: 30 },
        { header: 'Observación del conductor', key: 'observaciones_res', width: 30 },
        { header: 'Observación del supervisor', key: 'observaciones_admin', width: 30 },
    ];

    auditoriaSheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF49AF4E' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    data.forEach((factura) => {
        const row = auditoriaSheet.addRow({
            fact_num: factura.fact_num,
            fec_emis: factura.fec_emis,
            vehiculo: factura.vehiculo,
            placa: vehiculo.placa,
            conductor: vehiculo.conductor,
            supervisor: factura.supervisor,
            cubre_empresa: factura.cubre ? 'No' : 'Sí',
            cubre_usuario: factura.cubre ? factura.cubre_usuario : 'Empresa',
            aprobado: factura.aprobado ? 'Sí' : 'No',
            tot_bruto: factura.tot_bruto,
            tot_neto: factura.tot_neto,
            descripcion: factura.descripcion,
            observaciones_res: factura.observaciones_res,
            observaciones_admin: factura.observaciones_admin,
        });

        row.eachCell((cell, colNumber) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

            const key = auditoriaSheet.columns[colNumber - 1]?.key || '';
            if (['tot_bruto', 'tot_neto'].includes(key)) {
                cell.numFmt = '"$"#,##0.00';
            }
        });
    });

    auditoriaSheet.eachRow((row) => {
        row.height = 20;
    });

    // Hoja secundaria: Renglones
    const renglonesSheet = workbook.addWorksheet('Renglones');

    renglonesSheet.columns = [
        { header: 'N° Factura', key: 'fact_num', width: 15 },
        { header: 'Producto', key: 'art_des', width: 30 },
        { header: 'Código', key: 'co_art', width: 15 },
        { header: 'Cantidad', key: 'total_art', width: 12 },
        { header: 'Precio', key: 'reng_neto', width: 15 },
        { header: 'Imagen', key: 'imagen', width: 20 },
    ];

    renglonesSheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF49AF4E' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    data.forEach((factura) => {
        if (!Array.isArray(factura.renglones)) return;

        factura.renglones.forEach((r) => {
            const row = renglonesSheet.addRow({
                fact_num: factura.fact_num,
                art_des: r.repuesto?.art_des ?? '—',
                co_art: r.co_art,
                total_art: r.total_art,
                reng_neto: r.reng_neto,
                imagen: r.imagen_url ? '✅' : '—',
            });

            row.eachCell((cell, colNumber) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };

                const key = renglonesSheet.columns[colNumber - 1]?.key || '';
                if (key === 'reng_neto') {
                    cell.numFmt = '"$"#,##0.00';
                }
            });
        });
    });

    renglonesSheet.eachRow((row) => {
        row.height = 20;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `auditoria_${vehiculo.placa}.xlsx`);
}
