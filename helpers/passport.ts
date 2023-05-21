import passport from 'passport';
import {
  ExtractJwt,
  JwtFromRequestFunction,
  Strategy as JwtStrategy,
} from 'passport-jwt';
import { Container, Service } from 'typedi';

import { JWT_SECRET } from '../config/consts';
import { UserService } from '../services';

@Service()
class Passport {
  private readonly jwtStrategy: JwtStrategy;
  private readonly jwtOptions: {
    secretOrKey: string;
    jwtFromRequest: JwtFromRequestFunction;
  };
  constructor(private readonly userService: UserService) {
    this.jwtOptions = {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    this.jwtStrategy = new JwtStrategy(
      this.jwtOptions,
      async (payload, done) => {
        const user = await this.userService.getSingleUserById(payload._id);
        if (user) {
          done(null, user, { message: 'Logged in successfully!' });
        } else {
          done(null, false, { message: 'User not found' });
        }
      },
    );
  }

  public passport() {
    return passport.use(this.jwtStrategy);
  }
}

export const passportHandler = Container.get(Passport).passport();
