import React, { useContext, useState, } from 'react'
import { Statistic, Row, Col, Card, } from 'antd'
import { AppContext, } from '../contexts'
import { useEffectAsync, } from '../hooks'
import { HomeCards, } from '../services'
import { Loader, } from '../components'


export function Home() {
    const { dashboardUi, } = useContext(AppContext)
    const [cards, setCards,] = useState<HomeCards>()
    useEffectAsync(async () => {
        const homeCards = await dashboardUi.home()
        if (homeCards) {
            setCards(homeCards)
        }
    }, [])

    if (!cards) {
        return <Loader />
    }

    return (
        <Row gutter={16}>
            <Col span={12}>
                <Card>
                    <Statistic title="Active KATRINers" value={cards.activeUsers} />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                    <Statistic title="Active Control Channels" value={cards.activeChannels} />
                </Card>
            </Col>
        </Row>
    )
}
