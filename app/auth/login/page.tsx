"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebaseConfig";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      if (!userCredential.user.emailVerified) {
        setError("Veuillez vérifier votre adresse email avant de vous connecter.");
        setLoading(false);
        return;
      }
      setSuccess("Connexion réussie !");
      setLoading(false);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("handleGoogleLogin");
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      console.log(provider);
      console.log(auth);
      await signInWithPopup(auth, provider);
      console.log(auth);
      setSuccess("Connexion avec Google réussie !");
      setLoading(false);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-950 rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">Sign In</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" required className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" required className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" value={form.password} onChange={handleChange} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-md px-6 py-2 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Login"}
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-2 rounded-full bg-white text-gray-900 font-semibold shadow-md px-6 py-2 transition-all duration-200 flex items-center gap-2 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95"
          disabled={loading}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48"><g><path d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.2 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-.7-.1-1.3-.1-2z" fill="#FFC107"/><path d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.2 5.1 29.4 3 24 3c-7.2 0-13.4 3.1-17.7 8z" fill="#FF3D00"/><path d="M24 45c5.4 0 10.2-1.8 14-4.9l-6.5-5.3C29.7 36.7 26.9 37.5 24 37.5c-5.7 0-10.6-3.7-12.3-8.8l-7 5.4C7.9 41.2 15.4 45 24 45z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2.1l-7 5.4C15.4 41.2 19.4 43 24 43c10.5 0 19.5-7.6 21-17.5 0-.7-.1-1.3-.1-2z" fill="#1976D2"/></g></svg>
          {loading ? "Connexion..." : "Login with Google"}
        </button>
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link href="/auth/signup" className="text-cyan-400 hover:underline">Don't have an account? Sign up</Link>
          <Link href="/" className="text-gray-400 hover:underline">Home</Link>
        </div>
      </div>
    </div>
  );
} 