import { useLoaderData } from 'react-router';
import type { UserInfo } from '@/services/users';

export default () => {
  const { data } = (useLoaderData() as { data: [UserInfo, string[]] }) || {};
  return <>Demo : {data?.[0].name}</>;
};
