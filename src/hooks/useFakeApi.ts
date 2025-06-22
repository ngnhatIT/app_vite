import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const useFakeApi = <T>(endpoint: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get<T[]>(`/${endpoint}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message ?? err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    axiosInstance
      .get<T[]>(`/${endpoint}`)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message ?? err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  const createItem = async (item: Partial<T>): Promise<T> => {
    const res = await axiosInstance.post<T>(`/${endpoint}`, item);
    setData((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateItem = async (id: string, item: Partial<T>): Promise<T> => {
    const res = await axiosInstance.put<T>(`/${endpoint}/${id}`, item);
    setData((prev) => prev.map((d: any) => (d.id === id ? res.data : d)));
    return res.data;
  };

  const deleteItem = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/${endpoint}/${id}`);
    setData((prev) => prev.filter((d: any) => d.id !== id));
  };

  const login = async (
    credentials: { username: string; password: string }
  ): Promise<{ access_token: string; user: any }> => {
    const { username, password } = credentials;
    const res = await axiosInstance.get(`/login`, {
      params: { username, password },
    });
    return res.data;
  };

  return {
    data,
    loading,
    error,
    refetch,
    setData,
    createItem,
    updateItem,
    deleteItem,
    login,
  };
};
