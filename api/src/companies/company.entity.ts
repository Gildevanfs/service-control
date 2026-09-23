import { IsValidCnpj } from '../common/validators';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 14 })
  @IsValidCnpj()
  cnpj: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone' })
  phone?: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'address_street',
  })
  addressStreet?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'address_city',
  })
  addressCity?: string;

  @Column({ type: 'varchar', length: 2, nullable: true, name: 'address_state' })
  addressState?: string;

  @Column({
    type: 'varchar',
    length: 8,
    nullable: true,
    name: 'address_zipcode',
  })
  addressZipcode?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
