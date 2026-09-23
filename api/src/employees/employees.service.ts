import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    companyId: string,
  ): Promise<Employee> {
    const existing = await this.employeesRepository.findOne({
      where: { companyId, cpf: createEmployeeDto.cpf },
    });
    if (existing) {
      throw new ConflictException('CPF já cadastrado para esta empresa');
    }
    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      companyId,
      status: createEmployeeDto.status ?? 'ativo',
    });
    return this.employeesRepository.save(employee);
  }

  findAll(companyId: string): Promise<Employee[]> {
    return this.employeesRepository.find({
      where: { companyId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, companyId: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id, companyId },
    });
    if (!employee) {
      throw new NotFoundException(
        `Funcionário ${id} não encontrado na empresa`,
      );
    }
    return employee;
  }

  async update(
    id: string,
    companyId: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id, companyId);
    // CPF imutável após criar: ignorado no update.
    if (updateEmployeeDto.cpf) {
      delete updateEmployeeDto.cpf;
    }
    Object.assign(employee, updateEmployeeDto);
    return this.employeesRepository.save(employee);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const employee = await this.findOne(id, companyId);
    // Soft delete: status 'inativo' (nunca apaga fisicamente).
    employee.status = 'inativo';
    await this.employeesRepository.save(employee);
  }
}