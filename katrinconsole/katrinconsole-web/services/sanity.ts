import { ApiBase, } from './api-base'

export interface AdeiGroup {
    db_server: string
    db_name: string
    db_group: string
    name: string
}

export interface AdeiChannel {
    db_server: string
    db_name: string
    db_group: string
    name: string
    chid: string
    uid: string
    axis: string
}

export interface AdeiDuplicate extends AdeiChannel {
    url: string
}

interface AdeiDuplicateInstance {
    total: number
    channel_uid: string
    duplicates: AdeiDuplicate[]
}

export interface AdeiDuplicates {
    total: number
    unique_channels: number
    duplicates: AdeiDuplicateInstance[]
}

export class SanityService extends ApiBase {
    async groups(): Promise<AdeiGroup[] | undefined> {
        const groups = await this.axiosInstance.get<AdeiGroup[]>('/api/sanity/groups/').catch(() => null)
        return groups?.data
    }

    async channels(): Promise<AdeiChannel[] | undefined> {
        const channels = await this.axiosInstance.get<AdeiChannel[]>('/api/sanity/channels/').catch(() => null)
        return channels?.data
    }

    async duplicates(): Promise<AdeiDuplicates | undefined> {
        const dups = await this.axiosInstance.get<AdeiDuplicates>('/api/sanity/duplicates/').catch(() => null)
        return dups?.data
    }
}
