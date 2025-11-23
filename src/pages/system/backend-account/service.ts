import request from '@/utils/request';
import type { ResBackendAccount, QsAdmin, BackendAccountItem } from './typings';

export async function fetchBackendAccount(params?: QsAdmin) {
  return request<ResBackendAccount>('/api/BackendAccount', { params });
}

export async function fetchRolesEnum() {
  return request<API.ResEnum>('/api/sys/role/enum');
}

/** 新增编辑管理员 */
export async function mutateAdmin(data: BackendAccountItem) {
  return request<API.ResEnum>('/api/sys/admin/mutate', {
    method: 'post',
    data,
  });
}

/** 删除管理员 */
export async function delAdmin(id: string | number) {
  return request<API.ResEnum>(`/api/sys/admin/${id}`, {
    method: 'delete',
  });
}
