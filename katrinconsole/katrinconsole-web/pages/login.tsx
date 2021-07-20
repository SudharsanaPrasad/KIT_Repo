import { CloseCircleOutlined, LoadingOutlined, LockOutlined, LoginOutlined, UserOutlined, } from '@ant-design/icons'
import { Button, Card, Form, Input, Layout, Space, Typography, } from 'antd'
import React, { useContext, useState, } from 'react'
import { Redirect, useHistory, } from 'react-router-dom'
import { AppContext, } from '../contexts'

const Content = Layout.Content
const { Text, } = Typography

interface LoginFormData {
    username: string
    password: string
}

interface FormState {
    failed?: boolean
    loading?: boolean
}

export function Login() {
    const { auth, } = useContext(AppContext)
    const history = useHistory()
    const { isAuthenticated, } = auth
    const [formState, setFormState,] = useState<FormState>({ loading: false, })

    const onFinish = async (values: LoginFormData) => {
        const { username, password, } = values
        setFormState({ loading: true, })
        const success = await auth.login(username, password)
        setFormState({ failed: !success, loading: false, })
    }

    const onFinishFailed = () => {
        setFormState({ failed: true, loading: false, })
    }

    const loginIcon = (loading: boolean, failed: boolean) => {
        if (!loading) {
            if (failed) {
                return <CloseCircleOutlined />
            }
            return <LoginOutlined />
        }

        return <LoadingOutlined />
    }

    if (formState.failed == false || isAuthenticated) {
        return <Redirect to={{ pathname: '/dashboard', state: { from: history.location, }, }} />
    }

    return (
        <Layout>
            <Space align="center" direction="vertical" style={{ justifyContent: 'center', minHeight: '100vh', }}>
                <Content>
                    <Card title={<Text>KATRIN Console</Text>} headStyle={{ fontSize: '3em', fontWeight: 'normal', textAlign: 'center', }}
                        bordered={true} size="default" >
                        <Form name="login-form" initialValues={{ remember: true, }} size="middle"
                            onFinish={onFinish} onFinishFailed={onFinishFailed}>
                            <Form.Item name="username" rules={[{
                                required: true,
                                message: 'Please input your username!',
                            },]}>
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} />
                            </Form.Item>

                            <Form.Item name="password" rules={[{
                                required: true,
                                message: 'Please input your password!',
                            },]}>
                                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
                            </Form.Item>

                            <Form.Item>
                                <Button style={{ float: 'right', }} type="primary" htmlType="submit" loading={formState.loading}
                                    icon={loginIcon(formState.loading || false, formState.failed || false)}>Login</Button>
                            </Form.Item>
                        </Form>
                        {formState.failed && <Text type="danger">Failed to login!</Text>}
                    </Card>
                </Content>
            </Space>
        </Layout>
    )
}
