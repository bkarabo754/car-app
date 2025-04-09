'use server';
import { routes } from '@/config/routes';
import { SignInSchema } from '../schemas/auth.schema';
import { signIn } from '../../../auth';
import { genericRateLimit } from '@/lib/rate-limiter';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { PrevState } from '@/config/types';

export const signInAction = async (_: PrevState, formData: FormData) => {
  try {
    const limiterError = await genericRateLimit('login');
    if (limiterError) return limiterError;

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, success, error } = SignInSchema.safeParse({
      email,
      password,
    });

    if (!success) {
      console.log({ error });
      return { success: false, message: 'Invalid Credentials' };
    }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: true,
      redirectTo: routes.challenge,
    });

    return {
      success: true,
      message: 'Signed in successfully!',
    };
  } catch (error) {
    console.log({ error });
    if (isRedirectError(error)) throw error;
    return { success: false, message: 'Invalid Credentials' };
  }
};
