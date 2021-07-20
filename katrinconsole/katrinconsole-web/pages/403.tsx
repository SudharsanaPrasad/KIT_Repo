import { WarningOutlined, } from '@ant-design/icons'
import React from 'react'
import { Die, } from '../components'

export function NotPermitted() {
    return (
        <Die icon={<WarningOutlined />} message="Invalid Access" />
    )
}
