import { OAuthTokenCache, } from './auth'
import { history, } from '../contexts'
import axios from 'axios'

export abstract class ApiBase {
    protected axiosInstance = axios.create({ baseURL: BASE_URL, })

    constructor() {
        this.axiosInstance.interceptors.request.use(
            OAuthTokenCache(async refreshToken => {
                const data = new FormData()
                data.append('grant_type', 'refresh_token')
                data.append('refresh_token', refreshToken)
                data.append('client_id', OAUTH_CLIENT_ID)
                data.append('client_secret', OAUTH_CLIENT_SECRET)
                const respo = await axios.create({ baseURL: BASE_URL, })
                    .post('/o/token/', data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).catch(() => null)
                return respo?.data
            })
        )

        this.axiosInstance.interceptors.request.use(config => {
            const csrftoken = (document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement).value
            config.headers.common['X-CSRFToken'] = csrftoken
            return config
        })

        this.axiosInstance.interceptors.response.use(response => {
            return response
        }, error => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        history.push('/login', { from: history.location, })
                        break
                    default:
                        break
                }
            }
            return Promise.reject(error)
        })
    }

    async downloadFile(url: string, payload?: unknown) {
        const resp = await this.axiosInstance.post(url, payload).catch(() => null)
        if (resp) {
            const url = window.URL.createObjectURL(new Blob([resp.data,]))
            const link = document.createElement('a')
            link.href = url
            const fileName = resp.headers['content-disposition'].split(';')[1].split('=')[1]
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
        }
    }
}
