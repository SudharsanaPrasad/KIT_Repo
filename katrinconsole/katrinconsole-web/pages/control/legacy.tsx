import { Select, Typography, Button, } from 'antd'
import React, { useContext, useState, } from 'react'
import { AppContext, } from '../../contexts'
import { useEffectAsync, } from '../../hooks'
import { Sources, } from '../../services'

const { Option, } = Select
const { Text, } = Typography

export function LegacyMigrator() {
    const [sources, setSources,] = useState<Sources>({ servers: [], count: 0, })
    const [selected, setSelected,] = useState<string>()
    const { legacyControl, } = useContext(AppContext)
    useEffectAsync(async () => {
        const sources = await legacyControl.getSources()
        if (sources) {
            setSources(sources)
        }
    }, [])

    const selectionChange = (value: string) => {
        setSelected(value)
    }

    const onDownloadClick = async () => {
        if (selected) {
            await legacyControl.downloadSourceCsv(selected)
        }
    }

    return (
        <div>
            <p>
                <Text style={{ fontSize: '3em', }}>Legacy Control Migrator</Text>
            </p>
            <p>
                <Text style={{ fontSize: '1.5em', }}>
                    Generate OPC UA configuration for 10 devices
                </Text>
            </p>
            <Select defaultActiveFirstOption loading={sources.count == 0}
                onChange={selectionChange} style={{ width: '300px', marginRight: '10px', }}>
                {sources.servers.map(s => <Option key={s} value={s}>{s}</Option>)}
            </Select>
            <Button type="primary"
                onClick={onDownloadClick}>Download</Button>
        </div>
    )
}
