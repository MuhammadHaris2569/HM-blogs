import SEO from '../../components/common/SEO';

const PrivacyPolicyPage = () => (
  <>
    <SEO title="Privacy Policy" />
    <section className="container-px mx-auto max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: January 2026</p>

      <div className="prose-content mt-8 space-y-6">
        <p>
          HM Blogs ("we", "our", "us") respects your privacy. This policy explains what information
          we collect, how we use it, and the choices you have.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly, such as your name, email address, and profile
          details when you register. We also collect usage data such as pages visited and reading
          history to improve your experience.
        </p>
        <h2>How We Use Information</h2>
        <p>
          We use your data to operate the platform, personalize content recommendations, send
          newsletters you've subscribed to, and improve our services. We never sell your personal
          data to third parties.
        </p>
        <h2>Cookies</h2>
        <p>
          We use cookies to maintain your session and remember your preferences, including dark mode
          settings. You can disable cookies in your browser, though some features may not function
          properly.
        </p>
        <h2>Your Rights</h2>
        <p>
          You may access, update, or delete your account information at any time from your dashboard
          settings. Contact us if you need further assistance with your data.
        </p>
        <h2>Contact</h2>
        <p>Questions about this policy can be sent to privacy@hmblogs.com.</p>
      </div>
    </section>
  </>
);

export default PrivacyPolicyPage;
