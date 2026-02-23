import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;

      if (!currentSession) {
        setSession(null);
        setLoading(false);
        return;
      }

      // ✅ 7 day inactivity check
      const lastActivity = localStorage.getItem("lastActivity");
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (lastActivity) {
        const diff = now - parseInt(lastActivity);

        if (diff > sevenDays) {
          await supabase.auth.signOut();
          localStorage.removeItem("lastActivity");
          setSession(null);
          setLoading(false);
          return;
        }
      }

      setSession(currentSession);
      setLoading(false);
    };

    checkSession();
  }, []);

  // 🔄 Track activity
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("keypress", updateActivity);

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keypress", updateActivity);
    };
  }, []);

  if (loading) return null;

  if (!session) return <Navigate to="/signin" replace />;

  return children;
}
