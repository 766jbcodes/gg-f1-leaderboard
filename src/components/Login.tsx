import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signInWithOtp, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/';

  // If already signed in, redirect
  React.useEffect(() => {
    if (!isLoading && user) {
      navigate(returnTo, { replace: true });
    }
  }, [isLoading, user, navigate, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signInWithOtp(email.trim());
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-4">
        <p className="text-foreground font-bold">Loading…</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Card className="max-w-md mx-auto mt-8 shadow-apple border-border">
      <CardHeader>
        <CardTitle className="text-2xl uppercase tracking-wide">Log in</CardTitle>
        <CardDescription>
        Enter your email and we’ll send you a magic link. No password needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
        <div className="text-foreground">
          <p className="font-bold mb-2">Check your email</p>
          <p className="text-sm">
            We’ve sent a login link to <strong>{email}</strong>. Click it to sign in.
          </p>
          <Button
            type="button"
            variant="link"
            className="mt-4 text-sm font-bold p-0 h-auto"
            onClick={() => setSent(false)}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-bold text-foreground mb-1">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive font-bold" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting} className="w-full uppercase tracking-wide">
            {submitting ? 'Sending…' : 'Send magic link'}
          </Button>
        </form>
        )}
      </CardContent>
    </Card>
  );
}
