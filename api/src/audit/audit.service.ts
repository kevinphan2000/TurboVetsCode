import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';


@Injectable()
export class AuditService {
constructor(@InjectRepository(AuditLog) private repo: Repository<AuditLog>) {}
recent(limit = 100) {
return this.repo.find({ order: { at: 'DESC' }, take: limit });
}
}