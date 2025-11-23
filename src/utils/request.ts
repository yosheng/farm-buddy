import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import { message, notification } from 'antd';
import store from '@/utils/store';

const instance = axios.create({
  // baseURL: 'http://10.80.10.95:9001',
  // timeout: 1000,
});

const CODE_MESSAGE: any = {
  200: '服務器成功返回請求的數據。',
  201: '新建或修改數據成功。',
  202: '一個請求已經進入後台排隊（異步任務）。',
  204: '刪除數據成功。',
  400: '發出的請求有錯誤，服務器沒有進行新建或修改數據的操作。',
  401: '用戶沒有權限（令牌、用戶名、密碼錯誤）。',
  403: '用戶得到授權，但是訪問是被禁止的。',
  404: '發出的請求針對的是不存在的記錄，服務器沒有進行操作。',
  406: '請求的格式不可得。',
  410: '請求的資源被永久刪除，且不會再得到的。',
  422: '當創建一個對象時，發生一個驗證錯誤。',
  500: '服務器發生錯誤，請檢查服務器。',
  502: '閘道器錯誤。',
  503: '服務不可用，服務器暫時過載或維護。',
  504: '閘道器超時。',
};

// 異常處理程序
const errorHandler = (error: AxiosError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = CODE_MESSAGE[response.status] || response.statusText;
    const { status, config } = response;

    notification.error({
      message: `請求錯誤 ${status}: ${config.url}`,
      description: errorText,
    });

    if (status === 401) {
      window.location.href = '/login';
    }
  }
};

type Res<U = any> = { data?: U; code?: number; msg?: string };

export default async function <T>(
  url: string,
  options?: AxiosRequestConfig,
): Promise<T | undefined> {
  const token = store.get('token');
  // 配置请求参数等信息
  const result = await instance<Res<T>>({
    url,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` },
    ...options,
  }).catch(errorHandler);

  const httpStatus = result?.status;

  if (httpStatus && httpStatus >= 200 && httpStatus < 300) {
    const model = result.data;
    if (model.code === 200) return model.data;

    // 後台請求錯誤處理
    const msg = model.msg ?? '系統錯誤';
    message.error(msg);
    return Promise.reject(new Error(msg, { cause: model }));
  }

  return Promise.reject(new Error('系統錯誤'));
}
