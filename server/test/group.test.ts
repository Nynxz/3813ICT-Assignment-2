// @ts-ignore
let jwtToken: string;
let groupId: string;

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

  it('should successfully create group', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
      body: JSON.stringify({ group: { name: 'groupName' } }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    console.log(data._id);
    groupId = data._id;
  });

  it('should successfully get groups', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
    });
    expect(response.status).toBe(200);
  });

  it('should successfully get groups all', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
    });
    expect(response.status).toBe(200);
  });

  it('should require group header', async () => {
    const response = await fetch(
      'http://localhost:3200/api/v1/groups/channels',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwtToken,
        },
      },
    );
    expect(await response.json()).toEqual({ error: 'Missing group Header' });
    expect(response.status).toBe(400);
  });

  it('should successfully get groups channels', async () => {
    const response = await fetch(
      'http://localhost:3200/api/v1/groups/channels',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwtToken,
          group: groupId,
        },
      },
    );
    expect(response.status).toBe(200);
  });

  it('should successfully get group info', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
        group: groupId,
      },
    });
    const j = await response.json();
    expect(j.name).toBe('groupName');
    expect(j._id).toBe(groupId);
    expect(response.status).toBe(200);
  });

  it('should successfully delete group', async () => {
    const response = await fetch('http://localhost:3200/api/v1/groups/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
      body: JSON.stringify({ group: { _id: groupId } }),
    });
    expect(response.status).toBe(200);
  });
});
