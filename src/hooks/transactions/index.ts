import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from "@/services/transactions";
import { ITransaction } from "@/types/transaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const QUERY_KEY = 'transactions';

export const useTransactions = {
  Create: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success("Transação adicionada com sucesso!");
      },
      onError: () => {
          toast.error("Erro ao adicionar transação.");
      }
    });
  },

  ListAll: () => {
    return useQuery({
      queryKey: [QUERY_KEY],
      queryFn: getTransactions,
      staleTime: 1000 * 60 * 5,
    });
  },

  Update: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success("Transação atualizada com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao atualizar transação.");
      }
    });
  },

  Delete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success("Transação deletada com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao deletar transação.");
      }
    });
  },
};
