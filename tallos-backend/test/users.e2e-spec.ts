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
    return (
      request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: testUser, password: 'e2e' })
        // .expect(201)
        .then((response) => {
          expect(response.body.success).toEqual('User created successfully');
        })
    );
  });

  it('should fail to register with an existing username', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: testUser, password: 'e2e' })
      .expect(409)
      .then((response) => {
        expect(response.body.error).toEqual('Conflict');
      });
  });

  it('should fail to login with an incorrect password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser, password: 'wrongPassword' })
      .expect(401)
      .then((response) => {
        expect(response.body.failed).toEqual('Login failed');
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

  it('should create a test user pet', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ username: `${testUser}_pet`, password: 'e2e' })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toEqual('User created successfully');
      });
  });

  it('should update the test user information', () => {
    return request(app.getHttpServer())
      .patch(`/users/${testUser}_pet`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ username: `${testUser}_updated`, password: 'e2e' })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toEqual(`User updated`);
      });
  });

  it('should retrieve the updated test user information', () => {
    return request(app.getHttpServer())
      .get(`/users/${testUser}_updated`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.user.username).toEqual(`${testUser}_updated`);
      });
  });

  it('should delete the test user pet that is now updated', () => {
    return request(app.getHttpServer())
      .delete(`/users/${testUser}_updated`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toEqual(
          `User ${testUser}_updated deleted`,
        );
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

  it('should remove all permissions from test user', () => {
    return request(app.getHttpServer())
      .patch(`/users/${testUser}/permissions`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ permissions: [] })
      .expect(200);
  });

  it('should fail to list all users due to lack of permissions', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(403);
  });

  it('should fail to get the specific test user due to lack of permissions', () => {
    return request(app.getHttpServer())
      .get(`/users/${testUser}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(403);
  });

  it('should fail to create a new user due to lack of permissions', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ username: `${testUser}2`, password: 'newPass' })
      .expect(403);
  });

  it('should fail to update the test user due to lack of permissions', () => {
    return request(app.getHttpServer())
      .patch(`/users/${testUser}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ username: testUser, password: 'updatedPass' })
      .expect(403);
  });

  it('should fail to delete the test user due to lack of permissions', () => {
    return request(app.getHttpServer())
      .delete(`/users/${testUser}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(403);
  });

  it('should create a second test user and login', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: `${testUser}2`, password: 'e2e' })
      .expect(201)
      .then((response) => {
        jwtToken = response.body.token;
        expect(response.body.success).toEqual('User created successfully');
      });
  });

  it('should delete the test user', () => {
    return request(app.getHttpServer())
      .delete(`/users/${testUser}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toEqual(`User ${testUser} deleted`);
      });
  });

  it('should delete the second test user', () => {
    return request(app.getHttpServer())
      .delete(`/users/${testUser}2`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toEqual(`User ${testUser}2 deleted`);
      });
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/users/${testUser}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    await request(app.getHttpServer())
      .delete(`/users/${testUser}2`)
      .set('Authorization', `Bearer ${jwtToken}`);
    await request(app.getHttpServer())
      .delete(`/users/${testUser}_pet`)
      .set('Authorization', `Bearer ${jwtToken}`);
    await request(app.getHttpServer())
      .delete(`/users/${testUser}_updated`)
      .set('Authorization', `Bearer ${jwtToken}`);
    await app.close();
  });
});
