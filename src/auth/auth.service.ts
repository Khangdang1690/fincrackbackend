import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async login(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // compare password
    const passwordMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    // if password incorrect throw exception
    if (!passwordMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signToken(user.id, user.email);
  }

  async signup(dto: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);

      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          ...(dto.firstName ? { firstName: dto.firstName } : {}),
        },
      });

      // return the saved user
      return this.signToken(user.id, user.email);
    } catch(error) {
        if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '45m',
      secret: secret,
    });

    return { access_token: token };
  }
}
