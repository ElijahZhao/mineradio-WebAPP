/**
 * SSRF 防护 — isAllowedProxyTarget 单元测试
 * 验证代理目标白名单是否能正确拦截恶意 URL
 */
const { isAllowedProxyTarget } = require('../server');

describe('SSRF Protection: isAllowedProxyTarget', () => {
  // 合法目标 — 应允许
  test('allows music.126.net', () => {
    expect(isAllowedProxyTarget('https://music.126.net/song.mp3')).toBe(true);
  });

  test('allows p1.music.126.net', () => {
    expect(isAllowedProxyTarget('https://p1.music.126.net/song.mp3')).toBe(true);
  });

  test('allows music.163.com', () => {
    expect(isAllowedProxyTarget('https://music.163.com/song.mp3')).toBe(true);
  });

  test('allows y.qq.com', () => {
    expect(isAllowedProxyTarget('https://y.qq.com/audio.mp3')).toBe(true);
  });

  test('allows subdomain of qq.com', () => {
    expect(isAllowedProxyTarget('https://stream.qq.com/audio.mp3')).toBe(true);
  });

  // 恶意目标 — 应拒绝
  test('rejects localhost', () => {
    expect(isAllowedProxyTarget('http://localhost:8080/secret')).toBe(false);
  });

  test('rejects 127.0.0.1', () => {
    expect(isAllowedProxyTarget('http://127.0.0.1:8080/secret')).toBe(false);
  });

  test('rejects 10.x private network', () => {
    expect(isAllowedProxyTarget('http://10.0.0.1/internal')).toBe(false);
  });

  test('rejects 192.168.x private network', () => {
    expect(isAllowedProxyTarget('http://192.168.1.1/admin')).toBe(false);
  });

  test('rejects 169.254.169.254 cloud metadata', () => {
    expect(isAllowedProxyTarget('http://169.254.169.254/latest/meta-data/')).toBe(false);
  });

  test('rejects metadata.google.internal', () => {
    expect(isAllowedProxyTarget('http://metadata.google.internal/computeMetadata/')).toBe(false);
  });

  // 子串绕过攻击 — 应拒绝
  test('rejects music.163.com.evil.com (substring bypass)', () => {
    expect(isAllowedProxyTarget('https://music.163.com.evil.com/steal')).toBe(false);
  });

  test('rejects evil.music.126.net.attacker.com', () => {
    expect(isAllowedProxyTarget('https://evil.music.126.net.attacker.com/steal')).toBe(false);
  });

  test('rejects arbitrary external domain', () => {
    expect(isAllowedProxyTarget('https://example.com/data')).toBe(false);
  });

  test('rejects invalid URL', () => {
    expect(isAllowedProxyTarget('not-a-url')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isAllowedProxyTarget('')).toBe(false);
  });

  test('rejects ftp protocol', () => {
    expect(isAllowedProxyTarget('ftp://music.126.net/file')).toBe(false);
  });
});
