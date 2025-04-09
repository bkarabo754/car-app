'use client';

import { CircleCheckIcon, CircleX, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useFormStatus } from 'react-dom';
import { signInAction } from '@/app/_actions/sign-in';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className="w-full uppercase font-semibold text-white bg-blue-500 hover:bg-blue-700 transition-colors duration-300 py-3 rounded-md shadow-md"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        'Sign In'
      )}
    </Button>
  );
};

export const SignInForm = () => {
  const [state, formAction] = useActionState(signInAction, {
    success: false,
    message: '',
  });

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      router.refresh();
      // router.push(routes.challenge);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 transition-all duration-300 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
            Admin Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Authorized personnel only
          </p>
        </div>

        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="e.g. admin@company.com"
              className="border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 italic">
              This panel is restricted to system administrators only.
            </p>
          </div>

          <SubmitButton />

          {state.success && (
            <div className="flex items-center gap-2 rounded-md bg-green-600 p-3 text-white text-sm font-medium shadow">
              <CircleCheckIcon className="h-5 w-5" />
              <span>Success! {state.message}</span>
            </div>
          )}

          {!state.success && state.message && (
            <div className="flex items-center gap-2 rounded-md bg-red-600 p-3 text-white text-sm font-medium shadow">
              <CircleX className="h-5 w-5" />
              <span>Error! {state.message}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
