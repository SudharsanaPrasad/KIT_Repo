import { Table, Typography, } from 'antd'
import { ColumnsType, SortOrder, } from 'antd/lib/table/interface'
import _ from 'lodash'
import React, { useContext, useState, } from 'react'
import { Loader, } from '../../components'
import { AppContext, } from '../../contexts'
import { useEffectAsync, } from '../../hooks'
import { AdeiChannel, } from '../../services'

const { Text, } = Typography

interface ChannelsState {
    columns: ColumnsType<AdeiChannel>
    data: AdeiChannel[]
}

function generateTableState(data: AdeiChannel[]): ChannelsState {
    const channels = (data || []).map(g => {
        return { key: g.name, ...g, }
    })

    const columns: ColumnsType<AdeiChannel> = [
        {
            title: <Text>Database Server</Text>,
            dataIndex: 'db_server',
            filters: _.uniqBy(channels.map((grp: AdeiChannel) => {
                return { text: grp.db_server, value: grp.db_server.toLowerCase(), }
            }), e => e.value),
            onFilter: (value: string, record: AdeiChannel) => record.db_server.toLowerCase() == value,
            sorter: (a: AdeiChannel, b: AdeiChannel) => a.db_server.localeCompare(b.db_server),
            sortDirections: ['descend',] as SortOrder[],
        },
        {
            title: <Text>Database Name</Text>,
            dataIndex: 'db_name',
            filters: _.uniqBy(channels.map((grp: AdeiChannel) => {
                return { text: grp.db_name, value: grp.db_name.toLowerCase(), }
            }), e => e.value),
            onFilter: (value: string, record: AdeiChannel) => record.db_name.toLowerCase() == value,
            sorter: (a: AdeiChannel, b: AdeiChannel) => a.db_name.localeCompare(b.db_name),
            sortDirections: ['descend',] as SortOrder[],
        },
        {
            title: <Text>Database Group</Text>,
            dataIndex: 'db_group',
            filters: _.uniqBy(channels.map((grp: AdeiChannel) => {
                return { text: grp.db_group, value: grp.db_group.toLowerCase(), }
            }), e => e.value),
            onFilter: (value: string, record: AdeiChannel) => record.db_group.toLowerCase() == value,
            sorter: (a: AdeiChannel, b: AdeiChannel) => a.db_group.localeCompare(b.db_group),
            sortDirections: ['descend',] as SortOrder[],
        },
        {
            title: <Text>Name</Text>,
            dataIndex: 'name',
        },
        {
            title: <Text>Channel ID</Text>,
            dataIndex: 'chid',
            filters: _.uniqBy(channels.map((grp: AdeiChannel) => {
                return { text: grp.chid, value: grp.chid.toLowerCase(), }
            }), e => e.value),
        },
        {
            title: <Text>Axis</Text>,
            dataIndex: 'axis',
        },
    ]

    return { columns: columns, data: channels, }
}


export function Channels() {
    const [tableState, setTableState,] = useState<ChannelsState>()
    const { sanity, } = useContext(AppContext)

    useEffectAsync(async () => {
        const channels = await sanity.channels()
        if (channels) {
            const newState = generateTableState(channels)
            setTableState(newState)
        }
    }, [])

    if (!tableState) {
        return <Loader />
    }

    return (
        <Table tableLayout="fixed"
            columns={tableState.columns} dataSource={tableState.data} />
    )
}
