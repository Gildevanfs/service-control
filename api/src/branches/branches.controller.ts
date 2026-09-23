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
import { Branch } from './branch.entity';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  create(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    return this.branchesService.create(createBranchDto, authUser.companyId);
  }

  @Get()
  findAll(@CurrentUser() authUser: AuthenticatedUser): Promise<Branch[]> {
    return this.branchesService.findAll(authUser.companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Branch> {
    return this.branchesService.findOne(id, authUser.companyId);
  }

  @Patch(':id')
  update(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    return this.branchesService.update(id, authUser.companyId, updateBranchDto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.branchesService.remove(id, authUser.companyId);
  }
}
