"use client";
import { useMemo, useState, useEffect } from "react";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { DeleteModal } from "@/components/DeleteModal";
import { useTransactions } from "@/hooks/transactions";
import { ITotal, ITransaction } from "@/types/transaction";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<ITransaction | null>(null);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useTransactions.ListAll();

  const { mutateAsync: addTransaction } = useTransactions.Create();
  const { mutateAsync: updateTransaction } = useTransactions.Update();
  const { mutateAsync: deleteTransaction } = useTransactions.Delete();

  const transactions = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

  const handleOpenCreateModal = () => {
    setTransactionToEdit(null); 
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (transaction: ITransaction) => {
    setTransactionToEdit(transaction);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setTransactionToEdit(null);
  };

  const handleSaveTransaction = async (data: ITransaction) => {
    try {
      if (data.id) { 
        await updateTransaction(data);
      } else { 
        await addTransaction(data);
      }
      handleCloseFormModal();
    } catch (error) {
      console.error("Falha ao salvar a transação", error);
    }
  };

  const handleOpenDeleteModal = (id: string): void => {
    setTransactionIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionIdToDelete(null);
  };

  const handleDeleteTransaction = async () => {
    if (transactionIdToDelete) {
      try {
        await deleteTransaction(transactionIdToDelete);
        handleCloseDeleteModal(); 
      } catch (error) {
        console.error("Falha ao deletar a transação", error);
      }
    }
  };

  const totalTransactions: ITotal = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalIncome: 0, totalOutcome: 0, total: 0 };
    }
    return transactions.reduce(
      (acc: ITotal, transaction) => {
        if (!transaction.type || !transaction.price) return acc; 

        const { type, price } = transaction;
        if (type === 'INCOME') {
          acc.totalIncome += Number(price);
          acc.total += Number(price);
        } else if (type === 'OUTCOME') {
          acc.totalOutcome += Number(price);
          acc.total -= Number(price);
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0, total: 0 }
    );
  }, [transactions]);

  if (!isClient || status === 'pending') {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  if (status === 'error') return <div className="text-center mt-10">Erro ao carregar dados.</div>;

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <Header openModal={handleOpenCreateModal} />
      <BodyContainer>
        <CardContainer totals={totalTransactions} />
        <Table data={transactions} onOpenDeleteModal={handleOpenDeleteModal} onOpenEditModal={handleOpenEditModal} />
        
        <div className="mt-8 mb-8 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="px-6 py-3 font-semibold text-white bg-income rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage
              ? 'Carregando mais...'
              : hasNextPage
              ? 'Carregar mais'
              : 'Fim das transações'}
          </button>
        </div>

        {isFormModalOpen && <FormModal closeModal={handleCloseFormModal} onSave={handleSaveTransaction} editTransaction={transactionToEdit} />}
        {isDeleteModalOpen && <DeleteModal onConfirm={handleDeleteTransaction} onClose={handleCloseDeleteModal} />}
      </BodyContainer>
    </div>
  );
}
