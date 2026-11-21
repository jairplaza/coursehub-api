import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import type { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  createdByUserId: number; // <--- Esta columna registra quién creó el curso

  @OneToMany('Enrollment', 'course')
  enrollments: Enrollment[];
}


