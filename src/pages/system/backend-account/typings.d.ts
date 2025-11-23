export type BackendAccountItem = {
  id: number
  username: string
  displayName: string
  isActive: boolean
  lastLoginTime: string
  createTime: string
};

export type ResBackendAccount = API.ResPagination<BackendAccountItem>;

export type QsAdmin = API.QuePaging & { name?: string; role?: number };
