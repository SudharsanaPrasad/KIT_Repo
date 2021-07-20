import {
    AreaChartOutlined, BugOutlined, ControlOutlined,
    DeploymentUnitOutlined, HomeOutlined, KeyOutlined, LoginOutlined,
    LogoutOutlined, ProfileOutlined, UserOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Button, Layout, Menu, Popover, Typography, } from 'antd'
import { SelectInfo, } from 'rc-menu/lib/interface'
import React, { useContext, useState, } from 'react'
import { Redirect, useHistory, useParams, } from 'react-router'
import { Link, } from 'react-router-dom'
import { Bora, } from '../components'
import { AppContext, } from '../contexts'
import { useEffectAsync, } from '../hooks'
import { Bora as BoraModel, User, } from '../services'
import { LegacyMigrator, } from './control'
import { Home, } from './home'
import { Channels, Duplicates, Groups, } from './sanity'

const { SubMenu, Item, } = Menu
const {
    Header, Content, Sider,
} = Layout
const { Text, } = Typography

interface ContentLayoutStyle {
    layout?: React.CSSProperties
    breadcrumb?: React.CSSProperties
    content?: React.CSSProperties
}

interface DashboardState {
    key: string
    content: JSX.Element
    contentLayoutStyle?: ContentLayoutStyle
}

const defaultContentLayoutStyle: ContentLayoutStyle = {
    layout: { padding: '0 24px 24px', },
    breadcrumb: { margin: '16px 0', },
    content: { padding: 24, margin: 0, background: 'white', },
}

interface DashboardParams {
    parent?: string
    child?: string
}

function switchContent(routingInfo: string[], additionalInfo?: BoraModel): DashboardState {
    const history = useHistory()
    const target = routingInfo[0] || ''

    switch (target) {
        case 'bora':
            return {
                key: routingInfo.join('/'),
                content: <Bora source={additionalInfo?.source || ''} />,
                contentLayoutStyle: {
                    layout: { padding: 0, margin: 0, },
                    breadcrumb: { display: 'none', },
                    content: { padding: 0, margin: 0, },
                },
            }
        case 'sanity':
            switch (routingInfo[1]) {
                case 'groups':
                    return {
                        key: routingInfo.join('/'),
                        content: <Groups />,
                        contentLayoutStyle: {
                            content: { padding: 0, },
                        },
                    }
                case 'channels':
                    return {
                        key: routingInfo.join('/'),
                        content: <Channels />,
                        contentLayoutStyle: {
                            content: { padding: 0, },
                        },
                    }
                case 'duplicates':
                    return {
                        key: routingInfo.join('/'),
                        content: <Duplicates />,
                    }
            }
        case 'control':
            switch (routingInfo[1]) {
                case 'legacy':
                    return {
                        key: routingInfo.join('/'),
                        content: <LegacyMigrator />,
                    }
            }
        case '':
        case 'home':
            return {
                key: 'home',
                content: <Home />,
                contentLayoutStyle: {
                    content: { padding: 0, margin: 0, },
                },
            }
        default:
            return {
                key: '404',
                content: <Redirect to={{ pathname: '/404', state: { from: history.location, }, }} />,
            }
    }
}

function useBreadcrumb() {
    const { parent, child, } = useParams<DashboardParams>()
    const breadcrumb = [parent, child,].filter(e => e != undefined) as string[]
    return {
        target: breadcrumb,
        breadcrumb: breadcrumb.map(e => e.toUpperCase()),
    }
}

