describe('HTTP Debug Tests', () => {
  it('should return "Hello World"', async () => {
    const response = await fetch('http://localhost:3200/api/v1/hello');
    expect(await response.text()).toBe('Hello World');
    expect(response.status).toBe(200);
  });

  it('should return 404 for non-existing endpoint', async () => {
    const response = await fetch('http://localhost:3200/non-existing12321');
    expect(response.status).toBe(404);
  });

  it('should require hello body key', async () => {
    const response = await fetch('http://localhost:3200/api/v1/ping', {
      method: 'POST',
    });
    expect(await response.json()).toEqual({ error: 'Cannot find hello' });
    expect(response.status).toBe(400);
  });

  it('should allow hello body key', async () => {
    const response = await fetch('http://localhost:3200/api/v1/ping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hello: 'world' }),
    });

    expect(response.status).toBe(200);
  });

  it('should require SUPER user', async () => {
    const response = await fetch('http://localhost:3200/api/v1/users/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status).toBe(400);
  });

  it('should be true', async () => {
    expect(true).toBe(true);
  });
});
