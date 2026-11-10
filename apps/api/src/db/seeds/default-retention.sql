INSERT INTO "defaultDataRetention" ("id", "period_seconds")
VALUES (1, NULL)
ON CONFLICT ("id") DO NOTHING;
