import axios, { AxiosError } from "axios";
import { API_GATEWAYS, default as API_PATHS } from "~/constants/apiPaths";
import { Product } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useProducts() {
  return useQuery<Product[], AxiosError>(
    "products",
    async () => {
      const res = await axios.get<Product[]>(
        `${API_GATEWAYS.products}/products`
      );
      return res.data;
    }
  );
}

export function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("products", { exact: true }),
    []
  );
}

export function useProduct(id?: string): ReturnType<typeof useQuery<Product, AxiosError>> {
  return useQuery<Product, AxiosError>(
    ["product", { id }],
    async (): Promise<Product> => {
      const res = await axios.get<Product>(
        `${API_GATEWAYS.products}/products/${id}`
      );
      return res.data as Product;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: Product) =>
    axios.put<Product>(`${API_PATHS.bff}/product`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`
      }
    })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.product}/product/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`
      }
    })
  );
}
