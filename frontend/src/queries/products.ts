import axios, { AxiosError } from "axios";
import { API_GATEWAYS, default as API_PATHS } from "~/constants/apiPaths";
import { Product, AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "products",
    async () => {
      const res = await axios.get<AvailableProduct[]>(
        `${API_GATEWAYS.products}/products`
      );
      return res.data as AvailableProduct[];
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

export function useProduct(id?: string): ReturnType<typeof useQuery<AvailableProduct, AxiosError>> {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async (): Promise<AvailableProduct> => {
      const res = await axios.get<AvailableProduct>(
        `${API_GATEWAYS.products}/products/${id}`
      );
      return res.data as AvailableProduct;
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

export function useCreateAvailableProduct() {
  return useMutation((values: Product) =>
    axios.post<Product>(`${API_GATEWAYS.products}/products`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`
      }
    })
  );
}

export function useUpdateAvailableProduct() {
  return useMutation((values: Product) =>
    axios.put<Product>(`${API_GATEWAYS.products}/products/${values.id}`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`
      }
    })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_GATEWAYS.products}/products/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`
      }
    })
  );
}
