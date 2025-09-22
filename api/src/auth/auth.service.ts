import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';


@Injectable()
export class AuthService {
constructor(private users: UsersService, private roles: RolesService, private jwt: JwtService) {}


async validateUser(email: string, pass: string) {
const user = await this.users.findByEmail(email);
if (!user?.isActive) throw new UnauthorizedException('Invalid credentials');
const ok = await bcrypt.compare(pass, user.passwordHash);
if (!ok) throw new UnauthorizedException('Invalid credentials');
return user;
}


async issueToken(user: any) {
const role = await this.roles.roleForUser(user.id, user.org.id);
const payload = { sub: user.id, email: user.email, orgId: user.org.id, role };
return {
access_token: await this.jwt.signAsync(payload),
user: { id: user.id, email: user.email, orgId: user.org.id, role },
};
}
}