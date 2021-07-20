import { Table, Typography, } from 'antd'
import { ColumnsType, SortOrder, } from 'antd/lib/table/interface'
import React, { useContext, useState, } from 'react'
import { Loader, } from '../../components'
import { AppContext, } from '../../contexts'
import { useEffectAsync, } from '../../hooks'
import { AdeiGroup, } from '../../services'
import _ from 'lodash'

const { Text, } = Typography

interface GroupsState {
    columns: ColumnsType<AdeiGroup>
    data: AdeiGroup[]
}

function generateTableState(data: AdeiGroup[]): GroupsState {
    const groups = (data || []).map(g => {
        return { key: g.name, ...g, }
    })

    const columns = [
        {
            title: <Text>Database Server</Text>,
            dataIndex: 'db_server',
            filters: _.uniqBy((groups || []).map((grp: AdeiGroup) => {
                return { text: grp.db_server, value: grp.db_server.toLowerCase(), }
            }), e => e.value),
            onFilter: (value: string, record: AdeiGroup) => record.db_server.toLowerCase() == value,
            sorter: (a: AdeiGroup, b: AdeiGroup) => a.db_server.localeCompare(b.db_server),
            sortDirections: ['descend',] as SortOrder[],
        },
        {
            title: <Text>Database Name</Text>,
            dataIndex: 'db_name',
            filters: _.uniqBy((groups || []).map((grp: AdeiGroup) => {
                return { text: grp.db_name, value: grp.db_name.toLowerCase(), }
            }), e => e.value),
            onFilter: (value: string, record: AdeiGroup) => record.db_name.toLowerCase() == value,
            sorter: (a: AdeiGroup, b: AdeiGroup) => a.db_name.localeCompare(b.db_name),
            sortDirections: ['descend',] as SortOrder[],
        },
        {
            title: <Text>Database Group</Text>,
            dataIndex: 'db_group',
        },
        {
            title: <Text>Name</Text>,
            dataIndex: 'name',
        },
    ]

    return { columns: columns, data: groups, }
}


export function Groups() {
    const [tableState, setTableState,] = useState<GroupsState>()
    const { sanity, } = useContext(AppContext)

    useEffectAsync(async () => {
        const groups = await sanity.groups()
        if (groups) {
            const newState = generateTableState(groups)
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
