import { ApiBase, } from './api-base'

interface HttpUser {
    username: string
    first_name: string
    last_name: string
    is_superuser: boolean
    is_staff: boolean
    email: string
    groups: string[]
}

export interface User {
    username: string
    firstName: string
    lastName: string
    isSuperuser: boolean
    isStaff: boolean
    email: string
    groups: string[]
}

export class UserService extends ApiBase {
    async me(): Promise<User | undefined> {
        const response = await this.axiosInstance.get<HttpUser>('/api/users/me').catch(() => null)
        return response ? {
            username: response.data.username,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            isSuperuser: response.data.is_superuser,
            isStaff: response.data.is_staff,
            email: response.data.email,
            groups: response.data.groups,
        } : undefined
    }

    async changePassword(passwd: string): Promise<boolean> {
        const response = await this.axiosInstance.patch('/api/users/me', { password: passwd, }).catch(() => null)
        return !!response
    }
}
