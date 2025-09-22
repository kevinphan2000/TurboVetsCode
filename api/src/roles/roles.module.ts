import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleAssignment } from '../entities/role-assignment.entity';
import { RolesService } from './roles.service';


@Module({
imports: [TypeOrmModule.forFeature([RoleAssignment])],
providers: [RolesService],
exports: [RolesService],
})
export class RolesModule {}