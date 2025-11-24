import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { Spin, message, Typography, Button, Tooltip } from 'antd';
import { useMutation } from '@tanstack/react-query';

type DelLinkBtnProps = {
  id?: number | string;
  fn: (params?: any) => Promise<any>;
  text?: string;
  finish?: () => void;
  icon?: boolean;
};

const DelLinkBtn = ({ id, fn, finish, text = '刪除', icon }: DelLinkBtnProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: fn,
    onSuccess: () => {
      message.success('刪除成功！');
      finish?.();
    },
    onError: () => {
      message.error('刪除失敗!');
    },
  });

  return icon ? (
    <Tooltip title={text}>
      <Button size="small" icon={<DeleteOutlined />} onClick={() => mutate(id)} danger />
    </Tooltip>
  ) : (
    <Spin delay={200} spinning={isPending} size="small" indicator={<LoadingOutlined />}>
      <Typography.Link type="danger" onClick={() => mutate(id)}>
        {text}
      </Typography.Link>
    </Spin>
  );
};

export default DelLinkBtn;
