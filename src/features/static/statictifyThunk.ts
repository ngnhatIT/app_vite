import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosIntance";

export const fetchStatictifyThunk = createAsyncThunk(
  "workspace/fetchPaginated",
  async ({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }) => {
    const response = await axiosInstance.get("/workspaces", {
      params: {
        page,
        pageSize,
        search,
      },
    });
    return {
      list: response.data.data,
      total: response.data.total,
    };
  }
);
