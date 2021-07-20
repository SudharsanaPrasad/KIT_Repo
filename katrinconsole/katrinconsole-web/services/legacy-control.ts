import { ApiBase, } from './api-base'

export interface Sources {
    servers: string[]
    count: number
}

export class LegacyControlService extends ApiBase {
    async getSources(): Promise<Sources | undefined> {
        const sourcesResp = await this.axiosInstance.get<Sources>('/api/control/migrator/').catch(() => null)
        return sourcesResp?.data
    }

    async downloadSourceCsv(source: string): Promise<void> {
        this.downloadFile('/api/control/migrator/', { server: source, })
    }
}
