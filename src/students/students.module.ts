import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Importar
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './student.entity'; // 2. Importar la entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]), // 3. Registrar la entidad aquí
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService], // Útil si otros módulos necesitan consultarlo después
})
export class StudentsModule {}
