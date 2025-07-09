import { ITransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";
import { PencilSimple, Trash } from "phosphor-react";

export interface ITableProps {
    data: ITransaction[]
    onOpenDeleteModal: (id: string) => void;
    onOpenEditModal: (transaction: ITransaction) => void;
}

export function Table({ data = [], onOpenDeleteModal, onOpenEditModal }: ITableProps) {   

    return (  
        <>     
        <table className="w-full mt-16 border-0 border-separate border-spacing-y-2 ">
        <thead>
            <tr>
                <th className="px-4 text-left text-table-header text-base font-medium">Título</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Preço</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Categoria</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Data</th> 
                <th className="px-4 text-left text-table-header text-base font-medium">Ações</th>                                  
            </tr>
        </thead>
        <tbody>
            {data.map((transaction, index) => (
                <tr key={index} className="bg-white h-16 rounded-lg">
                    <td className="px-4 py-4 whitespace-nowrap text-title">{transaction.title}</td>
                    <td className={`px-4 py-4 whitespace-nowrap text-left ${transaction.type === 'INCOME'? "text-income" : "text-outcome"}`}>{formatCurrency(transaction.price)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.data ? formatDate(new Date(transaction.data)) : ''}</td>    
                    <td className="px-4 py-4 whitespace-nowrap text-left">
                        <button
                            onClick={() => onOpenEditModal(transaction)}
                            className="text-gray-500 hover:text-blue-500 transition-colors mr-3"
                            title="Editar transação"
                        >
                            <PencilSimple size={20} />
                        </button>
                        <button
                            onClick={() => {
                                if (transaction.id) {
                                    onOpenDeleteModal(transaction.id);
                                }
                            }}
                            className="text-gray-500 hover:text-red-500 transition-colors"                                title="Excluir transação"
                        >
                            <Trash size={20} />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>    
    </> 
    )
}