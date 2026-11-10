export const retentionPeriods = {
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
} as const;

export type DEFAULT_RETENTION_PERIOD =
  null | (typeof retentionPeriods)[keyof typeof retentionPeriods];
