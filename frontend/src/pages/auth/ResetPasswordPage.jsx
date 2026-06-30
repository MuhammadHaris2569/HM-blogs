import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { authApi } from '../../api/authApi';
import SEO from '../../components/common/SEO';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authApi.resetPassword(token, data.password);
      toast.success('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed, the link may have expired');
    }
  };

  return (
    <>
      <SEO title="Reset Password" />
      <AuthLayout title="Reset your password" subtitle="Enter a new password for your account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                type="password"
                placeholder="New password"
                className="input-field !pl-10"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>
          <div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register('confirmPassword', { validate: (v) => v === watch('password') || 'Passwords do not match' })}
                type="password"
                placeholder="Confirm new password"
                className="input-field !pl-10"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>}
          </div>
          <button disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-primary hover:underline">Back to Login</Link>
        </p>
      </AuthLayout>
    </>
  );
};

export default ResetPasswordPage;
