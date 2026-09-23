import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto, authUser.companyId);
  }

  @Get()
  findAll(@CurrentUser() authUser: AuthenticatedUser): Promise<User[]> {
    return this.usersService.findAll(authUser.companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOne(id, authUser.companyId);
  }

  @Patch(':id')
  update(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, authUser.companyId, updateUserDto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.usersService.remove(id, authUser.companyId);
  }
}
