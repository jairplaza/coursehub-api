import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
@Unique(['student', 'course'])
export class Enrollment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Student, (student) => student.enrollments, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @CreateDateColumn()
  enrolledAt: Date;
}
