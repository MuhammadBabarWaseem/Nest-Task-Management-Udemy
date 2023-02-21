import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() authCredentialDto: AuthCredentialsDto): Promise<void> {
    return this.authService.createUser(authCredentialDto);
  }
}
