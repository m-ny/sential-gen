import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GlassPanel from '../components/ui/GlassPanel';

const PrivacyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        onSignOut={() => setIsLoggedIn(false)} 
        onSignIn={() => setIsLoggedIn(true)} 
      />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <GlassPanel className="p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <p className="text-white/70">
                  We collect information you provide directly to us, including your email address, payment information, and any data you input for logo generation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <p className="text-white/70">
                  We use your information to provide and improve our services, process payments, send important notifications, and maintain your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Data Storage</h2>
                <p className="text-white/70">
                  Your data is securely stored using industry-standard encryption. Generated logos and account information are stored on secure servers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Data Sharing</h2>
                <p className="text-white/70">
                  We do not sell your personal information. We only share your data with service providers necessary for our operations, such as payment processing.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
                <p className="text-white/70">
                  You have the right to access, correct, or delete your personal information. You can also request a copy of your data or opt out of marketing communications.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
                <p className="text-white/70">
                  We use cookies to improve your experience and analyze usage patterns. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Updates to Privacy Policy</h2>
                <p className="text-white/70">
                  We may update this privacy policy from time to time. We will notify you of any significant changes via email or through our platform.
                </p>
              </section>
            </GlassPanel>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;