import { login, logout, getUser, register } from './auth';
import axios from 'axios';

jest.mock('axios');

describe('auth service', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('login stores tokens in localStorage', async () => {
    axios.post.mockResolvedValue({ data: { access: 'access-token', refresh: 'refresh-token' } });
    await login('user', 'pass');
    expect(localStorage.getItem('accessToken')).toBe('access-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
  });

  it('logout removes tokens from localStorage', () => {
    localStorage.setItem('accessToken', 'a');
    localStorage.setItem('refreshToken', 'r');
    logout();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('getUser returns null if no token', () => {
    expect(getUser()).toBeNull();
  });

  it('register calls API and returns data', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, username: 'newuser' } });
    const data = await register('newuser', 'email@example.com', 'pass');
    expect(data).toEqual({ id: 1, username: 'newuser' });
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users/api/register/'),
      { username: 'newuser', email: 'email@example.com', password: 'pass' }
    );
  });
}); 