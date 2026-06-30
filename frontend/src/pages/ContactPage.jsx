import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import { newsletterApi } from '../api';

const ContactPage = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    // Simulated contact submission; could be wired to a real backend endpoint.
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with the HM Blogs team." />
      <section className="container-px mx-auto max-w-6xl py-16">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Get in Touch</h1>
        <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400">
          Have a question, feedback, or want to write for us? Send a message.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="card flex items-center gap-3 p-4">
              <FiMail className="h-5 w-5 text-primary" />
              <span className="text-sm">harismunir4988@gmail.com</span>
            </div>
            <div className="card flex items-center gap-3 p-4">
              <FiPhone className="h-5 w-5 text-primary" />
              <span className="text-sm">+92 325 6237991</span>
            </div>
            <div className="card flex items-center gap-3 p-4">
              <FiMapPin className="h-5 w-5 text-primary" />
              <span className="text-sm">Lahore, Pakistan</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <input {...register('name', { required: true })} placeholder="Your Name" className="input-field" />
                {errors.name && <p className="mt-1 text-xs text-danger">Name is required</p>}
              </div>
              <div>
                <input {...register('email', { required: true })} type="email" placeholder="Your Email" className="input-field" />
                {errors.email && <p className="mt-1 text-xs text-danger">Valid email is required</p>}
              </div>
            </div>
            <input {...register('subject', { required: true })} placeholder="Subject" className="input-field" />
            <textarea {...register('message', { required: true })} rows={5} placeholder="Your message..." className="input-field" />
            <button disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
