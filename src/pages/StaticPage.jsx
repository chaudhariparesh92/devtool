import SeoHead from '../components/SeoHead';

export default function StaticPage({ path }) {
  const contentMap = {
    '/about': {
      title: 'About Us',
      desc: 'Learn more about Online Developer Tool Pro, your trusted source for secure, fast, and browser-based developer utilities.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-lg">
            Welcome to <strong>Online Developer Tool Pro</strong>, a comprehensive suite of high-performance developer utilities designed to streamline your everyday coding workflows.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-2">Our Mission</h2>
          <p>
            In modern software development, speed, efficiency, and data security are paramount. Our mission is to provide developers, engineers, and system administrators with a fast, reliable, and distraction-free toolbox to handle data formatting, code conversion, cryptographic hashing, and encoding tasks instantly—without the friction of server-side roundtrips.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-2">Privacy-First Architecture</h2>
          <p>
            Unlike traditional web-based developer tools that transmit your sensitive payloads, API tokens, logs, or source code to remote servers, <strong>Online Developer Tool Pro processes everything locally within your browser</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Zero Server Uploads:</strong> Your inputs never leave your local machine.</li>
            <li><strong>No Database Storage:</strong> We do not store, log, or cache any user-entered data.</li>
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
      desc: 'Read the Online Developer Tool Pro Privacy Policy. Discover how our client-side architecture ensures absolute data security.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-500">Last Updated: January 2026</p>
          <p>
            At <strong>Online Developer Tool Pro</strong>, the privacy of our visitors is of extreme importance. This Privacy Policy document outlines the types of information that is received and collected and how it is used.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">1. Client-Side Processing</h3>
          <p>
            The core architecture of Online Developer Tool Pro relies entirely on client-side execution (JavaScript running locally in your browser). Data you paste into our tools is processed locally and is <strong>never</strong> sent to our servers.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">2. Google AdSense & Third-Party Cookies</h3>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on Online Developer Tool Pro. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites across the Internet. You may opt out of personalized advertising by visiting Google Ads Settings.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">3. Compliance Frameworks</h3>
          <p>
            We are dedicated to fulfilling global data protection compliance mandates. Because our utilities execute client-side and we do not profile users or harvest personal data through our tools, our operational footprint minimizes privacy risks by design.
          </p>
        </div>
      )
    },
    '/terms': {
      title: 'Terms of Service',
      desc: 'Review the terms and conditions for using Online Developer Tool Pro online utilities.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="text-sm text-gray-500">Last Updated: January 2026</p>
          <p>
            Please read these Terms of Service carefully before using Online Developer Tool Pro. By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">1. Disclaimer of Warranties</h3>
          <p>
            The tools and services provided on Online Developer Tool Pro are offered on an <strong>&quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind</strong>. You are solely responsible for validating critical code, data structures, and outputs generated by our tools before utilizing them in production environments.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">2. Limitation of Liability</h3>
          <p>
            In no event shall Online Developer Tool Pro be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of (or inability to access or use) the service.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">3. Compliance with Laws</h3>
          <p>
            Users agree to use Online Developer Tool Pro strictly for lawful purposes and in compliance with all applicable local, national, and international laws and regulations.
          </p>
        </div>
      )
    },
    '/contact': {
      title: 'Contact Us',
      desc: 'Get in touch with the Online Developer Tool Pro team for feedback, inquiries, or support.',
      body: (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Have a question, feedback, or suggestion for a new developer tool? We would love to hear from you!
          </p>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Direct Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You can reach our team directly via email at: <a href="mailto:contact@onlinedevelopertool.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">contact@onlinedevelopertool.com</a>
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
    desc: 'Information page for Online Developer Tool Pro',
    body: <p>Content not found.</p>
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <SeoHead title={current.title} description={current.desc} url={path} />
      
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-4">
        {current.title}
      </h1>
      
      <div className="prose dark:prose-invert">
        {current.body}
      </div>
    </div>
  );
}