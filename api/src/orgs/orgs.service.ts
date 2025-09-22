import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';


@Injectable()
export class OrgsService {
constructor(@InjectRepository(Organization) private repo: Repository<Organization>) {}


async orgAndChildIds(rootOrgId: number): Promise<number[]> {
const root = await this.repo.findOne({ where: { id: rootOrgId }, relations: ['children'] });
const childIds = (root?.children || []).map((c) => c.id);
return [rootOrgId, ...childIds];
}
}