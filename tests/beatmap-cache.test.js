/**
 * 节拍缓存 — beatCacheRootInfo / readBeatMapCache / writeBeatMapCache 单元测试
 */
const { beatCacheRootInfo, readBeatMapCache, writeBeatMapCache } = require('../server');

describe('Beatmap Cache', () => {
  describe('beatCacheRootInfo', () => {
    test('returns object with required fields', () => {
      const info = beatCacheRootInfo();
      expect(info).toHaveProperty('allowed');
      expect(info).toHaveProperty('available');
      expect(info).toHaveProperty('dir');
      expect(info).toHaveProperty('drive');
    });

    test('dir is a string path', () => {
      const info = beatCacheRootInfo();
      expect(typeof info.dir).toBe('string');
      expect(info.dir.length).toBeGreaterThan(0);
    });
  });

  describe('writeBeatMapCache + readBeatMapCache', () => {
    test('writes and reads back a cache entry', async () => {
      const testData = {
        key: 'test-beatmap-001',
        map: { beats: [1, 2, 3], duration: 180 },
        meta: { source: 'netease', title: 'Test Song' },
      };

      const writeResult = await writeBeatMapCache(testData);
      expect(writeResult.ok).toBe(true);

      const readResult = await readBeatMapCache('test-beatmap-001');
      expect(readResult).not.toBeNull();
      expect(readResult.key).toBe('test-beatmap-001');
      expect(readResult.map).toEqual({ beats: [1, 2, 3], duration: 180 });
      expect(readResult.meta).toEqual({ source: 'netease', title: 'Test Song' });
      expect(readResult.savedAt).toBeGreaterThan(0);
    });

    test('returns null for non-existent key', async () => {
      const result = await readBeatMapCache('non-existent-key-99999');
      expect(result).toBeNull();
    });

    test('returns null for empty key', async () => {
      const result = await readBeatMapCache('');
      expect(result).toBeNull();
    });

    test('returns null for overly long key (>200 chars)', async () => {
      const longKey = 'a'.repeat(201);
      const result = await readBeatMapCache(longKey);
      expect(result).toBeNull();
    });

    test('rejects write without key', async () => {
      const result = await writeBeatMapCache({ map: { beats: [] } });
      expect(result.ok).toBe(false);
    });

    test('truncates key to 200 chars', async () => {
      const longKey = 'b'.repeat(300);
      const result = await writeBeatMapCache({ key: longKey, map: { beats: [1] } });
      expect(result.ok).toBe(true);
      expect(result.key.length).toBeLessThanOrEqual(200);
    });
  });
});
