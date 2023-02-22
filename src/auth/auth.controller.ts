import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  createUser(@Body() authCredentialDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }
  @Post('/signin')
  logIn(@Body() authCredentialDto: AuthCredentialsDto): Promise<string> {
    return this.authService.signIn(authCredentialDto);
  }
}
