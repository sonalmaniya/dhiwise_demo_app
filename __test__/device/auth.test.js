const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';
const db = require('../../config/db');

// we will use supertest to test HTTP requests/responses
const request = require('supertest');
// we also need our app for the correct routes!
const app = require('../../app_config');

beforeAll(() => {
  db.connection.dropDatabase();
});

describe('POST /register -> if email and username is given', () => {
  test('should register a user', async () => {
    let registeredUser = await request(app)
      .post('/device/auth/register')
      .send({
        username: 'Genevieve Gutkowski',
        password: 'LhAcKZgmdCU3rZm',
        email: 'Edwardo.Kshlerin69@yahoo.com',
        name: 'Annie Halvorson',
        role: 1
      });

    expect(registeredUser.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(registeredUser.body.STATUS).toBe('SUCCESS');
    expect(registeredUser.body.DATA).toMatchObject({ id: expect.any(String) });
    expect(registeredUser.statusCode).toBe(200);
  });
});

describe('POST /login -> if username and password is correct', () => {
  test('should return user with authentication token', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send({
        password: 'LhAcKZgmdCU3rZm',
        username: 'Genevieve Gutkowski' 
      });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('SUCCESS');
    expect(user.body.DATA).toMatchObject({
      id: expect.any(String),
      token: expect.any(String)
    });
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /login -> if username is incorrect', () => {
  test('should return unauthorized status and user not exists', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send({
        password: 'LhAcKZgmdCU3rZm',
        username: 'wrongGenevieve Gutkowski' 
      });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('UNAUTHORIZED');
    expect(user.statusCode).toBe(401);
  });
});

describe('POST /login -> if password is incorrect', () => {
  test('should return unauthorized status and incorrect password', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send({
        password: 'wrongLhAcKZgmdCU3rZm',
        username: 'Genevieve Gutkowski' 
      });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('UNAUTHORIZED');
    expect(user.statusCode).toBe(401);
  });
});

describe('POST /login -> if username or password is empty string or has not passed in body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('BAD_REQUEST');
    expect(user.body.MESSAGE).toBe('Insufficient parameters');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /forgot-password -> if email has not passed from request body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ email: '' });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('BAD_REQUEST');
    expect(user.body.MESSAGE).toBe('Insufficient parameters');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /forgot-password -> if email passed from request body is not available in database ', () => {
  test('should return record not found status', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email': 'unavailable.email@hotmail.com', });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('RECORD_NOT_FOUND');
    expect(user.body.MESSAGE).toBe('Record not found with specified criteria.');
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /forgot-password -> if email passed from request body is valid and OTP sent successfully', () => {
  test('should return success message', async () => {
    const expectedOutputMessages = [
      'otp successfully send.',
      'otp successfully send to your email.',
      'otp successfully send to your mobile number.'
    ];
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email': 'valid.email@hotmail.com', });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('SUCCESS');
    expect(expectedOutputMessages).toContain(user.body.DATA);
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /forgot-password -> if sms/email service credentials are not given', () => {
  test('should return success message', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email': 'example@hotmail.com', });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('FAILURE');
    expect(user.statusCode).toBe(500);
  });
});

describe('POST /validate-otp -> otp is sent in request body and OTP is correct', () => {
  test('should return success', async () => {
    let login = await request(app)
      .post('/device/auth/login')
      .send({
        'password': 'password@123',
        'username': 'example@hotmail.com',
      });
    let foundUser = await request(app)
      .get(`/device/api/v1/user/${login.body.DATA.id}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${login.body.DATA.token}`
      });

    let user = await request(app)
      .post('/device/auth/validate-otp')
      .send({ 'otp': foundUser.body.DATA.resetPasswordLink.code, });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('SUCCESS');
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /validate-otp -> if OTP is incorrect or OTP has expired', () => {
  test('should return invalid OTP', async () => {
    let user = await request(app)
      .post('/device/auth/validate-otp')
      .send({ 'otp': 12334 });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('SUCCESS');
    expect(user.statusCode).toBe(200);
    expect(user.body.DATA).toBe('Invalid OTP');
  });
});

describe('POST /validate-otp -> if request body is empty or otp has not been sent in body', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .post('/device/auth/validate-otp')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('PUT /reset-password -> if request body is empty or code/newPassword is not given', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .put('/device/auth/reset-password')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('PUT /reset-password -> if code is invalid', () => {
  test('should return invalid code', async () => {
    let user = await request(app)
      .put('/device/auth/reset-password')
      .send({
        'code': '123',
        'newPassword': 'testPassword'
      });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.STATUS).toBe('SUCCESS');
    expect(user.body.DATA).toBe('Invalid Code');
    expect(user.statusCode).toBe(200);
  });
});

afterAll(() => {
  db.connection.dropDatabase();
  db.connection.close();
});
