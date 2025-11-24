import request from '@/utils/request';
import type { ResBackendAccount, QsAdmin, BackendAccountItem } from './typings';

export async function fetchBackendAccount(params?: QsAdmin) {
  return request<ResBackendAccount>('/api/BackendAccount', { params });
}

export async function fetchRolesEnum() {
  return request<API.ResEnum>('/api/sys/role/enum');
}

/** 新增管理員 */
export async function createAdmin(data: BackendAccountItem) {
  return request<BackendAccountItem>('/api/BackendAccount', {
    method: 'post',
    data,
  });
}

/** 修改管理員 */
export async function updateAdmin(id: string | number, data: Partial<BackendAccountItem>) {
  return request<BackendAccountItem>(`/api/BackendAccount/${id}`, {
    method: 'put',
    data,
  });
}

/** 删除管理员 */
export async function delAdmin(id: string | number) {
  return request<void>(`/api/BackendAccount/${id}`, {
    method: 'delete',
  });
}
