import request from "@/utils/request.ts";
import type {
  QsSystemSetting,
  ResSystemSetting,
  SystemSettingItem,
} from '@/pages/system/setting/typings';

export async function fetchSystemSetting(params?: QsSystemSetting) {
  return request<ResSystemSetting>('/api/SystemSetting', { params });
}

export async function updateSystemSetting(data: SystemSettingItem) {
  return request<SystemSettingItem>('/api/SystemSetting', {
    method: 'put',
    data,
  });
}
