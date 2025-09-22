import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { TasksModule } from './tasks/tasks.module';
import { AuditModule } from './audit/audit.module';


@Module({
imports: [
    ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({ useFactory: typeormConfig }),
        AuthModule,
        UsersModule,
        OrgsModule,
        TasksModule,
        AuditModule,
],
})
export class AppModule {}