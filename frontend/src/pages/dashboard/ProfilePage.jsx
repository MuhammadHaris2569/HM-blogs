import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { FiUploadCloud, FiSave, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { userApi } from '../../api';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || '');

  const profileForm = useForm({
    defaultValues: {
      name: user?.name,
      bio: user?.bio,
      twitter: user?.socialLinks?.twitter,
      github: user?.socialLinks?.github,
      linkedin: user?.socialLinks?.linkedin,
      website: user?.socialLinks?.website,
    },
  });

  const passwordForm = useForm();

  const profileMutation = useMutation({
    mutationFn: (formData) => userApi.updateProfile(formData),
    onSuccess: (res) => {
      updateUser(res.data.data.user);
      toast.success('Profile updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => userApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed. Please log in again.');
      passwordForm.reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  const onProfileSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio || '');
    formData.append('socialLinks', JSON.stringify({ twitter: data.twitter, github: data.github, linkedin: data.linkedin, website: data.website }));
    if (avatarFile) formData.append('avatar', avatarFile);
    profileMutation.mutate(formData);
  };

  const onPasswordSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    passwordMutation.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <SEO title="Profile Settings" />
      <h1 className="text-2xl font-extrabold">Profile Settings</h1>

      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="mt-6 card space-y-5 p-6">
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <label className="btn-secondary cursor-pointer !px-4 !py-2 text-sm">
            <FiUploadCloud /> Change Avatar
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="text-sm font-medium">Name</label>
          <input {...profileForm.register('name', { required: true })} className="input-field mt-1.5" />
        </div>
        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea {...profileForm.register('bio')} rows={3} className="input-field mt-1.5" maxLength={300} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input {...profileForm.register('twitter')} placeholder="Twitter URL" className="input-field" />
          <input {...profileForm.register('github')} placeholder="GitHub URL" className="input-field" />
          <input {...profileForm.register('linkedin')} placeholder="LinkedIn URL" className="input-field" />
          <input {...profileForm.register('website')} placeholder="Website URL" className="input-field" />
        </div>
        <button disabled={profileMutation.isPending} className="btn-primary !px-5 !py-2 text-sm"><FiSave /> Save Changes</button>
      </form>

      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="mt-6 card space-y-4 p-6">
        <h2 className="font-bold flex items-center gap-2"><FiLock /> Change Password</h2>
        <input {...passwordForm.register('currentPassword', { required: true })} type="password" placeholder="Current password" className="input-field" />
        <input {...passwordForm.register('newPassword', { required: true, minLength: 6 })} type="password" placeholder="New password" className="input-field" />
        <input {...passwordForm.register('confirmPassword', { required: true })} type="password" placeholder="Confirm new password" className="input-field" />
        <button disabled={passwordMutation.isPending} className="btn-secondary !px-5 !py-2 text-sm">Update Password</button>
      </form>
    </>
  );
};

export default ProfilePage;
