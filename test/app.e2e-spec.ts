process.env.NODE_ENV = (process.env.NODE_ENV || 'test').trim();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';
import { UserRole } from './../src/users/user-role.enum';

describe('Courses E2E (Session 25)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let teacherToken: string;
  let studentToken: string;

  const teacherCredentials = {
    email: 'e2e.teacher@coursehub.test',
    password: 'Password123!',
  };

  const studentCredentials = {
    email: 'e2e.student@coursehub.test',
    password: 'Password123!',
  };

  beforeAll(async () => {
    process.env.NODE_ENV = (process.env.NODE_ENV || 'test').trim();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    await dataSource.query(
      'TRUNCATE TABLE enrollments, courses, users RESTART IDENTITY CASCADE;',
    );

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(teacherCredentials)
      .expect(201);

    await dataSource.query('UPDATE users SET role = $1 WHERE email = $2;', [
      UserRole.TEACHER,
      teacherCredentials.email,
    ]);

    const teacherLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send(teacherCredentials)
      .expect(200);

    teacherToken = teacherLogin.body.accessToken ?? teacherLogin.body.access_token;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(studentCredentials)
      .expect(201);

    const studentLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send(studentCredentials)
      .expect(200);

    studentToken = studentLogin.body.accessToken ?? studentLogin.body.access_token;
  });

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query('DELETE FROM enrollments; DELETE FROM courses;');
    }
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.query(
        'TRUNCATE TABLE enrollments, courses, users RESTART IDENTITY CASCADE;',
      );
    }
    await app?.close();
  });

  it('GET /courses returns 200 and paginated items array for authenticated user', async () => {
    await request(app.getHttpServer())
      .get('/courses')
      .set('Authorization', `Bearer ${teacherToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.items).toEqual(expect.any(Array));
        expect(body.meta).toBeDefined();
      });
  });

  it('POST /courses creates a course when authenticated with TEACHER role', async () => {
    const payload = {
      title: 'Pruebas End-to-End con NestJS',
      description: 'Curso de prueba en entorno aislado E2E',
      credits: 4,
      semester: 5,
    };

    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send(payload)
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.title).toBe(payload.title);
      });
  });

  it('POST /courses returns 401 without token and 403 with STUDENT role', async () => {
    const payload = {
      title: 'Curso no autorizado',
      description: 'Intento sin token o con rol insuficiente',
      credits: 3,
      semester: 2,
    };

    await request(app.getHttpServer())
      .post('/courses')
      .send(payload)
      .expect(401);

    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(payload)
      .expect(403);
  });
});
