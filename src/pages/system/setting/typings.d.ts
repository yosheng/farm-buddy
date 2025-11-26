export type SystemSettingItem = {
  id: number
  key: string
  value: string
  description: string
};

export type ResSystemSetting = API.ResPagination<SystemSetting>;

export type QsSystemSetting = API.QuePaging & { key?: string; value?: number };
