export enum Role {
    Viewer = 'Viewer',
    Admin = 'Admin',
    Owner = 'Owner',
    }
    
    
    export enum Permission {
    TaskRead = 'task:read',
    TaskCreate = 'task:create',
    TaskUpdate = 'task:update',
    TaskDelete = 'task:delete',
    AuditRead = 'audit:read',
    }
    
    
    export const roleLevel: Record<Role, number> = {
    [Role.Viewer]: 1,
    [Role.Admin]: 2,
    [Role.Owner]: 3,
    };
    
    
    export const rolePermissions: Record<Role, Permission[]> = {
    [Role.Viewer]: [Permission.TaskRead],
    [Role.Admin]: [Permission.TaskRead, Permission.TaskCreate, Permission.TaskUpdate, Permission.TaskDelete],
    [Role.Owner]: [Permission.TaskRead, Permission.TaskCreate, Permission.TaskUpdate, Permission.TaskDelete, Permission.AuditRead],
    };
    
    
    export function roleSatisfies(required: Role, actual: Role) {
    return roleLevel[actual] >= roleLevel[required];
    }
    
    
    export function hasPermission(actual: Role, perm: Permission) {
    return rolePermissions[actual].includes(perm);
    }