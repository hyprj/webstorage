import 'reflect-metadata';
import { InternalServerErrorException, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { describe, expect, it, vi } from 'vitest';
import { DefaultRetentionController } from './default-retention.controller';
import { DefaultRetentionService } from './default-retention.service';

describe('Default retention', () => {
  it('registers GET /data-retention/default', () => {
    expect(Reflect.getMetadata(PATH_METADATA, DefaultRetentionController)).toBe(
      'data-retention/default',
    );
    const handler = DefaultRetentionController.prototype.getDefaultRetention;
    expect(Reflect.getMetadata(PATH_METADATA, handler)).toBe('/');
    expect(Reflect.getMetadata(METHOD_METADATA, handler)).toBe(
      RequestMethod.GET,
    );
  });

  it.each([null, 3600, 86400, 604800, 2592000])(
    'returns the saved period %s, including disabled retention',
    async (periodSeconds) => {
      const record = { id: 1, periodSeconds };
      const repository = { getDefault: vi.fn().mockResolvedValue(record) };
      const service = new DefaultRetentionService(repository);

      await expect(service.getDefaultRetention()).resolves.toEqual(record);
    },
  );

  it('reports a server configuration error when the singleton is missing', async () => {
    const repository = { getDefault: vi.fn().mockResolvedValue(undefined) };
    const service = new DefaultRetentionService(repository);

    await expect(service.getDefaultRetention()).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
