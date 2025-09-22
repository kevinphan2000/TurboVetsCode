import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleAssignment } from '../entities/role-assignment.entity';
import { Role } from '../rbac/rbac';


@Injectable()
export class RolesService {
constructor(@InjectRepository(RoleAssignment) private repo: Repository<RoleAssignment>) {}


async roleForUser(userId: number, orgId: number): Promise<Role> {
const ra = await this.repo.findOne({ where: { user: { id: userId }, org: { id: orgId } } });
return (ra?.role as Role) || Role.Viewer;
}
}