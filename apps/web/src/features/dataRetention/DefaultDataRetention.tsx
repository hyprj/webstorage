import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { Select } from "../../components/Select";
import {
  getDefaultDataRetention,
  getRetentionTime,
  retentionTimes,
  saveDefaultDataRetention,
  type RetentionTime,
} from "./api";

export function DefaultDataRetention() {
  const queryClient = useQueryClient();
  const retentionQuery = useQuery({
    queryKey: ["data-retention", "default"],
    queryFn: getDefaultDataRetention,
    refetchOnMount: "always",
  });
  const [selectedTime, setSelectedTime] = useState<RetentionTime | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const savedTime = retentionQuery.data
    ? getRetentionTime(retentionQuery.data.periodSeconds)
    : undefined;
  const currentTime = selectedTime ?? savedTime;

  const saveMutation = useMutation({
    mutationFn: saveDefaultDataRetention,
    onSuccess: (data) => {
      queryClient.setQueryData(["data-retention", "default"], data);
      setSelectedTime(null);
    },
  });

  const isLoading = retentionQuery.isLoading;

  return (
    <article className="max-w-2xl rounded-panel border border-border bg-surface p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="shield" className="size-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base">Default retention</h3>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="min-h-7 px-2"
                disabled={savedTime === undefined || retentionQuery.isError}
                onClick={() => {
                  saveMutation.reset();
                  setSelectedTime(null);
                  setIsEditing(true);
                }}
                aria-label="Edit default retention"
              >
                <Icon name="pencil" className="size-3.5" aria-hidden="true" />
                Edit
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            Fallback protection for files that do not match a more specific
            retention policy.
          </p>
        </div>
      </div>

      {retentionQuery.error && (
        <p role="alert" className="mt-5 text-sm text-danger-600">
          Failed to load default retention: {retentionQuery.error.message}
        </p>
      )}

      {saveMutation.error && (
        <p role="alert" className="mt-5 text-sm text-danger-600">
          Failed to save default retention: {saveMutation.error.message}
        </p>
      )}

      <dl className="mt-6 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Status</dt>
          <dd className="mt-1 font-medium">
            {isLoading
              ? "Loading..."
              : savedTime === undefined
                ? "Unavailable"
                : savedTime === "disabled"
                  ? "Disabled"
                  : "Configured"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Retention period</dt>
          <dd className="mt-1 font-medium">
            {isLoading
              ? "Loading..."
              : savedTime === "disabled"
                ? "Disabled"
                : (savedTime ?? "—")}
          </dd>
        </div>
      </dl>

      {isEditing && currentTime !== undefined && (
        <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-[minmax(0,16rem)_auto] sm:items-end">
          <Select
            label="Retention period"
            value={currentTime}
            disabled={isLoading || saveMutation.isPending}
            onChange={(event) =>
              setSelectedTime(event.target.value as RetentionTime)
            }
          >
            {retentionTimes.map((retentionTime) => (
              <option key={retentionTime} value={retentionTime}>
                {retentionTime === "disabled" ? "Disabled" : retentionTime}
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() =>
                saveMutation.mutate(currentTime, {
                  onSuccess: () => setIsEditing(false),
                })
              }
              disabled={isLoading || saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={() => {
                setSelectedTime(null);
                setIsEditing(false);
              }}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <p className="mt-5 text-sm text-muted">
        Retention does not prevent users from deleting files. It prevents
        permanent removal while the retention period is active.
      </p>
    </article>
  );
}
