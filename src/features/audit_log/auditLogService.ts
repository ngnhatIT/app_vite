import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";
import type { auditLogResponseDTO } from "./auditLogDTO";

export const auditLogService ={
    fetchAuditLog:async():Promise<auditLogResponseDTO> => handleApiCall(async()=>{
        const {data} = await axiosInstance.get("");
        return data;
    })
}