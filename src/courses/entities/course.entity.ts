import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
