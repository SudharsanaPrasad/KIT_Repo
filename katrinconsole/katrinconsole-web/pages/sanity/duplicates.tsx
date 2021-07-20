import React, { useContext, useState, } from 'react'
import { Loader, } from '../../components'
import { AppContext, } from '../../contexts'
import { useEffectAsync, } from '../../hooks'
import { AdeiDuplicate, AdeiDuplicates, } from '../../services'
import { Typography, Table, } from 'antd'
import { ColumnsType, } from 'antd/lib/table'

const { Text, } = Typography

interface DuplicateState {
    data: AdeiDuplicate[]
    columns: ColumnsType<AdeiDuplicate>
}

interface DuplicateProps {
    channelId: string
    total: number
    duplicates: AdeiDuplicate[]
}

function generateTableState(dups: AdeiDuplicate[]): DuplicateState {
    const duplicates = (dups || []).map((g, idx) => {
        return { key: `${g.uid}_${idx}`, ...g, }
    })

    const columns: ColumnsType<AdeiDuplicate> = [
        {
            title: <Text>Database Server</Text>,
            dataIndex: 'db_server',
        },
        {
            title: <Text>Database Name</Text>,
            dataIndex: 'db_name',
        },
        {
            title: <Text>Database Group</Text>,
            dataIndex: 'db_group',
        },
        {
            title: <Text>Channel ID</Text>,
            dataIndex: 'chid',
        },
        {
            title: <Text>URL</Text>,
            dataIndex: 'url',
        },
    ]

    return { columns: columns, data: duplicates, }
}

function Duplicate({ channelId, duplicates, }: DuplicateProps) {
    const { columns, data, } = generateTableState(duplicates)
    return (
        <div style={{ marginBottom: '50px', marginTop: '30px', }}>
            <p>
                <Text style={{ fontSize: '1.25em', fontWeight: 'bold', marginRight: '10px', }}>{channelId}</Text>
            </p>
            <div>
                <Table columns={columns} dataSource={data} pagination={false} />
            </div>
        </div>
    )
}

export function Duplicates() {
    const [duplicates, setDuplicates,] = useState<AdeiDuplicates>()
    const { sanity, } = useContext(AppContext)

    useEffectAsync(async () => {
        const dups = await sanity.duplicates()
        if (dups) {
            setDuplicates(dups)
        }
    }, [])

    if (!duplicates) {
        return <Loader />
    }

    return (
        <div>
            <span>
                <p>
                    <Text style={{ fontSize: '3em', }}>{duplicates.total} Duplicates</Text>
                </p>
                <p>
                    <Text style={{ fontSize: '1.5em', }}> {duplicates.unique_channels} channels</Text>
                </p>
            </span>
            <div>
                {duplicates.duplicates.map(di =>
                    <Duplicate key={`${di.channel_uid}`} channelId={di.channel_uid} total={di.total} duplicates={di.duplicates} />)
                }
            </div>
        </div>
    )
}
