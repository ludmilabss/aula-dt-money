import { ITransaction } from "@/types/transaction";
import { api } from "../api";

export async function getTransactions(): Promise<ITransaction[]> {
  try {
    const response = await api.get('/transaction');
    return response.data.transactions || response.data || []; 
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw new Error("Não foi possível buscar as transações.");
  }
}

export async function createTransaction(transaction: Omit<ITransaction, 'id'>): Promise<ITransaction> {
  try {
    const response = await api.post('/transaction', transaction);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw new Error("Não foi possível criar a transação.");
  }
}

export async function updateTransaction(transaction: ITransaction): Promise<ITransaction> {
  try {
    const { id, ...data } = transaction;
    const response = await api.put(`/transaction/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw new Error("Não foi possível atualizar a transação.");
  }
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  try {
    await api.delete(`/transaction/${transactionId}`);
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    throw new Error("Não foi possível excluir a transação.");
  }
}
