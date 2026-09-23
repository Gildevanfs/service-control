import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_ROUNDS,
    );

    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash,
      temporaryPassword: true,
    });

    return this.usersRepository.save(user);
  }

  findAll(companyId: string): Promise<User[]> {
    return this.usersRepository.find({ where: { companyId } });
  }

  async findOne(id: string, companyId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, companyId },
    });
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado na empresa`);
    }
    return user;
  }

  async update(
    id: string,
    companyId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(id, companyId);

    if (updateUserDto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(
        updateUserDto.password,
        BCRYPT_ROUNDS,
      );
      user.temporaryPassword = true;
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone;
    }
    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const user = await this.findOne(id, companyId);
    // Soft delete: inativa (nunca apaga fisicamente).
    user.isActive = false;
    await this.usersRepository.save(user);
  }
}
