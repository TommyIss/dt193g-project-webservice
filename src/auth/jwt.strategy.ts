import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from 'dotenv';
import { UsersService } from "src/users/users.service";

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_TOKEN ?? 'fallback-secret'
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOne(payload.sub);

        return user;
    }
}