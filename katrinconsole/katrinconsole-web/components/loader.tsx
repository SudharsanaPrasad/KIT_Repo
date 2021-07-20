import { LoadingOutlined, } from '@ant-design/icons'
import { Typography, } from 'antd'
import React, { useEffect, useState, } from 'react'

export function Loader() {
    const [message, setMessage,] = useState<string>()

    useEffect(() => {
        setTimeout(() => setMessage('This is taking longer than usual. Is it a complex algorithm?'), 3000)
    })
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', height: '100%',
        }}>
            <span style={{ fontSize: '5rem', marginRight: '10px', }} >
                <LoadingOutlined style={{ color: '#1890ff', }} />
            </span>
            <span style={{ height: '10px', }}>
                <Typography.Text>{message}</Typography.Text>
            </span>
        </div>
    )
}
