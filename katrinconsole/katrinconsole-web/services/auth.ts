import axios, { AxiosRequestConfig, } from 'axios'
import { LocalStorage, } from './local-storage'

type TokenType = 'Bearer'

interface HttpTokenInfo {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    scope: string
}

export interface TokenInfo {
    accessToken: string
    tokenType: TokenType
    expiresIn: number
    refreshToken: string
    scope: string[]
}

export interface StampedTokenInfo extends TokenInfo {
    timestamp: number
}

type TokenRefresher = (refreshToken: string) => Promise<HttpTokenInfo>
type TokenAgeRetriver = (info: TokenInfo) => number
type AxiosInterceptor = (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>

export type TokenInfoOrNull = StampedTokenInfo | null

function toTokenInfo(httpTokenInfo: HttpTokenInfo): TokenInfo {
    const tokenInfo: TokenInfo = {
        accessToken: httpTokenInfo.access_token,
        expiresIn: httpTokenInfo.expires_in,
        refreshToken: httpTokenInfo.refresh_token,
        scope: httpTokenInfo.scope.split(' '),
        tokenType: httpTokenInfo.token_type as TokenType,
    }
    return tokenInfo
}

export function OAuthTokenCache(refresh: TokenRefresher,
    getMaxAge: TokenAgeRetriver = (info) => info.expiresIn): AxiosInterceptor {
    function isValid(tokenInfo: StampedTokenInfo): boolean {
        return (tokenInfo.timestamp + getMaxAge(tokenInfo)) > (new Date().getTime())
    }

    function wrapConfig(config: AxiosRequestConfig, tokenInfo: TokenInfo) {
        config.headers.common['Authorization'] = `${tokenInfo.tokenType} ${tokenInfo.accessToken}`
        return config
    }

    const interceptor: AxiosInterceptor = async (config: AxiosRequestConfig) => {
        const tokenInfo: TokenInfoOrNull = LocalStorage.token.get()
        if (tokenInfo != null) {
            const valid = isValid(tokenInfo)
            if (valid) {
                return wrapConfig(config, tokenInfo)
            }

            const refreshed = await refresh(tokenInfo.refreshToken).catch()
            if (refreshed) {
                const tokenInfo = toTokenInfo(refreshed)
                LocalStorage.token.set(tokenInfo)
                return wrapConfig(config, tokenInfo)
            }
        }
        return config
    }

    return interceptor
}

export class AuthService {
    axiosInstance = axios.create({ baseURL: BASE_URL, })

    async login(username: string, password: string): Promise<boolean> {
        const data = new FormData()
        data.append('username', username)
        data.append('password', password)
        data.append('grant_type', 'password')

        const response = await this.axiosInstance.post<HttpTokenInfo>('/o/token/', data, {
            auth: {
                username: OAUTH_CLIENT_ID,
                password: OAUTH_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).catch(() => null)

        if (response &&
            response.status == 200) {
            const { data, } = response
            const tokenInfo = toTokenInfo(data as HttpTokenInfo)
            LocalStorage.token.set(tokenInfo)
            return true
        }

        return false
    }

    async logout(): Promise<void> {
        const token = LocalStorage.token.get()
        if (token) {
            const data = new FormData()
            data.append('token', token.accessToken)
            data.append('client_id', OAUTH_CLIENT_ID)
            data.append('client_secret', OAUTH_CLIENT_SECRET)

            await this.axiosInstance.post('/o/revoke_token/', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).catch(() => null)

            LocalStorage.token.delete()
        }
        return Promise.resolve()
    }

    get isAuthenticated(): boolean {
        return LocalStorage.token.get() != null
    }
}
