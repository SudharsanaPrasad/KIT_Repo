import { CheckCircleOutlined, CheckCircleTwoTone, CloseCircleOutlined, CloseCircleTwoTone, SmileTwoTone, } from '@ant-design/icons'
import { Card, Tag, Form, Input, Button, Descriptions, Divider, } from 'antd'
import React, { useContext, useState, } from 'react'
import { useHistory, } from 'react-router-dom'
import { AppContext, } from '../contexts'
import { useEffectAsync, } from '../hooks'
import { User, } from '../services'

const { Meta, } = Card

interface ProfileHistoryState {
    me: User
}

interface ChangePasswordFormValues {
    password: string
    confirm: string
}

export function Profile() {
    const { user, } = useContext(AppContext)
    const [me, setMe,] = useState<User>()
    const [loading, setLoading,] = useState<boolean>(false)
    const [icon, setIcon,] = useState<JSX.Element>()
    const history = useHistory()

    useEffectAsync(async () => {
        const state = history.location.state as ProfileHistoryState
        const me = !state ? await user.me() : state.me
        setMe(me)
    }, [])

    const changePassword = async (values: ChangePasswordFormValues) => {
        setLoading(true)
        const success = await user.changePassword(values.password)
        setLoading(false)
        if (success) {
            setIcon(<CheckCircleOutlined />)
        } else {
            setIcon(<CloseCircleOutlined />)
        }
    }

    const title = `Hi ${me?.username}!`
    const fullname = `${me?.firstName} ${me?.lastName}`

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
            <Card style={{ marginTop: 16, width: '40rem', }} loading={me == undefined}>
                <Meta avatar={<SmileTwoTone style={{ fontSize: '4.5em', }} />}
                    title={title}
                    description={fullname} style={{ marginBottom: '10px', }} />
                <Descriptions title="Details" column={1} colon={false} contentStyle={{ justifyContent: 'flex-end', }}>
                    <Descriptions.Item label="Email">{me?.email}</Descriptions.Item>
                    {me?.groups && me?.groups.length != 0 &&
                        <Descriptions.Item label="You are a member of:">
                            {(me?.groups || []).map(g => <Tag key={g}>{g}</Tag>)}
                        </Descriptions.Item>}
                    <Descriptions.Item label="Superuser">{me?.isSuperuser ?
                        <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#eb2f96" />}</Descriptions.Item>
                    <Descriptions.Item label="Admin">{me?.isStaff ?
                        <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#eb2f96" />}</Descriptions.Item>
                </Descriptions>
                <Divider />
                <Form name="change-password" wrapperCol={{ span: 18, }} labelCol={{ span: 6, }}
                    initialValues={{ remember: true, }} onFinish={changePassword}>
                    <Form.Item name="password" label="Password" rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]} hasFeedback={true}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="confirm" label="Confirm Password"
                        dependencies={['password',]} hasFeedback={true}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue, }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') == value) {
                                        return Promise.resolve()
                                    }

                                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                                },
                            }),
                        ]}>
                        <Input.Password />
                    </Form.Item>


                    <Form.Item wrapperCol={{ offset: 16, }}>
                        <Button style={{ float: 'right', }} type="primary"
                            htmlType="submit" loading={loading} icon={icon}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
