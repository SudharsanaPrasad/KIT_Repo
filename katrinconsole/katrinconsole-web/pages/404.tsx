import React from 'react'
import { ExclamationCircleOutlined, } from '@ant-design/icons'
import { Die, } from '../components/die'

export function NotFound() {
    return (
        <Die icon={<ExclamationCircleOutlined />} message="404 Not Found" />
    )
}
