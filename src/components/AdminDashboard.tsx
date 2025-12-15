import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Loader2,
  Shield,
  Sparkles,
  Users as UsersIcon,
  BarChart3,
  PiggyBank,
} from "lucide-react";
import FloatingSparkles from "./FloatingSparkles";
import GlowOrbs from "./GlowOrbs";
import AuroraGradient from "./AuroraGradient";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import type { UserPlan } from "../contexts/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

type AdminTab = "users" | "pricing" | "metrics";

interface AdminUser {
  id: string;
  email: string;
  plan: UserPlan;
  role: "user" | "admin";
  created_at?: string | null;
  last_login_at?: string | null;
}

interface PricingPlan {
  id: string;
  name: string;
  stripe_price_id?: string | null;
  monthly_price_label?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

interface Metrics {
  total_users: number;
  premium_users: number;
  free_users: number;
  admin_users: number;
  // monthly_active_users: number;
  total_threads: number;
  // total_messages: number;
}

interface PricingDraft {
  monthly_price_label: string;
  description: string;
  is_active: boolean;
  stripe_price_id: string;
}

const glassPanel =
  "bg-slate-900/70 border border-slate-700/40 backdrop-blur-2xl shadow-[0_18px_60px_rgba(8,11,34,0.55)]";

const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = !!user && user.role === "admin";
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  const [usersState, setUsersState] = useState<{
    data: AdminUser[];
    loading: boolean;
    error: string | null;
    savingUserId: string | null;
  }>({
    data: [],
    loading: false,
    error: null,
    savingUserId: null,
  });

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [pricingDraft, setPricingDraft] = useState<PricingDraft>({
    monthly_price_label: "",
    description: "",
    is_active: true,
    stripe_price_id: "",
  });
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingSuccess, setPricingSuccess] = useState<string | null>(null);

  const [metricsState, setMetricsState] = useState<{
    data: Metrics | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const premiumPlan = useMemo(
    () => pricingPlans.find((plan) => plan.name === "premium"),
    [pricingPlans]
  );

  useEffect(() => {
    if (premiumPlan) {
      setPricingDraft({
        monthly_price_label: premiumPlan.monthly_price_label || "",
        description: premiumPlan.description || "",
        is_active: premiumPlan.is_active,
        stripe_price_id: premiumPlan.stripe_price_id || "",
      });
    }
  }, [premiumPlan]);

  const withAdminParam = useCallback(
    (path: string) => {
      if (!user?.id) return `${API_BASE_URL}${path}`;
      const separator = path.includes("?") ? "&" : "?";
      return `${API_BASE_URL}${path}${separator}admin_user_id=${encodeURIComponent(
        user.id
      )}`;
    },
    [user?.id]
  );

  const loadUsers = useCallback(async () => {
    if (!user?.id) return;
    setUsersState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(withAdminParam("/admin/users"));
      if (!response.ok) {
        throw new Error(`Failed to fetch users (${response.status})`);
      }
      const data: AdminUser[] = await response.json();
      setUsersState((prev) => ({ ...prev, data, loading: false }));
    } catch (err) {
      console.error("Admin users fetch failed", err);
      setUsersState((prev) => ({
        ...prev,
        loading: false,
        error:
          err instanceof Error ? err.message : "Unable to load user list right now.",
      }));
    }
  }, [user?.id, withAdminParam]);

  const loadPricing = useCallback(async () => {
    if (!user?.id) return;
    setPricingLoading(true);
    setPricingError(null);
    try {
      const response = await fetch(withAdminParam("/admin/pricing"));
      if (!response.ok) {
        throw new Error(`Failed to fetch pricing (${response.status})`);
      }
      const data: PricingPlan[] = await response.json();
      setPricingPlans(data);
    } catch (err) {
      console.error("Admin pricing fetch failed", err);
      setPricingError(
        err instanceof Error ? err.message : "Unable to load pricing plans."
      );
      setPricingPlans([]);
    } finally {
      setPricingLoading(false);
    }
  }, [user?.id, withAdminParam]);

  const loadMetrics = useCallback(async () => {
    if (!user?.id) return;
    setMetricsState((prev) => ({ data: prev.data, loading: true, error: null }));
    try {
      const response = await fetch(withAdminParam("/admin/metrics"));
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics (${response.status})`);
      }
      const data: Metrics = await response.json();
      setMetricsState({ data, loading: false, error: null });
    } catch (err) {
      console.error("Admin metrics fetch failed", err);
      setMetricsState({
        data: null,
        loading: false,
        error:
          err instanceof Error ? err.message : "Unable to load metrics data.",
      });
    }
  }, [user?.id, withAdminParam]);

  useEffect(() => {
    if (!isAdmin) return;
    loadUsers();
    loadPricing();
    loadMetrics();
  }, [isAdmin, loadUsers, loadPricing, loadMetrics]);

  const formatDate = (value?: string | null) => {
    if (!value) return "--";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const handlePlanChange = async (targetId: string, plan: UserPlan) => {
    if (!user?.id) return;
    const previousPlan =
      usersState.data.find((entry) => entry.id === targetId)?.plan ?? "free";
    if (previousPlan === plan) return;

    setUsersState((prev) => ({
      ...prev,
      savingUserId: targetId,
      data: prev.data.map((entry) =>
        entry.id === targetId ? { ...entry, plan } : entry
      ),
    }));

    try {
      const response = await fetch(
        withAdminParam(`/admin/users/${targetId}/plan`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update plan (${response.status})`);
      }
      const updated: AdminUser = await response.json();
      setUsersState((prev) => ({
        ...prev,
        data: prev.data.map((entry) =>
          entry.id === updated.id ? updated : entry
        ),
        savingUserId: null,
      }));
    } catch (err) {
      console.error("Plan update failed", err);
      setUsersState((prev) => ({
        ...prev,
        data: prev.data.map((entry) =>
          entry.id === targetId ? { ...entry, plan: previousPlan } : entry
        ),
        savingUserId: null,
        error:
          err instanceof Error
            ? err.message
            : "Unable to update the plan right now.",
      }));
    }
  };

  const handlePricingInput = (
    field: keyof PricingDraft,
    value: string | boolean
  ) => {
    setPricingDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePricing = async () => {
    if (!user?.id || !premiumPlan) return;
    const payload: Record<string, unknown> = {};
    if (pricingDraft.monthly_price_label !== premiumPlan.monthly_price_label) {
      payload.monthly_price_label = pricingDraft.monthly_price_label;
    }
    if (pricingDraft.description !== premiumPlan.description) {
      payload.description = pricingDraft.description;
    }
    if (pricingDraft.is_active !== premiumPlan.is_active) {
      payload.is_active = pricingDraft.is_active;
    }
    if ((pricingDraft.stripe_price_id || "") !== (premiumPlan.stripe_price_id || "")) {
      payload.stripe_price_id = pricingDraft.stripe_price_id || null;
    }
    if (Object.keys(payload).length === 0) {
      setPricingSuccess("No changes to save.");
      return;
    }

    setPricingSaving(true);
    setPricingError(null);
    setPricingSuccess(null);
    try {
      const response = await fetch(
        withAdminParam(`/admin/pricing/${premiumPlan.id}`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update pricing (${response.status})`);
      }
      const updated: PricingPlan = await response.json();
      setPricingPlans((prev) =>
        prev.map((plan) => (plan.id === updated.id ? updated : plan))
      );
      setPricingSuccess("Pricing updated.");
    } catch (err) {
      console.error("Pricing update failed", err);
      setPricingError(
        err instanceof Error
          ? err.message
          : "Unable to update pricing right now."
      );
    } finally {
      setPricingSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center px-4">
        <AuroraGradient />
        <GlowOrbs />
        <FloatingSparkles count={18} className="z-0" />
        <div
          className={`${glassPanel} relative z-10 max-w-lg w-full rounded-3xl p-8 text-center`}
        >
          <Shield className="mx-auto mb-4 h-10 w-10 text-rose-300" />
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-slate-300">
            You do not have permission to access the Admin Dashboard.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate("/home")} className="rounded-2xl">
              Back to Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl"
            >
              Go to Chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const metricCards = metricsState.data
    ? [
        {
          label: "Total Users",
          value: metricsState.data.total_users,
          icon: UsersIcon,
        },
        {
          label: "Premium Users",
          value: metricsState.data.premium_users,
          icon: Sparkles,
        },
        {
          label: "Free Users",
          value: metricsState.data.free_users,
          icon: Shield,
        },
        {
          label: "Admin Users",
          value: metricsState.data.admin_users,
          icon: BadgeCheck,
        },
        // {
        //   label: "Monthly Active",
        //   value: metricsState.data.monthly_active_users,
        //   icon: BarChart3,
        // },
        {
          label: "Total Threads",
          value: metricsState.data.total_threads,
          icon: UsersIcon,
        },
        // {
        //   label: "Total Messages",
        //   value: metricsState.data.total_messages,
        //   icon: PiggyBank,
        // },
      ]
    : [];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <AuroraGradient />
      <GlowOrbs />
      <FloatingSparkles count={24} className="z-0" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 space-y-8">
        <header
          className={`rounded-3xl p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between ${glassPanel}`}
        >
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-wide">
                Level 1 Admin
              </p>
              <h1 className="text-3xl font-semibold mt-1 flex items-center gap-2">
                Admin Dashboard
                <span className="text-xs uppercase bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full">
                  Admin
                </span>
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              className="rounded-2xl border border-slate-600/60"
              onClick={loadUsers}
            >
              Refresh Users
            </Button>
            <Button
              variant="ghost"
              className="rounded-2xl border border-slate-600/60"
              onClick={loadPricing}
            >
              Refresh Pricing
            </Button>
            <Button
              variant="ghost"
              className="rounded-2xl border border-slate-600/60"
              onClick={loadMetrics}
            >
              Refresh Metrics
            </Button>
          </div>
        </header>

        <div className={`${glassPanel} rounded-3xl p-2 flex flex-wrap gap-2`}>
          {(["users", "pricing", "metrics"] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-cyan-500/70 to-violet-500/70 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-slate-900/60 text-slate-300 hover:text-white"
              }`}
            >
              {tab === "users"
                ? "Users"
                : tab === "pricing"
                ? "Pricing"
                : "Metrics"}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <section className={`${glassPanel} rounded-3xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-cyan-300" />
                Users
              </h2>
              <p className="text-sm text-slate-400">
                {usersState.data.length} records
              </p>
            </div>
            {usersState.error && (
              <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {usersState.error}
              </div>
            )}
            <div className="overflow-x-auto rounded-2xl border border-slate-800/60">
              {usersState.loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-800 text-sm">
                  <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {usersState.data.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{entry.email || "--"}</div>
                          <div className="text-[11px] text-slate-500">
                            {entry.id}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={entry.plan}
                              onChange={(event) =>
                                handlePlanChange(
                                  entry.id,
                                  event.target.value as UserPlan
                                )
                              }
                              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1 text-sm"
                            >
                              <option value="free">Free</option>
                              <option value="premium">Premium</option>
                            </select>
                            {usersState.savingUserId === entry.id && (
                              <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              entry.role === "admin"
                                ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/40"
                                : "bg-slate-800/70 text-slate-300 border border-slate-700/60"
                            }`}
                          >
                            {entry.role === "admin" ? (
                              <>
                                <Shield className="h-3.5 w-3.5" />
                                Admin
                              </>
                            ) : (
                              "User"
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {formatDate(entry.created_at)}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {formatDate(entry.last_login_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === "pricing" && (
          <section className={`${glassPanel} rounded-3xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-emerald-300" />
                Pricing
              </h2>
              {premiumPlan && (
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  Stripe Price ID: {premiumPlan.stripe_price_id || "--"}
                </span>
              )}
            </div>
            {pricingError && (
              <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {pricingError}
              </div>
            )}
            {pricingSuccess && (
              <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {pricingSuccess}
              </div>
            )}
            {pricingLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
              </div>
            ) : premiumPlan ? (
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-slate-400">Stripe Price ID</label>
                  <input
                    type="text"
                    value={pricingDraft.stripe_price_id}
                    onChange={(event) =>
                      handlePricingInput("stripe_price_id", event.target.value)
                    }
                    placeholder="price_12345 from Stripe dashboard"
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white text-sm font-mono"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Paste the test mode Price ID from your Stripe dashboard (e.g.{" "}
                    <span className="font-mono">price_...</span>).
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Monthly Price Label</label>
                  <input
                    type="text"
                    value={pricingDraft.monthly_price_label}
                    onChange={(event) =>
                      handlePricingInput("monthly_price_label", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Description</label>
                  <textarea
                    value={pricingDraft.description}
                    onChange={(event) =>
                      handlePricingInput("description", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white min-h-[120px]"
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={pricingDraft.is_active}
                    onChange={(event) =>
                      handlePricingInput("is_active", event.target.checked)
                    }
                    className="h-4 w-4 rounded border border-slate-600 bg-slate-900"
                  />
                  Premium plan is active
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSavePricing}
                    disabled={pricingSaving}
                    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/30"
                  >
                    {pricingSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => premiumPlan && setPricingDraft({
                      monthly_price_label: premiumPlan.monthly_price_label || "",
                      description: premiumPlan.description || "",
                      is_active: premiumPlan.is_active,
                      stripe_price_id: premiumPlan.stripe_price_id || "",
                    })}
                    className="rounded-2xl border border-slate-700/60"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
                No premium pricing plan found. Create one in Supabase to manage it
                here.
              </div>
            )}
          </section>
        )}

        {activeTab === "metrics" && (
          <section className={`${glassPanel} rounded-3xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-300" />
                Metrics
              </h2>
            </div>
            {metricsState.error && (
              <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {metricsState.error}
              </div>
            )}
            {metricsState.loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
              </div>
            ) : metricsState.data ? (
              <div className="grid gap-4 md:grid-cols-2">
                {metricCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-950/60 to-indigo-950/30 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{card.label}</p>
                        <p className="text-2xl font-semibold mt-2">
                          {card.value.toLocaleString()}
                        </p>
                      </div>
                      <card.icon className="h-6 w-6 text-cyan-300" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/50 px-4 py-6 text-sm text-slate-400">
                No metrics available.
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
