import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../users/dto/auth-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() authUserDto: AuthUserDto) {
    return this.authService.login(authUserDto);
  }

  @Post('/jwtLogin')
  @UseGuards(AuthGuard())
  authTest(@Req() req) {
    const userId = req.user.loginId;
    return { userId: userId };
  }
}
