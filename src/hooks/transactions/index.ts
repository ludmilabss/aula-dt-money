import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from "@/services/transactions";
import type { PaginatedResponse } from "@/services/transactions"; 
import { ITransaction } from "@/types/transaction";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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
    return useInfiniteQuery({ 
      queryKey: [QUERY_KEY], 
      queryFn: getTransactions,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      }
    });
  },

  Update: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateTransaction,
      onMutate: async (updatedTransaction: ITransaction) => {
        await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
        const previousData = queryClient.getQueryData<any>([QUERY_KEY]);

        if (previousData) {
          queryClient.setQueryData([QUERY_KEY], (oldData: any) => ({
            ...oldData,
            pages: oldData.pages.map((page: PaginatedResponse) => ({
              ...page,
              data: page.data.map(t => t.id === updatedTransaction.id ? updatedTransaction : t),
            })),
          }));
        }
        return { previousData };
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData([QUERY_KEY], context.previousData);
        }
        toast.error("Erro ao atualizar transação.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
      onSuccess: () => {
        toast.success("Transação atualizada com sucesso!");
      }
    });
  },

  Delete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteTransaction,
      onMutate: async (deletedId: string) => {
        await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
        const previousData = queryClient.getQueryData<any>([QUERY_KEY]);

        if (previousData) {
          queryClient.setQueryData([QUERY_KEY], (oldData: any) => ({
            ...oldData,
            pages: oldData.pages.map((page: PaginatedResponse) => ({
              ...page,
              data: page.data.filter(t => t.id !== deletedId),
            })),
          }));
        }
        return { previousData };
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData([QUERY_KEY], context.previousData);
        }
        toast.error("Erro ao deletar transação.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
      onSuccess: () => {
        toast.success("Transação deletada com sucesso!");
      }
    });
  },
};
