import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef } from 'react';

import DelLinkBtn from '@/components/DelLinkBtn';

import { delAdmin, fetchBackendAccount } from './service';
import type { BackendAccountItem } from './typings';

import type { MutateType } from './MutateAdmin';
import MutateAdmin from './MutateAdmin';

export default function BackendAccount() {
  const actionRef = useRef<ActionType>();
  const mutateRef = useRef<MutateType>();

  // const { data: roles } = useQuery({
  //   queryKey: ['roles-enum'],
  //   queryFn: fetchRolesEnum,
  // });

  const columns: ProColumns<BackendAccountItem>[] = [
    { title: '管理员名称', dataIndex: 'name' },
    {
      title: '是否可用',
      dataIndex: 'enable',
      valueType: 'select',
      valueEnum: {
        true: { text: '是', status: 'Processing' },
        false: { text: '否', status: 'Default' },
      },
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      search: false,
      editable: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      editable: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) =>
        [
          <a key="edit" onClick={() => mutateRef.current?.open(record)}>
            編輯
          </a>,
        ].concat(
          record.username !== 'admin'
            ? [
                <DelLinkBtn
                  key="del"
                  id={record.id}
                  fn={delAdmin}
                  finish={() => actionRef.current?.reload()}
                />,
              ]
            : [],
        ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<BackendAccountItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const data = await fetchBackendAccount({ ...params, sort });

          return {
            data: data?.items || [],
            success: !!data,
            total: data?.total || 0,
          };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        options={{ setting: { listsHeight: 400 } }}
        dateFormatter="string"
        headerTitle="後台帳號列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => mutateRef.current?.open()}
            type="primary"
          >
            新增
          </Button>,
        ]}
      />
      {/*TODO: opts={{ roles }}*/}
      <MutateAdmin opts={{}} ref={mutateRef} finish={() => actionRef.current?.reload()} />
    </PageContainer>
  );
}
