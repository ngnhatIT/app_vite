// 📌 DTO REQUEST

/** Kiểm tra workspace có cần password không */
export interface CheckUserInWspDTO {
  wspId: string;
}

/** Đăng nhập workspace */
export interface LoginWspDTO {
  wspId: string;
  password: string;
}

/** Tạo file google sheet */
export interface CreateFileGoogleSheetDTO {
  wspId: string;
  fileName: string;
}

/** Lấy danh sách file google sheet */
export interface ListFileGoogleSheetDTO {
  wspId: string;
}

/** Refresh (đồng bộ) danh sách file */
export interface RefeshListSheetDTO {
  wspId: string;
}

/** Xoá file google sheet */
export interface DeleteSheetDTO {
  googleSheetId: string;
  wspId: string;
}

/** Lấy danh sách user theo sheet */
export interface ListUserBySheetDTO {
  sheetId: string;
}

/** Thêm user vào sheet */
export interface AddUserSheetDTO {
  sheetId: string;
  userId: string;
  userName: string;
}

/** Xoá user khỏi sheet */
export interface DelUserSheetDTO {
  sheetId: string;
  userId: string;
}

// 📌 DTO RESPONSE

/** Response chung */
export interface ResponseDTO<T = unknown> {
  message: string;
  success?: boolean;
  list?: T;
}

// 📌 DTO CHO DANH SÁCH FILE

/** 1 file google sheet */
export interface GoogleSheetFile {
  sheetId: string;
  sheetName: string;
  googleSheetId: string;
  pathFileLocal: string;
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// 📌 DTO CHO DANH SÁCH USER-PERMISSION

/** 1 user trong sheet với quyền */
export interface SheetUserPermission {
  sheetId: string;
  userId: string;
  userName: string;
  permissionName: string;
}

export interface UpdateUserPermissionDTO {
  sheetId: string;
  changes: {
    userId: string;
    permissions: string[];
  }[];
}

export interface WorkspaceListByUserResponseDto {
  workspaceId: string;
  workspaceName: string;
}
