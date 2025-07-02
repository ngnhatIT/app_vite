import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/AxiosIntance";

interface FetchAuditLogParams {
  page: number;
  pageSize: number;
  workspace?: string;
  user?: string;
  action?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export const fetchAuditLogsThunk = createAsyncThunk(
  "auditlog/fetchList",
  async (params: FetchAuditLogParams) => {
    const res = await axiosInstance.get("/audit-logs", { params });
    return {
      list: res.data.data,
      total: res.data.total,
    };
  }
);
