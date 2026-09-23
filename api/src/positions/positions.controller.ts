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
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './position.entity';
import { PositionsService } from './positions.service';

@UseGuards(JwtAuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    return this.positionsService.create(createPositionDto, authUser.companyId);
  }

  @Get()
  findAll(@CurrentUser() authUser: AuthenticatedUser): Promise<Position[]> {
    return this.positionsService.findAll(authUser.companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Position> {
    return this.positionsService.findOne(id, authUser.companyId);
  }

  @Patch(':id')
  update(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    return this.positionsService.update(id, authUser.companyId, updatePositionDto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.positionsService.remove(id, authUser.companyId);
  }
}