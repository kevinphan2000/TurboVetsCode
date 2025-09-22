import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { OrgScopeGuard } from '../common/guards/org-scope.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../rbac/rbac';
import { CurrentUser, JwtUserPayload } from '../common/decorators/current-user.decorator';


@UseGuards(JwtAuthGuard, RolesGuard, OrgScopeGuard)
@Controller('tasks')
export class TasksController {
constructor(private readonly svc: TasksService) {}


@Post()
@Roles(Role.Admin)
create(@CurrentUser() user: JwtUserPayload, @Body() dto: CreateTaskDto) {
return this.svc.create(user as any, dto);
}


@Get()
@Roles(Role.Viewer)
list(
@CurrentUser() user: JwtUserPayload,
@Query('category') category?: string,
@Query('ownerId') ownerId?: string,
) {
return this.svc.listForUser(user as any, { category, ownerId: ownerId ? Number(ownerId) : undefined });
}


@Put(':id')
@Roles(Role.Admin)
update(@CurrentUser() user: JwtUserPayload, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
return this.svc.update(user as any, Number(id), dto);
}


@Delete(':id')
@Roles(Role.Admin)
remove(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
return this.svc.remove(user as any, Number(id));
}
}