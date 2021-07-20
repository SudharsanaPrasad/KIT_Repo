import { useEffect, } from 'react'
// import axios from 'axios'

export function useEffectAsync(func: () => Promise<unknown>, deps?: unknown[]) {
    useEffect(() => {
        // const token = axios.CancelToken
        func()
        // return () => { }
    }, deps)
}
