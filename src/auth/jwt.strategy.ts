import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwtSecret',
    });
  }

  async validate(jwtPayload: { sub: User }) {
    // const user = this.usersService.findOne('id', jwtPayload.sub.id);
    const user = this.usersService.findOne('id', jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
