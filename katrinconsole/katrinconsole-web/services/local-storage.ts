import { StampedTokenInfo, TokenInfo, TokenInfoOrNull, } from './auth'

type UnknownOrNull = unknown | null

interface StorageObject<V, R = V> {
    set: (value: V) => void
    get: () => R | null
    delete: () => void
}

export class LocalStorage {
    static getItem(key: string): UnknownOrNull {
        const json = localStorage.getItem(key)
        if (json == null) {
            return null
        }

        return JSON.parse(json)
    }

    static setItem(key: string, value: unknown): void {
        const json = JSON.stringify(value)
        localStorage.setItem(key, json)
    }

    static clear(): void {
        localStorage.clear()
    }

    static remove(key: string): void {
        localStorage.removeItem(key)
    }

    static get token(): StorageObject<TokenInfo, StampedTokenInfo> {
        return {
            set: (tokenInfo: TokenInfo) => {
                const stampedTokenInfo = { ...tokenInfo, timestamp: new Date().getTime(), }
                LocalStorage.setItem('token', stampedTokenInfo)
            },
            get: () => {
                return LocalStorage.getItem('token') as TokenInfoOrNull
            },
            delete: () => {
                LocalStorage.remove('token')
            },
        }
    }
}
