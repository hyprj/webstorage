export const retentionTimes = [
  "disabled",
  "1h",
  "12h",
  "1day",
  "7 days",
  "30 days",
] as const;

export type RetentionTime = (typeof retentionTimes)[number];

export type DefaultDataRetention = {
  time: RetentionTime;
};

const endpoint = "http://localhost:3001/data-retention/default-data-retention";

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
  return response.json() as Promise<DefaultDataRetention>;
}

export async function saveDefaultDataRetention(
  time: RetentionTime,
): Promise<DefaultDataRetention> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ time }),
  });
  await ensureSuccess(response);
  return response.json() as Promise<DefaultDataRetention>;
}
