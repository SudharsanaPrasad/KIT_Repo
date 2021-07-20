import React from 'react'
import { Layout, Space, Typography, } from 'antd'

const { Content, } = Layout

interface DieProps {
    message: string
    icon: JSX.Element
}

export function Die(props: DieProps) {
    return (
        <Layout style={{ minHeight: '100vh', }}>
            <Space align="center" direction="vertical" style={{ justifyContent: 'center', minHeight: '100vh', }}>
                <Content>
                    <p style={{ fontSize: '5rem', }}>
                        <span style={{ marginRight: '10px', }} >
                            {props.icon}
                        </span>
                        <Typography.Text>{props.message}</Typography.Text>
                    </p>
                </Content>
            </Space>
        </Layout>
    )
}
