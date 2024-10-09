let jwtToken; // Variable to hold the JWT token

describe('User API Tests', () => {
  it('should 401 with invalid username password', async () => {
    const response = await fetch('http://localhost:3200/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type
      },
      body: JSON.stringify({ user: { username: 'super', password: 'super' } }), // Send the body with the 'hello' key
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    console.log(data);
    jwtToken = data.jwt; // Save the JWT token for reuse
  });

  it('should require username password', async () => {
    const response = await fetch('http://localhost:3200/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type
      },
    });
    expect(response.status).toBe(400);
  });

  it('should 401 with invalid username password', async () => {
    const response = await fetch('http://localhost:3200/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type
      },
      body: JSON.stringify({ user: { username: '', password: '' } }), // Send the body with the 'hello' key
    });
    expect(response.status).toBe(401);
  });
});
