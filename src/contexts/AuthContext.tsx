import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export type UserPlan = "free" | "premium";
export type UserRole = "user" | "admin";
export type AppUser = User & {
  plan: UserPlan;
  role: UserRole;
  githubAccessToken?: string | null;
};


interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (provider: "github" | "google") => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const HARDCODED_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const normalizePlan = (raw: unknown): UserPlan =>
  raw === "premium" ? "premium" : "free";

const normalizeRole = (raw: unknown): UserRole =>
  raw === "admin" ? "admin" : "user";

async function fetchProfileDetails(
  userId: string
): Promise<{ plan: UserPlan; role: UserRole; email?: string }> {
  if (!userId) {
    return { plan: "free", role: "user" };
  }

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("plan,email,role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to load current user profile", error);
      return { plan: "free", role: "user" };
    }

    if (!data) {
      return { plan: "free", role: "user" };
    }

    return {
      plan: normalizePlan(data.plan),
      role: normalizeRole(data.role),
      email: data.email ?? undefined,
    };
  } catch (err) {
    console.error("Unexpected profile fetch error", err);
    return { plan: "free", role: "user" };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserState = useCallback(
    async (activeSession: Session | null, silent = false) => {
      const supabaseUser = activeSession?.user ?? null;
      if (!supabaseUser) {
        setUser(null);
        if (!silent) setLoading(false);
        return;
      }

      const profile = await fetchProfileDetails(supabaseUser.id);
      const enrichedUser: AppUser = {
        ...supabaseUser,
        email: profile.email ?? supabaseUser.email ?? "",
        plan: profile.plan,
        role: profile.role,
        // GitHub OAuth token (only when provider is GitHub)
        githubAccessToken:
          supabaseUser.app_metadata?.provider === "github"
            ? activeSession?.provider_token ?? null
            : null,
      };
      setUser(enrichedUser);
      if (!silent) setLoading(false);
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);
      await syncUserState(session, true);
      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      await syncUserState(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncUserState]);

  const signIn = async (provider: "github" | "google") => {
    console.log(`🔐 Starting ${provider} OAuth flow...`);

    try {
      const options: any = {
      redirectTo: `${window.location.origin}/auth/callback`,
      };

      // 🔴 IMPORTANT: ask for repo scope when using GitHub
      if (provider === "github") {
        options.scopes = "repo user:email"; // or "public_repo user:email" if you only want public repos
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options,
      });

      if (error) {
        console.error("OAuth sign-in error", error);
        alert(
          `${provider} OAuth provider is not configured in Supabase yet.\n\n${error.message}`
        );
        return { error };
      }

      if (data?.url) {
        return { data };
      }

      alert(
        `${provider} OAuth provider is not configured. Please finish the setup in Supabase first.`
      );
      return { error: "No redirect URL" };
    } catch (err) {
      console.error("OAuth exception", err);
      return { error: err instanceof Error ? err.message : "Unknown error" };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out", error);
    }
    setUser(null);
    setSession(null);
  };

  const refreshProfile = useCallback(async () => {
    await syncUserState(session);
  }, [session, syncUserState]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
