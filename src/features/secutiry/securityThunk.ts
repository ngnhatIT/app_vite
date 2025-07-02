import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosIntance";

interface FetchIncidentsParams {
  page: number;
  pageSize: number;
  user?: string;
  violation?: string;
  fromDate?: string;
  toDate?: string;
}

export const fetchIncidentsThunk = createAsyncThunk(
  "incident/fetchList",
  async (params: FetchIncidentsParams) => {
    const res = await axiosInstance.get("/security-incidents", { params });
    return {
      list: res.data.data,
      total: res.data.total,
    };
  }
);
