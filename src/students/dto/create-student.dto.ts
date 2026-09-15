import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  age: number;

  @IsString()
  @IsNotEmpty()
  career: string;

  @IsInt()
  @Min(1)
  @Max(10)
  semester: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
