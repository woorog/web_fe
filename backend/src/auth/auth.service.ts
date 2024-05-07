import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { AuthUserDto } from '../users/dto/auth-user.dto';
import { User } from '../users/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(authUserDto: AuthUserDto) {
    const { loginId, password } = authUserDto;
    const user = await this.userRepository.findOneBy({ loginId: loginId });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { loginId };
      const accessToken = this.jwtService.sign(payload);

      return {
        userId: loginId,
        accessToken,
        effectiveTime: 86400000,
        msg: 'success',
      };
    }
    return {
      msg: 'fail',
    };
  }
}
