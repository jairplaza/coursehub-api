import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { EnrollmentsModule } from './enrollments/enrollments.module'; // <-- 1. Importa el módulo

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow('DATABASE_HOST'),
        port: Number(config.getOrThrow('DATABASE_PORT')),
        username: config.getOrThrow('DATABASE_USER'),
        password: config.getOrThrow('DATABASE_PASSWORD'),
        database: config.getOrThrow('DATABASE_NAME'),
        autoLoadEntities: true, 
        synchronize: true,
      }),
    }),
    CoursesModule,
    StudentsModule,
    EnrollmentsModule, // <-- 2. Agrégalo aquí en los imports
  ],
})
export class AppModule {}
