// DTOs & types cho workspace

// 📝 Thành viên
export interface WorkspaceMember {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

// 📝 Workspace
export interface Workspace {
  workspaceId: string;
  workspaceName: string;
  workspaceOwner: string;
  email: string;
  avatar: string;
  desc?: string;
  members: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceDetail {
  workspaceId: string;
  workspaceName: string;
  description?: string;
  ownerId: string;
  ownerUsername?: string;
  isPasswordRequired: boolean;
  viewFileName?: string;
  editFileName?: string;
  commentFileName?: string;
}


// 📥 Tạo mới workspace
export interface CreateWorkspaceDTO {
  workspaceName: string;
  description?: string;
  ownerId: string;
  isPasswordRequired?: boolean;
  password?: string;
  confirmPassword?: string;

  viewConfig?: File;
  editConfig?: File;
  commentConfig?: File;
}
// 📥 Cập nhật workspace
export interface UpdateWorkspaceDTO {
  id: string;
  name?: string;
  owner?: string;
  desc?: string;
  file?: File;
  password?: string;
}

// 📥 Thêm thành viên
export interface AddMemberDTO {
  workspaceId: string;
  username: string;
}

// 📥 Xóa thành viên
export interface RemoveMembersDTO {
  workspaceId: string;
  memberIds: string[];
}

// 📥 Đổi mật khẩu
export interface ChangePasswordDTO {
  workspaceId: string;
  currentPassword: string;
  password: string;
  confirmPassword:string;
}

// 📥 Tìm kiếm/fetch list
export interface FetchWorkspacesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// 📤 Kết quả fetch (nếu có phân trang)
export interface FetchWorkspacesResponse {
  list: Workspace[];
  total: number;
}
