import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef } from 'react';

import { fetchSystemSetting } from './service';
import type { SystemSettingItem } from './typings';

export default function SystemSetting() {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<SystemSettingItem>[] = [
    {
      title: '設定鍵',
      dataIndex: 'key',
      fieldProps: { placeholder: '請輸入設定鍵' }
    },
    {
      title: '設定值',
      dataIndex: 'value',
      fieldProps: { placeholder: '請輸入設定值' }
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<SystemSettingItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const data = await fetchSystemSetting({ ...params, sort });

          return {
            data: data?.items || [],
            success: !!data,
            total: data?.total || 0,
          };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto', searchText: '查詢', resetText: '重置' }}
        options={{ setting: { listsHeight: 400 } }}
        dateFormatter="string"
        headerTitle="系統配置列表"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 條 / 共 ${total} 條`
        }}
      />
    </PageContainer>
  );
}