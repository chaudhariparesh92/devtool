import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { PAGE_SEO } from '../data/seo';

export default function StaticPage({ path }) {
  const contentMap = {
    '/about': {
      title: 'About Us',
      desc: 'Learn about OnlineDeveloperTool, a collection of free browser-based developer utilities and how the tools process your data.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-lg">
            Welcome to <strong>OnlineDeveloperTool</strong>, a comprehensive suite of high-performance developer utilities designed to streamline your everyday coding workflows.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-2">Our Mission</h2>
          <p>
            In modern software development, speed, efficiency, and data security are paramount. Our mission is to provide developers, engineers, and system administrators with a fast, reliable, and distraction-free toolbox to handle data formatting, code conversion, cryptographic hashing, and encoding tasks instantly—without the friction of server-side roundtrips.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-2">Privacy-First Architecture</h2>
          <p>
            <strong>Most formatting, conversion, encoding, and text utilities process the input in your browser</strong>, without uploading that input to an OnlineDeveloperTool application server. The Website Status Checker is different: it makes requests from your browser to the website address you enter.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Local processing:</strong> Inputs for browser-based formatting and conversion tools are handled on your device.</li>
            <li><strong>No account required:</strong> The site does not require an account to use its tools. Avoid entering secrets into any online service unless you understand the tool and browser environment.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-2">Regulatory & Operational Compliance</h2>
          <p>
            We operate with a commitment to high standards of digital integrity and regulatory alignment, adhering to data minimization principles outlined by modern privacy frameworks like GDPR.
          </p>
        </div>
      )
    },
    '/privacy': {
      title: 'Privacy Policy',
      desc: 'Read how OnlineDeveloperTool handles browser-processed inputs, website status checks, and advertising cookies.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-500">Last Updated: January 2026</p>
          <p>
            At <strong>OnlineDeveloperTool</strong>, the privacy of our visitors is of extreme importance. This Privacy Policy document outlines the types of information that is received and collected and how it is used.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">1. Client-Side Processing</h3>
          <p>
            Many tools run in JavaScript in your browser, so their inputs are processed locally rather than uploaded to an OnlineDeveloperTool application server. The Website Status Checker sends browser requests to the target URLs you enter; the target website may receive normal connection information such as your IP address. Browser extensions, hosting, analytics, advertising, and other third-party services may also process data according to their own policies.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">2. Google AdSense & Third-Party Cookies</h3>
          <p>
            Google AdSense may use cookies or similar technologies to deliver, measure, and personalize advertising, subject to your region and consent settings. You can review or change personalized-ad settings through Google Ads Settings. Third-party advertising practices are governed by the relevant provider policies.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">3. Compliance Frameworks</h3>
          <p>
            This page is general information, not a guarantee of security or legal compliance. The way data is processed can also depend on your browser, extensions, network, the target website you check, and third-party services such as advertising.
          </p>
        </div>
      )
    },
    '/terms': {
      title: 'Terms of Service',
      desc: 'Review the terms and conditions for using OnlineDeveloperTool online utilities.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-500">Last Updated: January 2026</p>
          <p>
            Please read these Terms of Service carefully before using OnlineDeveloperTool. By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">1. Disclaimer of Warranties</h3>
          <p>
            The tools and services provided on OnlineDeveloperTool are offered on an <strong>&quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind</strong>. You are solely responsible for validating critical code, data structures, and outputs generated by our tools before utilizing them in production environments.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">2. Limitation of Liability</h3>
          <p>
            In no event shall OnlineDeveloperTool be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of (or inability to access or use) the service.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">3. Compliance with Laws</h3>
          <p>
            Users agree to use OnlineDeveloperTool strictly for lawful purposes and in compliance with all applicable local, national, and international laws and regulations.
          </p>
        </div>
      )
    },
    '/contact': {
      title: 'Contact Us',
      desc: 'Get in touch with the OnlineDeveloperTool team for feedback, inquiries, or support.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Have a question, feedback, or suggestion for a new developer tool? We would love to hear from you!
          </p>
          <div className="p-6 card">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Direct Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You can reach our team directly via email at: <a href="mailto:contact@onlinedevelopertool.com" className="a-link">contact@onlinedevelopertool.com</a>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Please note that because our tools run entirely client-side without a backend database, we cannot recover or access any code or data you paste into the utilities.
          </p>
        </div>
      )
    }
  };

  const current = contentMap[path] || {
    title: 'Information',
    desc: 'Information page for OnlineDeveloperTool',
    body: <p>Content not found.</p>
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 card p-6 sm:p-8">
      <SeoHead title={PAGE_SEO[path] ? PAGE_SEO[path].title : current.title} description={PAGE_SEO[path] ? PAGE_SEO[path].description : current.desc} url={path} />
      
      <h1 className="h-display text-4xl sm:text-5xl border-b-[3px] border-dashed pb-4 break-words" style={{ borderColor: 'var(--border)' }}>
        {current.title}
      </h1>
      
      <div className="prose dark:prose-invert prose-fdt max-w-none">
        {current.body}
      </div>

      <nav aria-label="Keep exploring" className="pt-4 border-t-2 border-dashed flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ borderColor: 'var(--border)' }}>
        <Link to="/tools" className="a-link">Explore all developer tools</Link>
        <Link to="/categories" className="a-link">Browse categories</Link>
        <Link to="/json-formatter" className="a-link">JSON Formatter</Link>
        <Link to="/website-status-checker" className="a-link">Website Status Checker</Link>
      </nav>
    </div>
  );
}
