import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionsRepository: Repository<Position>,
  ) {}

  async create(
    createPositionDto: CreatePositionDto,
    companyId: string,
  ): Promise<Position> {
    return this.positionsRepository.save(
      this.positionsRepository.create({ ...createPositionDto, companyId }),
    );
  }

  findAll(companyId: string): Promise<Position[]> {
    return this.positionsRepository.find({
      where: { companyId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, companyId: string): Promise<Position> {
    const position = await this.positionsRepository.findOne({
      where: { id, companyId },
    });
    if (!position) {
      throw new NotFoundException(`Cargo ${id} não encontrado na empresa`);
    }
    return position;
  }

  async update(
    id: string,
    companyId: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.findOne(id, companyId);
    Object.assign(position, updatePositionDto);
    return this.positionsRepository.save(position);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const position = await this.findOne(id, companyId);
    // Soft delete: inativa (nunca apaga fisicamente).
    position.isActive = false;
    await this.positionsRepository.save(position);
  }
}