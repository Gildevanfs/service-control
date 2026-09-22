import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCompanyAndAdmin();
  }

  private async seedCompanyAndAdmin() {
    const cnpj =
      this.config.get<string>('seed.companyCnpj') ?? '11222333000181';
    const companyName =
      this.config.get<string>('seed.companyName') ?? 'Empresa Seed';
    const adminEmail =
      this.config.get<string>('seed.adminEmail') ??
      'admin@servicecontrol.com.br';
    const adminPassword =
      this.config.get<string>('seed.adminPassword') ?? 'admin123';
    const adminName =
      this.config.get<string>('seed.adminName') ?? 'Administrador';

    let company = await this.companiesRepository.findOne({ where: { cnpj } });
    if (!company) {
      company = await this.companiesRepository.save(
        this.companiesRepository.create({
          name: companyName,
          cnpj,
          status: 'active',
        }),
      );
      this.logger.log(`Seed: empresa criada (${company.id})`);
    }

    const admin = await this.usersRepository.findOne({
      where: { companyId: company.id, email: adminEmail },
    });
    if (!admin) {
      const passwordHash = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);
      await this.usersRepository.save(
        this.usersRepository.create({
          companyId: company.id,
          email: adminEmail,
          passwordHash,
          name: adminName,
          status: 'active',
          temporaryPassword: false,
        }),
      );
      this.logger.log(`Seed: usuário admin criado (${adminEmail})`);
    }
  }
}