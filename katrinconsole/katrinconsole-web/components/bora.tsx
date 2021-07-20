import React from 'react'

interface BoraProps {
    source: string
}

export function Bora(props: BoraProps) {
    return <iframe src={props.source}
        style={{ width: '100%', height: '100%', border: 0, }} />
}