export function Dashboard() {
    const { auth, dashboardUi, user, } = useContext(AppContext)
    const history = useHistory()
    const [isAuthenticated, setIsAuthenticated,] = useState(auth.isAuthenticated)
    const [collapsed, setCollapsed,] = useState(false)
    const routingInfo = useBreadcrumb()
    const [userState, setUser,] = useState<User>()
    const [boras, setBoras,] = useState<BoraModel[]>([])

    const inferredContent = routingInfo.target[0] == 'bora' ?
        switchContent(routingInfo.target, boras.find(bora => bora.key == routingInfo.target[1]))
        : switchContent(routingInfo.target)

    useEffectAsync(async () => {
        const [me, boras,] = await Promise.all([
            user.me(),
            dashboardUi.boras(),
        ])
        setUser(me)
        setBoras(boras || [])
    }, [])

    const onMenuSelectionChange = (info: SelectInfo) => {
        const target = info.keyPath.reverse().join('/')
        const url = `/dashboard/${target}`
        history.push(url, { from: history.location, })
    }

    const logOut = async () => {
        await auth.logout()
        setIsAuthenticated(false)
    }

    const contentLayoutStyle = inferredContent.contentLayoutStyle || defaultContentLayoutStyle
    const { content, key, } = inferredContent

    if (!isAuthenticated) {
        return <Redirect to={{ pathname: '/login', state: { from: history.location, }, }} />
    }

    const popoverContent = (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, }}>
            <li>
                <Link to={{ pathname: '/me', state: { me: userState, from: history.location, }, }}>
                    <Button type="text" icon={<ProfileOutlined />}>
                        Profile
                    </Button>
                </Link>
            </li>
            {(userState?.isStaff || userState?.isSuperuser) && <li>
                <a href="/admin/">
                    <Button type="text" icon={<ControlOutlined />}>
                        Admin
                    </Button>
                </a>
            </li>}
            <li>
                <Link to={{ pathname: '/me', state: { me: userState, from: history.location, }, }}>
                    <Button type="text" icon={<KeyOutlined />}>
                        Change Password
                    </Button>
                </Link>
            </li>
            <li>
                <Button type="text" onClick={logOut} icon={<LogoutOutlined />}>
                    Log Out
                </Button>
            </li>
        </ul>
    )

    return (
        <Layout style={{ minHeight: '100vh', }}>
            <Header>
                <div style={{ float: 'left', width: '120px', height: '31px', }}>
                    <Text style={{ color: 'white', }}>KATRIN Console</Text>
                </div>
                <div style={{ float: 'right', }}>
                    {userState ?
                        <Popover placement="bottom" content={popoverContent}>
                            <Button type="primary" icon={<UserOutlined />}>
                                <Text style={{ color: 'white', }}>
                                    hello, {userState.username}!
                                </Text>
                            </Button>
                        </Popover>
                        :
                        <Button type="primary" icon={<LoginOutlined />}>
                            Log In
                        </Button>}
                </div>
            </Header>
            <Layout>
                <Sider theme="dark" collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                    <Menu mode="inline" selectedKeys={key.split('/')} onSelect={onMenuSelectionChange}
                        style={{ height: '100%', borderRight: 0, }}>
                        {/* Add Menu Items Here. Key attrib. should match
                        corresponding case statement in `switchContent` */}
                        <Item key="home" icon={<HomeOutlined />}>Home</Item>
                        {boras.length != 0 &&
                            <SubMenu key="bora" icon={<AreaChartOutlined />} title="Bora">
                                {boras.map(e => <Item key={e.key}>{e.title}</Item>)}
                            </SubMenu>
                        }
                        <SubMenu key="sanity" icon={<BugOutlined />} title="Sanity">
                            <Item key="groups">ADEI Groups</Item>
                            <Item key="channels">ADEI Channels</Item>
                            <Item key="duplicates">ADEI Duplicates</Item>
                        </SubMenu>
                        <SubMenu key="control" icon={<DeploymentUnitOutlined />} title="Control">
                            <Item key="legacy">Legacy Migrator</Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={contentLayoutStyle.layout || defaultContentLayoutStyle.layout}>
                    <Breadcrumb style={contentLayoutStyle.breadcrumb || defaultContentLayoutStyle.breadcrumb}>
                        {routingInfo.breadcrumb.map(e => <Breadcrumb.Item key={e}>{e}</Breadcrumb.Item>)}
                    </Breadcrumb>
                    <Content style={{ ...contentLayoutStyle.content || defaultContentLayoutStyle.content, }}>
                        {content}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
