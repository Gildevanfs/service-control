import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
  ) {}

  async create(
    createBranchDto: CreateBranchDto,
    companyId: string,
  ): Promise<Branch> {
    return this.branchesRepository.save(
      this.branchesRepository.create({ ...createBranchDto, companyId }),
    );
  }

  findAll(companyId: string): Promise<Branch[]> {
    return this.branchesRepository.find({
      where: { companyId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, companyId: string): Promise<Branch> {
    const branch = await this.branchesRepository.findOne({
      where: { id, companyId },
    });
    if (!branch) {
      throw new NotFoundException(`Filial ${id} não encontrada na empresa`);
    }
    return branch;
  }

  async update(
    id: string,
    companyId: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    const branch = await this.findOne(id, companyId);
    // CNPJ é imutável após a criação: qualquer valor enviado é ignorado.
    if (updateBranchDto.cnpj !== undefined) {
      delete updateBranchDto.cnpj;
    }
    Object.assign(branch, updateBranchDto);
    return this.branchesRepository.save(branch);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const branch = await this.findOne(id, companyId);
    // Soft delete: inativa (nunca apaga fisicamente).
    branch.isActive = false;
    await this.branchesRepository.save(branch);
  }
}
