import SEO from '../../components/common/SEO';

const TermsPage = () => (
  <>
    <SEO title="Terms of Service" />
    <section className="container-px mx-auto max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: January 2026</p>

      <div className="prose-content mt-8 space-y-6">
        <p>
          By accessing or using HM Blogs, you agree to be bound by these Terms of Service. Please
          read them carefully before using the platform.
        </p>
        <h2>Use of the Platform</h2>
        <p>
          You must be at least 13 years old to create an account. You agree not to post content that
          is illegal, defamatory, infringing, or otherwise harmful to others.
        </p>
        <h2>Content Ownership</h2>
        <p>
          You retain ownership of content you publish on HM Blogs. By posting, you grant us a
          non-exclusive license to display and distribute your content on the platform.
        </p>
        <h2>Account Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms or engage
          in abusive behavior toward other users.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          HM Blogs is provided "as is" without warranties of any kind. We are not liable for any
          indirect or consequential damages arising from use of the platform.
        </p>
        <h2>Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of the platform constitutes acceptance of the revised terms.</p>
      </div>
    </section>
  </>
);

export default TermsPage;
