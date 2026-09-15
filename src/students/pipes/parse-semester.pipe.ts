import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseSemesterPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const semester = parseInt(value, 10);

    if (isNaN(semester)) {
      throw new BadRequestException('El semestre debe ser un número entero');
    }

    if (semester < 1 || semester > 10) {
      throw new BadRequestException('El semestre debe estar dentro del rango de 1 a 10');
    }

    return semester;
  }
}