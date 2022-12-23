import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);
    try {
      // Save the new User
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      // return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials are taken');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    // if not found throw an error
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare the password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if the password is different throw an error
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    // send back the user
    delete user.hash;
    return user;
  }
}
