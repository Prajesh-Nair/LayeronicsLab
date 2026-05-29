import { useQuery } from "@tanstack/react-query";

import { listProducts } from "@/lib/api/products";

export const productsQueryKey = ["products"] as const;

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: () => listProducts(),
    staleTime: 30_000,
  });
}
