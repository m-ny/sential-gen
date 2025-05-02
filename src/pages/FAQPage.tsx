import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GlassPanel from '../components/ui/GlassPanel';

type FAQItem = {
  question: string;
  answer: string | React.ReactNode;
};

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const faqs: FAQItem[] = [
    {
      question: "How does the logo generation process work?",
      answer: "Our AI-powered system creates unique, minimalist logo marks based on your company name and description. You can choose from three distinct styles: Block, Sharp, or Rounded. Each generation uses one credit, and the process typically takes 30-60 seconds."
    },
    {
      question: "Can I see some example logos?",
      answer: (
        <div>
          Yes! We have a dedicated examples page where you can see some of our generated logos.{' '}
          <Link to="/examples" className="text-white hover:underline">
            View our example logos here
          </Link>
          .
        </div>
      )
    },
    {
      question: "What's included in the commercial license?",
      answer: "When you generate a logo, you receive a perpetual, worldwide commercial license. This means you can use the logo for any business purpose, even if you later cancel your subscription. The license includes rights for digital and print use, merchandise, and branding."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 7-day refund period for issues with generations. If our support team determines your situation warrants a refund, we'll process it promptly. In many cases, we may also offer additional credits as compensation."
    },
    {
      question: "What happens to unused credits?",
      answer: "For Creator plan subscribers, unused credits roll over to the next month, up to a maximum of 90 credits. Starter plan credits don't expire but are limited to your one-time purchase amount. Studio plan includes unlimited generations, so credit management isn't necessary."
    },
    {
      question: "Are there any discounts available?",
      answer: "Yes! We offer special discounts for students and non-profit organizations. Please contact our support team through your account dashboard for verification and discount details."
    },
    {
      question: "Can I modify the generated logos?",
      answer: "Yes, you receive high-resolution files that can be modified using any design software. The commercial license allows for modifications and derivative works."
    },
    {
      question: "What's included in the Creator Kit?",
      answer: "The Creator Kit (coming soon) will include additional tools like brand guidelines generation, social media assets, and business card templates based on your generated logo. Creator plan members will get access upon release, while Studio plan members receive priority access."
    },
    {
      question: "How do team seats work on the Studio plan?",
      answer: "The Studio plan includes 2 team seats by default. Each team member gets their own login but shares the unlimited generation quota. Team members can view and download all logos generated under the account."
    },
    {
      question: "What's the difference in generation speed between plans?",
      answer: "All paid plans (Starter, Creator, and Studio) enjoy 2× faster generation compared to free trials. This priority processing typically means your logos are ready in 30 seconds or less."
    },
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to the new features. When downgrading, you'll retain access to your current plan until the end of your billing period."
    }
  ];

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
            <h1 className="text-4xl font-bold text-white mb-4 text-center">
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 text-lg mb-12 text-center">
              Everything you need to know about our logo generation service
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <GlassPanel 
                  key={index}
                  className={`transition-all duration-200 ${
                    openIndex === index ? 'bg-white/[0.06]' : 'hover:bg-white/[0.05]'
                  }`}
                >
                  <button
                    className="w-full text-left px-6 py-4 flex items-center justify-between"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/60" />
                    )}
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-4 text-white/70">
                      {faq.answer}
                    </div>
                  )}
                </GlassPanel>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;