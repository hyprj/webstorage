import { Icon } from "../../components/Icon";

export function DataRetentionView() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl">Data retention</h2>
        <p className="mt-1 text-sm text-muted">
          Define how long deleted files should be protected from permanent
          purge.
        </p>
      </div>

      <article className="max-w-2xl rounded-panel border border-border bg-surface p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <Icon name="shield" className="size-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base">Default retention</h3>
            <p className="mt-1 text-sm text-muted">
              Fallback protection for files that do not match a more specific
              retention policy.
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Status</dt>
            <dd className="mt-1 font-medium">Not configured</dd>
          </div>
          <div>
            <dt className="text-muted">Protected content</dt>
            <dd className="mt-1 font-medium">Files in Trash</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm text-muted">
          Retention does not prevent users from deleting files. It prevents
          permanent removal while the retention period is active.
        </p>
      </article>
    </section>
  );
}
