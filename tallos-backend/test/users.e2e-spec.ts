import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  const testUser = `user_${new Date().toISOString().replace(/[-T:.Z]/g, '')}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a test user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: testUser, password: 'e2e' })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toEqual('User created successfully');
      });
  });

  it('should login with the test user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser, password: 'e2e' })
      .expect(201)
      .then((response) => {
        jwtToken = response.body.token;
      });
  });

  it('should list all users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toEqual('Users were found');
      });
  });

  // // Remove all permissions from the test user
  // it('should remove all permissions from test user', () => {
  //   return request(app.getHttpServer())
  //     .patch(`/users/${testUser}/permissions`)
  //     .set('Authorization', `Bearer ${jwtToken}`)
  //     .send({ permissions: [] }) // Empty permissions array
  //     .expect(200);
  // });

  // // Try to list all users again expecting failure
  // it('should fail to list all users due to lack of permissions', () => {
  //   return request(app.getHttpServer())
  //     .get('/users')
  //     .set('Authorization', `Bearer ${jwtToken}`)
  //     .expect(403); // Expecting forbidden due to lack of permissions
  // });

  it('should delete the test user', () => {
    return request(app.getHttpServer())
      .delete(`/users/${testUser}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toEqual(`User ${testUser} deleted`);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
