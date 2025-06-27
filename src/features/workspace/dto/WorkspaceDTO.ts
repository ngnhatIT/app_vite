// types/WorkspaceDTO.ts
export interface WorkspaceDTO {
  id?: number;
  name: string;
  description?: string;
  owner: string;
  password?: string;
}

export interface AddUserToWorkspaceDTO {
  workspaceId: number;
  email: string;
}

export interface ChangeWorkspacePasswordDTO {
  workspaceId: number;
  currentPassword: string;
  newPassword: string;
}
