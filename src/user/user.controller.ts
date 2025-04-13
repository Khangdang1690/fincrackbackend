import { Controller, Get, Put, Body, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "@/auth/decorator";
import { JwtAuthGuard } from "@/auth/guard";
import { BaseController } from "@/common";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Get('me')
  getMe(@GetUser() user: User) {
    console.log(`[${new Date().toISOString()}] GET /api/users/me accessed - User ID: ${user.id}, Email: ${user.email}`);
    return user;
  }

  @Put('me')
  updateMe(
    @GetUser() user: User,
    @Body() updateUserDto: { firstName?: string; lastName?: string }
  ) {
    return this.userService.updateMe(user.id, updateUserDto);
  }
}
