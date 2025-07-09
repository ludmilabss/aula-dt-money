"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { useTransactions } from "@/hooks/transactions"; 
import { ITotal, ITransaction } from "@/types/transaction";
import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { DeleteModal } from "@/components/DeleteModal"; 

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<ITransaction | null>(null);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState<string | null>(null);

  const { data: transactions, isLoading } = useTransactions.ListAll();
  const { mutateAsync: addTransaction } = useTransactions.Create();
  const { mutateAsync: updateTransaction } = useTransactions.Update();
  const { mutateAsync: deleteTransaction } = useTransactions.Delete();

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

  const handleOpenDeleteModal = (id: string) => {
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
      (acc: ITotal, { type, price }: ITransaction) => {
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <Header openModal={handleOpenCreateModal} />
      <BodyContainer>
        <CardContainer totals={totalTransactions} />
        <Table data={transactions || []} onOpenDeleteModal={handleOpenDeleteModal} onOpenEditModal={handleOpenEditModal} />
        { isFormModalOpen && <FormModal closeModal={handleCloseFormModal} onSave={handleSaveTransaction} editTransaction={transactionToEdit} /> }
        { isDeleteModalOpen && ( <DeleteModal onConfirm={handleDeleteTransaction} onClose={handleCloseDeleteModal} /> )}
      </BodyContainer>
    </div>
  );
}
