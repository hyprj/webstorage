import 'reflect-metadata';
import {
  BadRequestException,
  InternalServerErrorException,
  RequestMethod,
} from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DefaultRetentionRepository } from './default-retention.repository';
import { retentionPeriods } from './retention-policy';
import { DefaultRetentionController } from './default-retention.controller';
import { DefaultRetentionService } from './default-retention.service';

describe('Default retention', () => {
  let repository: {
    getDefault: ReturnType<
      typeof vi.fn<DefaultRetentionRepository['getDefault']>
    >;
    updateDefault: ReturnType<
      typeof vi.fn<DefaultRetentionRepository['updateDefault']>
    >;
  };
  let service: DefaultRetentionService;

  beforeEach(() => {
    repository = {
      getDefault: vi.fn<DefaultRetentionRepository['getDefault']>(),
      updateDefault: vi.fn<DefaultRetentionRepository['updateDefault']>(),
    };
    service = new DefaultRetentionService(repository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
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
      repository.getDefault.mockResolvedValue(record);

      await expect(service.getDefaultRetention()).resolves.toEqual(record);
    },
  );

  it('reports a server configuration error when the singleton is missing', async () => {
    repository.getDefault.mockResolvedValue(undefined);

    await expect(service.getDefaultRetention()).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it.each(Object.values(retentionPeriods))(
    'saves the supported retention period %s',
    async (periodSeconds) => {
      const record = { id: 1, periodSeconds };
      repository.updateDefault.mockResolvedValue(record);

      await expect(
        service.updateDefaultRetention(periodSeconds),
      ).resolves.toEqual(record);
      expect(repository.updateDefault).toHaveBeenCalledWith(periodSeconds);
    },
  );

  it('rejects unsupported periods without updating the repository', async () => {
    // @ts-expect-error Exercise runtime validation of an invalid request value.
    await expect(service.updateDefaultRetention(123)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.updateDefault).not.toHaveBeenCalled();
  });

  it('reports missing configuration when updating retention', async () => {
    repository.updateDefault.mockResolvedValue(undefined);

    await expect(
      service.updateDefaultRetention(retentionPeriods.day),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('allows immediate deletion when retention is disabled', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-02T00:00:00Z'));
    repository.getDefault.mockResolvedValue({ id: 1, periodSeconds: null });

    await expect(service.canPermanentlyDeleteEntry(new Date())).resolves.toBe(
      true,
    );
  });

  describe.each([
    retentionPeriods.hour,
    retentionPeriods.day,
    retentionPeriods.week,
    retentionPeriods.month,
  ])('retention of %s seconds', (periodSeconds) => {
    it.each([
      { offsetMs: -1, allowed: false },
      { offsetMs: 0, allowed: true },
      { offsetMs: 1, allowed: true },
    ])(
      'returns $allowed at $offsetMs ms from expiry',
      async ({ offsetMs, allowed }) => {
        vi.useFakeTimers();
        const deletedAt = new Date('2026-01-01T00:00:00.500Z');
        vi.setSystemTime(deletedAt.getTime() + periodSeconds * 1000 + offsetMs);
        repository.getDefault.mockResolvedValue({ id: 1, periodSeconds });

        await expect(
          service.canPermanentlyDeleteEntry(deletedAt),
        ).resolves.toBe(allowed);
      },
    );
  });

  it('uses the current period for entries already in trash', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T02:00:00Z'));
    const deletedAt = new Date('2026-01-01T00:00:00Z');
    repository.getDefault
      .mockResolvedValueOnce({ id: 1, periodSeconds: retentionPeriods.hour })
      .mockResolvedValueOnce({ id: 1, periodSeconds: retentionPeriods.day });

    await expect(service.canPermanentlyDeleteEntry(deletedAt)).resolves.toBe(
      true,
    );
    await expect(service.canPermanentlyDeleteEntry(deletedAt)).resolves.toBe(
      false,
    );
  });

  it('does not allow deletion when retention configuration is missing', async () => {
    repository.getDefault.mockResolvedValue(undefined);

    await expect(
      service.canPermanentlyDeleteEntry(new Date()),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
