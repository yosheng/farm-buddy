import { Alert } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';

import { useSignIn } from '@/services/hooks/sign';

const LoginMessage: React.FC<{ content: string }> = ({ content }) => {
  return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
};

export default function Login() {
  const { userLoginState, signIn } = useSignIn();

  const onSubmit = async (values: any) => {
    await signIn(values);
  };

  return (
    <LoginForm
      title="Farm Buddy"
      subTitle="農小秘讓每個農民都有專業顧問"
      submitter={{ searchConfig: { submitText: '登入' } }}
      onFinish={async (values) => await onSubmit(values)}
    >
      {userLoginState && <LoginMessage content="帳號或密碼錯誤" />}
      <ProFormText
        name="username"
        fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
        placeholder="帳號: admin or user"
        rules={[{ required: true, message: '請輸入帳號!' }]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
        placeholder="密碼: farm"
        rules={[{ required: true, message: '請輸入密碼！' }]}
      />
    </LoginForm>
  );
}
