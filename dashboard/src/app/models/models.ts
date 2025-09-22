export type Role = 'Viewer' | 'Admin' | 'Owner';
export interface UserDTO { id: number; email: string; orgId: number; role: Role }
export interface LoginResponse { access_token: string; user: UserDTO }
export interface TaskDTO {
    id: number; title: string; description?: string; category: string;
    status: 'Backlog' | 'Open' | 'Done' | string; owner: any; org: any; createdAt: string; updatedAt: string;
}