/**
 * Cookie 安全 — sessionCookieHeader 单元测试
 */
const { sessionCookieHeader } = require('../server');

describe('Session Cookie Security', () => {
  test('contains HttpOnly flag', () => {
    const cookie = sessionCookieHeader('test-sid-123');
    expect(cookie).toContain('HttpOnly');
  });

  test('contains SameSite=Lax flag', () => {
    const cookie = sessionCookieHeader('test-sid-123');
    expect(cookie).toContain('SameSite=Lax');
  });

  test('contains Max-Age flag', () => {
    const cookie = sessionCookieHeader('test-sid-123');
    expect(cookie).toContain('Max-Age=2592000');
  });

  test('contains Path=/', () => {
    const cookie = sessionCookieHeader('test-sid-123');
    expect(cookie).toContain('Path=/');
  });

  test('includes the session ID', () => {
    const sid = 'unique-session-id-abc';
    const cookie = sessionCookieHeader(sid);
    expect(cookie).toContain(`mineradio_sid=${sid}`);
  });

  test('includes Secure flag in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const cookie = sessionCookieHeader('test-sid');
    expect(cookie).toContain('Secure');
    process.env.NODE_ENV = originalEnv;
  });

  test('omits Secure flag in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const cookie = sessionCookieHeader('test-sid');
    expect(cookie).not.toContain('Secure');
    process.env.NODE_ENV = originalEnv;
  });
});
