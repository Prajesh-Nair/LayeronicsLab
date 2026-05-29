import { createFileRoute } from "@tanstack/react-router";
import { adminPageTitle } from "@/lib/brand";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: adminPageTitle("Settings") }] }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <AdminLayout title="Settings">
      <div className="bg-card rounded-2xl p-8 shadow-card max-w-2xl space-y-6">
        <div>
          <h2 className="font-semibold mb-2">Database</h2>
          <p className="text-sm text-muted-foreground">
            Products and orders are stored in Postgres via <code className="font-mono text-xs">DATABASE_URL</code>. Set it in
            your <code className="font-mono text-xs">.env</code> locally and in Vercel project settings for production.
            Run <code className="font-mono text-xs">npm run db:push</code> once to create tables; the catalog auto-seeds on
            first load.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Admin authentication</h2>
          <p className="text-sm text-muted-foreground">
            Configure <code className="font-mono text-xs">ADMIN_USERNAME</code>,{" "}
            <code className="font-mono text-xs">ADMIN_PASSWORD</code>, and{" "}
            <code className="font-mono text-xs">ADMIN_SESSION_SECRET</code> (32+ characters). See{" "}
            <code className="font-mono text-xs">.env.example</code>.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
