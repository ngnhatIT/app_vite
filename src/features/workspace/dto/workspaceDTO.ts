export interface WorkspaceReponseDTO {
  workspaceId: string;
  workspaceName: string;
}

export interface WorkspaceDetailDTO {}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
  isProtected: boolean;
}
