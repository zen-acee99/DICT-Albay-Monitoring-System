import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { Globe, ShieldAlert, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const email = currentUser.email || "";

        if (email.endsWith("dict.gov.ph")) {
          setUser(currentUser);
          setAuthError("");
          navigate('/')
        } else {
          setAuthError(
            "Access Denied: This system is restricted to official DICT accounts"
          );
          signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setAuthError("");
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        setAuthError(error.message);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleProceed = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b19] flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#0c132c] border border-slate-800/80 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2">
            <img src="/DictLOGO.png" className="w-12" />
            <span className="text-2xl font-black text-white">DigiGOV</span>
            <img src="/bbm.png" className="w-12" />
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Region V - DigiGOV Monitoring
          </p>
        </div>

        {/* Not logged in */}
        {!user ? (
          <div>
            <h2 className="text-center text-lg text-white mb-2">
              Identity Verification
            </h2>
            <p className="text-center text-xs text-slate-500 mb-6">
              Sign in with your official GovMail account
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-xs flex gap-2">
                <ShieldAlert className="w-4 h-4 mt-0.5" />
                {authError}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-semibold"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              Sign in with Google GovMail
            </button>
          </div>
        ) : (
          /* Logged in */
          <div className="text-center">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />

            <h3 className="text-white text-lg font-semibold">
              Access Granted
            </h3>

            <p className="text-slate-400 text-xs mt-1">
              Welcome, {user.displayName}
            </p>

            <div className="mt-3 text-xs text-slate-400 font-mono">
              {user.email}
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={handleProceed}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm"
              >
                Proceed to Dashboard
              </button>

              <button
                onClick={handleSignOut}
                className="text-xs text-slate-400 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}