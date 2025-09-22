import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
constructor(private auth: AuthService) {}


@Post('login')
@Public()
async login(@Body() dto: LoginDto) {
const user = await this.auth.validateUser(dto.email, dto.password);
return this.auth.issueToken(user);
}
}