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
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './employee.entity';
import { EmployeesService } from './employees.service';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.create(
      createEmployeeDto,
      authUser.companyId,
    );
  }

  @Get()
  findAll(@CurrentUser() authUser: AuthenticatedUser): Promise<Employee[]> {
    return this.employeesService.findAll(authUser.companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Employee> {
    return this.employeesService.findOne(id, authUser.companyId);
  }

  @Patch(':id')
  update(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.update(
      id,
      authUser.companyId,
      updateEmployeeDto,
    );
  }

  @Delete(':id')
  remove(
    @CurrentUser() authUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.employeesService.remove(id, authUser.companyId);
  }
}