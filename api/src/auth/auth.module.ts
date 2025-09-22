import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { JwtStrategy } from './jwt.strategy';


@Module({
imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    JwtModule.register({
    secret: process.env.JWT_SECRET || 'devsupersecret',
    signOptions: { expiresIn: process.env.JWT_EXPIRES || '3600s' },
    }),
],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}