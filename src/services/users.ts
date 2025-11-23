import request from '@/utils/request';
export type UserInfo = {
  id: number
  username: string
  displayName: string
  isActive: boolean
  lastLoginTime: any
  createTime: string
};


/** 获取用户信息 */
export async function queryUserInfo() {
  return request<UserInfo>('/api/Auth/me');
}

/** 获取用户授权 */
export async function queryUserAuth() {
  // return request<string[]>('/api/sys/backend-account/auth');

  return Promise.resolve([
    'WELCOME',
    'DASHBOARD',
    'DASHBOARD:GMAP',
    'DASHBOARD:D1',
    'DASHBOARD:D2',
    'OPER_TOOLS',
    'OPER_TOOLS:USER_SEARCH',
    'user-button',
    'user-button',
    'OPER_TOOLS:ADS',
    'OPER_TOOLS:IDENTITY',
    'SYSTEM',
    'SYSTEM:ADMIN',
    'SYSTEM:ROLES',
    'SYSTEM:MENU',
    'SYSTEM:LOGS',
  ]);
}
