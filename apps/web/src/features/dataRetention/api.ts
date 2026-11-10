export const retentionTimes = [
  "disabled",
  "1h",
  "1day",
  "7 days",
  "30 days",
] as const;

export type RetentionTime = (typeof retentionTimes)[number];

export type DefaultDataRetention = {
  id: number;
  periodSeconds: number | null;
};

export const retentionSeconds = {
  disabled: null,
  "1h": 3600,
  "1day": 86400,
  "7 days": 604800,
  "30 days": 2592000,
} as const satisfies Record<RetentionTime, number | null>;

export function getRetentionTime(periodSeconds: number | null): RetentionTime {
  const time = retentionTimes.find(
    (time) => retentionSeconds[time] === periodSeconds,
  );
  if (time === undefined) {
    throw new Error("Unsupported retention period returned by the server");
  }
  return time;
}

const endpoint = "http://localhost:3001/data-retention/default";

async function ensureSuccess(response: Response) {
  if (response.ok) {
    return;
  }

  const errorData = await response.json().catch(() => null);
  throw new Error(errorData?.message || `Server error: ${response.status}`);
}

export async function getDefaultDataRetention(): Promise<DefaultDataRetention> {
  const response = await fetch(endpoint);
  await ensureSuccess(response);
  const data: DefaultDataRetention = await response.json();
  getRetentionTime(data.periodSeconds);
  return data;
}

export async function saveDefaultDataRetention(
  time: RetentionTime,
): Promise<DefaultDataRetention> {
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ periodSeconds: retentionSeconds[time] }),
  });
  await ensureSuccess(response);
  const data: DefaultDataRetention = await response.json();
  getRetentionTime(data.periodSeconds);
  return data;
}
