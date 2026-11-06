import { DefaultDataRetention } from "./DefaultDataRetention";

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
      <DefaultDataRetention />
    </section>
  );
}
