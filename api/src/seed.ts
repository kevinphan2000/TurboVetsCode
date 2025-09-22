import 'reflect-metadata';
import { DataSource } from 'typeorm';
import typeormConfig from './config/typeorm.config';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { RoleAssignment } from './entities/role-assignment.entity';
import * as bcrypt from 'bcrypt';


async function seed() {
const ds = new DataSource(typeormConfig());
await ds.initialize();


const orgRepo = ds.getRepository(Organization);
const userRepo = ds.getRepository(User);
const raRepo = ds.getRepository(RoleAssignment);


const acme = await orgRepo.save(orgRepo.create({ name: 'Acme' }));
const acmeCa = await orgRepo.save(orgRepo.create({ name: 'Acme-Canada', parent: acme }));


const owner = await userRepo.save(userRepo.create({ email: 'owner@acme.com', passwordHash: await bcrypt.hash('pass123', 10), displayName: 'Owner', org: acme }));
const admin = await userRepo.save(userRepo.create({ email: 'admin@acme.com', passwordHash: await bcrypt.hash('pass123', 10), displayName: 'Admin', org: acme }));
const viewer = await userRepo.save(userRepo.create({ email: 'viewer@acme.ca', passwordHash: await bcrypt.hash('pass123', 10), displayName: 'Viewer', org: acmeCa }));


await raRepo.save(raRepo.create({ user: owner, org: acme, role: 'Owner' as any }));
await raRepo.save(raRepo.create({ user: admin, org: acme, role: 'Admin' as any }));
await raRepo.save(raRepo.create({ user: viewer, org: acmeCa, role: 'Viewer' as any }));


// eslint-disable-next-line no-console
console.log('Seeded users: owner/admin/viewer (pass123)');
await ds.destroy();
}


seed().catch((e) => { console.error(e); process.exit(1); });