import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { RoleAssignment } from '../entities/role-assignment.entity';
import { Task } from '../entities/task.entity';
import { AuditLog } from '../entities/audit-log.entity';

export default function typeormConfig(): DataSourceOptions {
  const type = (process.env.DB_TYPE || 'sqlite') as 'sqlite' | 'postgres';

  const common: Partial<DataSourceOptions> = {
    // IMPORTANT: make sure this is a mutable array, not a readonly tuple
    entities: [User, Organization, RoleAssignment, Task, AuditLog],
    // NOTE: synchronize=true is for dev only. Use migrations in prod.
    synchronize: process.env.TYPEORM_SYNC === 'true' || process.env.NODE_ENV !== 'production',
  };

  if (type === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'turbovets',
      ...common,
    } as DataSourceOptions;
  }

  // default sqlite
  return {
    type: 'sqlite',
    database: process.env.DB_DATABASE || './tmp/turbovets.sqlite',
    ...common,
  } as DataSourceOptions;
}
