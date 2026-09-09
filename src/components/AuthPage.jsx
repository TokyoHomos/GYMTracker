import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AuthPage() {
  const [mode, setMode] = useState('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'sign_in') {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          throw error;
        }

        console.log('Login successful:', data);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        console.log('Sign up successful:', data);

        // If email confirmation is enabled in Supabase,
        // the user must verify their email before logging in.
        if (data.user && !data.session) {
          setMessage(
            'Account created. Please check your email to confirm your account.'
          );
        } else {
          setMessage('Account created successfully.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);

      setError(
        err?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((currentMode) =>
      currentMode === 'sign_in' ? 'sign_up' : 'sign_in'
    );

    setError(null);
    setMessage(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <Dumbbell
            className="text-orange-500"
            size={28}
          />

          <span className="text-xl font-bold text-neutral-900 dark:text-white">
            Gym Tracker
          </span>
        </div>

        {/* Authentication form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4"
        >
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {mode === 'sign_in'
              ? 'Log in'
              : 'Create account'}
          </h1>

          {/* Email */}
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
          />

          {/* Password */}
          <input
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === 'sign_in'
                ? 'current-password'
                : 'new-password'
            }
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
          />

          {/* Error message */}
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Success / information message */}
          {message && (
            <div className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 px-4 py-3">
              <p className="text-sm text-green-700 dark:text-green-400">
                {message}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Please wait...'
              : mode === 'sign_in'
                ? 'Log in'
                : 'Sign up'}
          </button>

          {/* Switch login / register */}
          <button
            type="button"
            disabled={loading}
            onClick={switchMode}
            className="w-full text-sm text-neutral-500 hover:text-orange-500 transition-colors disabled:opacity-60"
          >
            {mode === 'sign_in'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
