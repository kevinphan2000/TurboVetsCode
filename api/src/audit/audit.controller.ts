import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../rbac/rbac';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-log')
export class AuditController {
constructor(private audit: AuditService) {}


@Get()
@Roles(Role.Owner)
all() {
return this.audit.recent();
}
}