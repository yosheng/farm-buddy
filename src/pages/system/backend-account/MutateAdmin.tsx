import { Modal, Form, Input, Radio, Alert, message } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mutateAdmin } from './service';
import type { BackendAccountItem } from './typings';

type RefMethods = { open: (val?: BackendAccountItem) => void };
export type MutateType = RefMethods | undefined;

type MutateProps = {
  opts: { roles?: API.EnumItem[]; [propName: string]: any };
  finish?: () => void;
};

const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
// { opts, finish } 改 { finish }
const MutateAdmin = forwardRef<MutateType, MutateProps>(({ finish }, ref) => {
  const [form] = Form.useForm();
  const pwd = Form.useWatch('password', form);
  // 设置一个值用于编辑或新增的表单初始数据，并用于控制窗口显示与隐藏
  const [initVal, setInInitVal] = useState<BackendAccountItem>();

  const isAdd = !initVal?.id;
  const titlePrefix = initVal?.id ? '更新' : '新增';

  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutateAdmin,
    onSuccess: () => {
      message.success(`${titlePrefix}成功！`);

      // 重置表单初始值，并用于关闭窗口
      setInInitVal(undefined);
      finish?.();
    },
    onError: () => {
      message.error(`${titlePrefix}失敗！`);
    },
  });

  useImperativeHandle(ref, () => ({
    open: (val) => {
      form.resetFields();
      if (val) form.setFieldsValue(val);
      setInInitVal(val || ({ isActive: true } as BackendAccountItem));
    },
  }));

  const onCancel = () => setInInitVal(undefined);

  const onOk = async () => {
    const fieldsVal = await form.validateFields().catch(console.error);
    if (!fieldsVal) return;
    await mutateAsync(isAdd ? fieldsVal : { ...fieldsVal, id: initVal?.id });
  };

  return (
    <Modal
      open={!!initVal}
      title={`${titlePrefix}後台帳號`}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={isPending}
    >
      <Form form={form} {...formItemLayout} initialValues={{ isActive: true }}>
        <Form.Item
          label="帳號"
          name="username"
          rules={[{ required: true, message: '請輸入帳號！' }]}
        >
          <Input placeholder="帳號" disabled={!isAdd} />
        </Form.Item>

        <Form.Item
          label="名稱"
          name="displayName"
          rules={[{ required: true, message: '請輸入名稱！' }]}
        >
          <Input placeholder="名稱" />
        </Form.Item>

        {/*<Form.Item*/}
        {/*  label="角色"*/}
        {/*  name="roleId"*/}
        {/*  rules={[{ required: true, message: '请输入管理员名称！' }]}*/}
        {/*>*/}
        {/*  <Select options={opts.roles} placeholder="请选择角色" />*/}
        {/*</Form.Item>*/}
        <Form.Item label="是否可用" name="isActive">
          <Radio.Group
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
          />
        </Form.Item>

        {isAdd ? null : (
          <Alert
            message="編輯時輸入密碼表示修改管理員密碼"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form.Item
          label="密碼"
          name="password"
          rules={[
            ...(isAdd || pwd ? [{ required: true, message: '請輸入密碼！' }] : []),
            { pattern: /^.{6,18}$/, message: '請輸入6-18位的密碼！' },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="請輸入密碼" />
        </Form.Item>

        <Form.Item
          label="確定密碼"
          name="confirmPwd"
          dependencies={['password']}
          hasFeedback
          rules={[
            ...(isAdd || pwd ? [{ required: true, message: '請再次輸入密碼！' }] : []),
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('確定密碼不匹配！'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="請再次輸入密碼" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default MutateAdmin;
