import { ApiBase, } from './api-base'

export interface Bora {
    key: string
    title: string
    source: string
}

export interface HomeCards {
    activeUsers: number
    activeChannels: number
}

export class DashboardUiService extends ApiBase {

    async boras(): Promise<Bora[] | undefined> {
        const response = await this.axiosInstance.get<Bora[]>('/api/boras/').catch(() => null)
        return response?.data
    }

    async home(): Promise<HomeCards | undefined> {
        const response = await this.axiosInstance.get('/api/dashboard/').catch(() => undefined)
        return response && { activeChannels: response.data.active_channels, activeUsers: response.data.active_users, }
    }
}
