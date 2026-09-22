import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepository.create({
      ...createCompanyDto,
      status: createCompanyDto.status ?? 'active',
    });
    return this.companiesRepository.save(company);
  }

  findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa ${id} não encontrada`);
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    // Soft delete: inativa (nunca apaga fisicamente).
    company.status = 'inactive';
    await this.companiesRepository.save(company);
  }
}