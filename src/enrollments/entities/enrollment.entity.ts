import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/student.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Student, { eager: true, onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => Course, { eager: true, onDelete: 'CASCADE' })
  course: Course;

  @CreateDateColumn()
  enrolledAt: Date;
}
