import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Organization } from '../../entities/organization.entity';


@Injectable()
export class OrgScopeGuard implements CanActivate {
constructor(private ds: DataSource) {}
async canActivate(ctx: ExecutionContext) {
const req = ctx.switchToHttp().getRequest();
const { user, params } = req;
const id = params?.id ? Number(params.id) : undefined;
if (!id) return true; // list/create endpoints handled at service layer


const taskRepo = this.ds.getRepository(Task);
const task = await taskRepo.findOne({ where: { id } });
if (!task) return false;


const orgRepo = this.ds.getRepository(Organization);
const taskOrg = await orgRepo.findOne({ where: { id: task.org.id }, relations: ['parent'] });


// Allow if same org or child of user's org
const same = taskOrg?.id === user.orgId;
const child = taskOrg?.parent?.id === user.orgId;
return !!(same || child);
}
}