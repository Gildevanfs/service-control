import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from '../branches/branch.entity';
import { Position } from '../positions/position.entity';

@Entity('employees')
@Index(['companyId', 'cpf'], { unique: true })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'company_id' })
  companyId: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 11 })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate: string | null;

  @Column({ type: 'date', nullable: true, name: 'hire_date' })
  hireDate: string | null;

  @Index()
  @Column({ type: 'uuid', nullable: true, name: 'position_id' })
  positionId: string | null;

  @ManyToOne(() => Position, { nullable: true })
  @JoinColumn({ name: 'position_id' })
  position?: Position;

  @Index()
  @Column({ type: 'uuid', nullable: true, name: 'branch_id' })
  branchId: string | null;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch?: Branch;

  @Index()
  @Column({ type: 'uuid', nullable: true, name: 'team_id' })
  teamId: string | null;

  @Index()
  @Column({ type: 'uuid', nullable: true, name: 'superior_id' })
  superiorId: string | null;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'superior_id' })
  superior?: Employee;

  @Column({ type: 'varchar', length: 20, default: 'ativo' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}