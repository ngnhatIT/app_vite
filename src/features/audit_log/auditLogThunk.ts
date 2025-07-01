import { createAsyncThunk } from "@reduxjs/toolkit";
import { auditLogService } from "./auditLogService";

export const fetchAduditLogThunk = createAsyncThunk("system/audit-log",async()=> {
    const res = await auditLogService.fetchAuditLog();
    return res;
});