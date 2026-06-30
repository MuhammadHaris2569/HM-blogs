import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { authApi } from '../../api/authApi';
import SEO from '../../components/common/SEO';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <SEO title="Forgot Password" />
      <AuthLayout title="Forgot password?" subtitle="We'll send you a reset link">
        {sent ? (
          <div className="text-center">
            <p className="text-sm text-slate-500">If an account exists with that email, a reset link has been sent. Please check your inbox.</p>
            <Link to="/login" className="btn-primary mt-6 inline-flex">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email address" className="input-field !pl-10" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>
            <button disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;
