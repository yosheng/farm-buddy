import { Modal } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';
import type { ChatMessageItem } from './typings';

type RefMethods = { open: (val: ChatMessageItem) => void };
export type ChatMessageModalType = RefMethods | undefined;

type ChatMessageModalProps = {
  finish?: () => void;
};

const roleMap: { [key: number]: string } = {
  0: 'None',
  1: '用戶',
  2: '助手',
};

const ChatMessageModal = forwardRef<ChatMessageModalType, ChatMessageModalProps>(({ finish: _ }, ref) => {
  const [messageData, setMessageData] = useState<ChatMessageItem>();

  useImperativeHandle(ref, () => ({
    open: (val) => {
      setMessageData(val);
    },
  }));

  const onCancel = () => setMessageData(undefined);

  return (
    <Modal
      open={!!messageData}
      title="聊天訊息詳情"
      onOk={onCancel}
      onCancel={onCancel}
      okText="關閉"
      cancelText="取消"
      footer={null}
      width={800}
    >
      {messageData && (
        <div style={{ fontSize: 14 }}>
          <div style={{ marginBottom: 16 }}>
            <strong>用戶 ID：</strong>
            <span>{messageData.userId}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>角色：</strong>
            <span>{roleMap[messageData.role] || `角色 ${messageData.role}`}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>建立時間：</strong>
            <span>{messageData.createTime}</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>訊息內容：</strong>
          </div>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: 12,
              borderRadius: 4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {messageData.content}
          </div>
        </div>
      )}
    </Modal>
  );
});

ChatMessageModal.displayName = 'ChatMessageModal';

export default ChatMessageModal;