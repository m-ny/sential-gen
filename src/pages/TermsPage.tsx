import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GlassPanel from '../components/ui/GlassPanel';

const TermsPage = () => {
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
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
            
            <GlassPanel className="p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-white/70">
                  By accessing and using Sential's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. License and Usage Rights</h2>
                <p className="text-white/70">
                  When you generate a logo through our service, you receive a perpetual, worldwide, non-exclusive, transferable license to use the generated logo for any commercial or non-commercial purpose.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                <p className="text-white/70">
                  You agree not to use our service for any unlawful purposes or to generate content that infringes on others' intellectual property rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Payment and Refunds</h2>
                <p className="text-white/70">
                  All purchases are final. However, we offer a 7-day refund period for technical issues or if you're unsatisfied with the generated results.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                <p className="text-white/70">
                  Each generated logo is unique and created for your exclusive use. While we retain rights to the generation technology, you own the rights to use your generated logos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Service Availability</h2>
                <p className="text-white/70">
                  We strive to maintain high availability but do not guarantee uninterrupted access to our services. We reserve the right to modify or discontinue services with reasonable notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-white/70">
                  Our liability is limited to the amount you paid for our services. We are not liable for any indirect, consequential, or incidental damages.
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

export default TermsPage;