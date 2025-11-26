import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';

import { fetchChatMessage } from './service';
import type { ChatMessageItem } from './typings';
import type { ChatMessageModalType } from './ChatMessageModal';
import ChatMessageModal from './ChatMessageModal';

export default function ChatMessage() {
  const actionRef = useRef<ActionType>();
  const messageModalRef = useRef<ChatMessageModalType>();

  const columns: ProColumns<ChatMessageItem>[] = [
    {
      title: '用戶 ID',
      dataIndex: 'userId',
      fieldProps: { placeholder: '請輸入用戶 ID' }
    },
    {
      title: '角色',
      dataIndex: 'role',
      search: false,
      render: (_, record) => {
        const roleMap: { [key: number]: string } = {
          0: 'None',
          1: '用戶',
          2: '助手',
        };
        return roleMap[record.role] || `角色 ${record.role}`;
      },
    },
    {
      title: '內容',
      dataIndex: 'content',
      search: false,
      render: (text, record) => {
        const content = text as string;
        return (
          <a onClick={() => messageModalRef.current?.open(record)}>
            {content?.length > 50 ? `${content.substring(0, 50)}...` : content}
          </a>
        );
      },
    },
    {
      title: '建立時間',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      editable: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<ChatMessageItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const data = await fetchChatMessage({ ...params, sort });

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
        headerTitle="聊天訊息列表"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 條 / 共 ${total} 條`,
        }}
      />
      <ChatMessageModal ref={messageModalRef} />
    </PageContainer>
  );
}
