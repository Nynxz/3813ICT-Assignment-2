// @ts-ignore
let jwtToken: string;

describe('User API Tests', () => {
  it('should successfully login', async () => {
    const response = await fetch('http://localhost:3200/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { username: 'super', password: 'super' } }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    console.log(data);
    jwtToken = data.jwt;
  });

  it('should 401 with invalid username password', async () => {
    const response = await fetch('http://localhost:3200/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { username: '', password: '' } }),
    });
    expect(response.status).toBe(401);
  });

  it('should require username password', async () => {
    const response = await fetch('http://localhost:3200/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(400);
  });

  it('should require a jwt', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(await response.json()).toEqual({ error: 'Missing Auth Header' });
    expect(response.status).toBe(400);
  });

  it('should require a valid jwt', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer Invalid',
      },
    });
    expect(response.status).toBe(400);
  });

  it('should allow logged in user', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
    });
    expect(response.status).toBe(200);
  });
});
