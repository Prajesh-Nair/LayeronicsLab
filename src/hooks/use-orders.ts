import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { OrderStatus } from "@/db/mappers.server";
import { listOrders, updateOrderStatus } from "@/lib/api/orders";

export const ordersQueryKey = ["admin", "orders"] as const;

export function useAdminOrders(enabled = true) {
  return useQuery({
    queryKey: ordersQueryKey,
    queryFn: () => listOrders(),
    enabled,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; status: OrderStatus }) =>
      updateOrderStatus({ data: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  });
}
