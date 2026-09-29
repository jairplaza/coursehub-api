import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar TypeOrmModule
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from './entities/enrollment.entity'; // 2. Importar la entidad
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]), // 3. Registrar el repositorio de la entidad
    StudentsModule, 
    CoursesModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
