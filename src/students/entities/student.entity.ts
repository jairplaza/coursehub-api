import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 100 })
  career: string;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  
@OneToMany('Enrollment', 'student')
  enrollments: Enrollment[];
}
