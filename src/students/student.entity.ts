import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('students') // Nombre de la tabla en la base de datos
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  career: string;

  @Column()
  semester: number;

  @Column()
  age: number;

  @Column({ default: true })
  isActive: boolean;
}
