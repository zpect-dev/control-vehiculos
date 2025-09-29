import { FilaFacturaProps } from '@/types';
import { formatFecha } from '@/utils/formatDate';
import { Search } from 'lucide-react';

export function FilaFactura({ factura, onOpenModal }: FilaFacturaProps & { onOpenModal: (facturaNum: string) => void }) {
    const badgeEstado = (estado: boolean) => (
        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {estado ? 'APROBADO' : 'PENDIENTE'}
        </span>
    );

    console.log('Estado de la factura:', factura);

    return (
        <tr className="border-b text-sm text-gray-600 dark:text-gray-300">
            <td className="px-4 py-2">{factura.fact_num}</td>
            <td className="px-4 py-2">{formatFecha(factura.fec_emis)}</td>
            <td className="px-4 py-2">{factura.co_cli}</td>
            <td className="px-4 py-2">${factura.tot_bruto}</td>
            <td className="px-4 py-2">${factura.tot_neto}</td>
            <td className="max-w-[130px] truncate px-4 py-2" title={factura.descripcion}>
                {factura.descripcion}
            </td>
            <td className="px-4 py-2"> {factura.aprobado ? badgeEstado(factura.aprobado) : '—'}</td>
            <td className="px-4 py-2">
                <button
                    onClick={() => onOpenModal(factura.fact_num)}
                    className="btn-detalles flex items-center gap-1 rounded-md bg-[#49af4e] p-2 text-xs font-semibold text-white hover:bg-[#47a84c]"
                >
                    <Search className="h-4 w-4" />
                    Detalles
                </button>
            </td>
        </tr>
    );
}
