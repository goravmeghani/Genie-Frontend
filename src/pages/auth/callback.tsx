// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { supabase } from '../../lib/supabaseClient'

// const AuthCallback = () => {
//   const navigate = useNavigate()

//   useEffect(() => {
//     const handleAuthCallback = async () => {
//       try {
//         const url = window.location.href
//         const hasCode = /[?&](code|access_token)=/.test(url) || /[#](access_token)=/.test(url)

//         // If the provider redirected with an auth code or access token, exchange it for a session first
//         if (hasCode) {
//           const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(url)
//           if (exchangeError) {
//             console.error('Auth code exchange error:', exchangeError)
//             navigate('/home', { replace: true })
//             return
//           }
//           if (exchangeData?.session) {
//             navigate('/dashboard', { replace: true })
//             return
//           }
//         }

//         // Fallback: check existing session (in case it was already processed)
//         const { data, error } = await supabase.auth.getSession()
//         if (error) {
//           console.error('Auth callback error:', error)
//           navigate('/home', { replace: true })
//           return
//         }

//         if (data.session) {
//           // Authenticated → go to dashboard
//           navigate('/dashboard', { replace: true })
//         } else {
//           // No session → go home
//           navigate('/home', { replace: true })
//         }
//       } catch (error) {
//         console.error('Auth callback error:', error)
//         navigate('/home', { replace: true })
//       }
//     }

//     handleAuthCallback()
//   }, [navigate])

//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//       <div className="text-center">
//         <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
//           <img src="/logo.svg" alt="Genie logo" className="w-10 h-10" />
//         </div>
//         <h2 className="text-xl font-semibold text-white mb-2">Completing sign in...</h2>
//         <p className="text-gray-400">Please wait while we redirect you.</p>
//       </div>
//     </div>
//   )
// }

// export default AuthCallback





// src/pages/auth/callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth(); // this loads plan + role

  useEffect(() => {
    const finishSignIn = async () => {
      try {
        // Let Supabase parse the access_token in the URL and hydrate the session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session in callback:", error);
          navigate("/home", { replace: true });
          return;
        }

        if (!data.session) {
          console.warn("No session found in callback, redirecting home.");
          navigate("/home", { replace: true });
          return;
        }

        // Pull fresh profile (plan + role) from user_profiles
        await refreshProfile();

        // Decide where to send the user
        const current = data.session.user;
        // tiny extra fetch just for role OR rely on AuthContext.user after refreshProfile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", current.id)
          .maybeSingle();

        const role = (profile?.role || "user").toLowerCase();

        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        navigate("/home", { replace: true });
      }
    };

    void finishSignIn();
  }, [navigate, refreshProfile]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 px-8 py-6 shadow-xl">
        <p className="text-lg font-semibold">Completing sign in…</p>
        <p className="mt-2 text-sm text-slate-400">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
