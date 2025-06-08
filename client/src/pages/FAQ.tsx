import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp } from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { FAQPage as FAQPageSchema } from '../types/schema';

const FAQPage = () => {
  useEffect(() => {
    document.title = "Frequently Asked Questions - SBM Forex Academy";
  }, []);

  const faqs = [
    {
      category: "General Questions",
      questions: [
        {
          question: "What is SBM Forex Academy?",
          answer:
            "SBM Forex Academy is a premier forex education and trading service provider. We offer comprehensive mentorship programs, accurate trading signals, and professional account management services to help traders succeed in the forex market.",
        },
        {
          question: "Who can benefit from your services?",
          answer:
            "Our services are designed for traders of all levels, from complete beginners to advanced traders. Whether you're looking to learn forex trading from scratch, improve your existing skills, or have your account professionally managed, we have solutions tailored to your needs.",
        },
        {
          question: "How do I get started with SBM Forex Academy?",
          answer:
            "Getting started is easy! Simply register for an account on our website, choose the service that best fits your needs, complete the payment process, and you'll gain immediate access to your chosen service.",
        },
        {
          question: "Do you offer customer support?",
          answer:
            "Yes, we provide 24/7 customer support via email at support@sbmforexacademy.com. Members of our paid services also get access to private Telegram groups where they can receive direct assistance from our team of experts.",
        },
      ],
    },
    {
      category: "Mentorship Program",
      questions: [
        {
          question: "What's included in the mentorship program?",
          answer:
            "Our mentorship program includes comprehensive video courses, live trading sessions, a step-by-step trading guide, trading psychology training, risk management strategies, and ongoing support from experienced mentors. You'll learn everything you need to become a successful forex trader.",
        },
        {
          question: "Is the mentorship program suitable for beginners?",
          answer:
            "Absolutely! Our mentorship program is designed with a structured curriculum that starts with the fundamentals of forex trading and progressively advances to more complex strategies. Complete beginners can follow along and build their skills step by step.",
        },
        {
          question: "How long does it take to complete the mentorship program?",
          answer:
            "The core material can be completed in 4-6 weeks, but we recommend dedicating 2-3 months to fully absorb the content and practice the strategies. You'll have lifetime access to the material, so you can learn at your own pace and revisit concepts as needed.",
        },
        {
          question: "Do you offer one-on-one coaching?",
          answer:
            "Yes, our VIP mentorship package includes one-on-one coaching sessions with our expert traders. This personalized guidance allows us to address your specific challenges and accelerate your learning curve.",
        },
      ],
    },
    {
      category: "Signal Service",
      questions: [
        {
          question: "How accurate are your signals?",
          answer:
            "Our signals have maintained an average accuracy rate of 92.5% over the past three years. While past performance doesn't guarantee future results, we rigorously analyze each potential signal before sending it to ensure the highest probability of success.",
        },
        {
          question: "How many signals do you send per week?",
          answer:
            "On average, we send 5-10 signals per week. The exact number varies based on market conditions, as we prioritize quality over quantity. We only send signals when we identify high-probability trading opportunities.",
        },
        {
          question: "What information is included in each signal?",
          answer:
            "Each signal includes the currency pair, entry price (or price range), stop-loss level, multiple take-profit levels, risk-to-reward ratio, and a brief analysis explaining the rationale behind the trade. We provide everything you need to execute the trade confidently.",
        },
        {
          question: "How are signals delivered?",
          answer:
            "Signals are delivered through our mobile app, private Telegram groups, and email notifications. You can choose your preferred delivery method or use all three to ensure you never miss a trading opportunity.",
        },
      ],
    },
    {
      category: "Account Management",
      questions: [
        {
          question: "What is the minimum investment for account management?",
          answer:
            "The minimum investment for our account management service is $900. This ensures we have sufficient capital to implement our trading strategies effectively while managing risk appropriately.",
        },
        {
          question: "Which markets do you trade in the managed accounts?",
          answer:
            "We primarily focus on synthetic indices for our managed accounts, as they offer consistent volatility and trading opportunities regardless of global market conditions. This allows us to generate more consistent returns for our clients.",
        },
        {
          question: "How is the profit sharing calculated?",
          answer:
            "Profit sharing is calculated on a monthly basis. Depending on your chosen risk profile (Conservative, Balanced, or Aggressive), our fee ranges from 30% to 40% of the net profits generated. If there are no profits in a given month, no management fee is charged.",
        },
        {
          question: "Can I withdraw my funds at any time?",
          answer:
            "Yes, you maintain full control of your account and can withdraw your funds at any time. We recommend a minimum commitment of 3 months to allow our strategies to demonstrate their effectiveness, but there are no lock-in periods or withdrawal penalties.",
        },
      ],
    },
    {
      category: "Payments and Refunds",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept credit/debit cards, PayPal, bank transfers, and various cryptocurrencies including Bitcoin, Ethereum, and USDT. Our flexible payment options make it easy for traders worldwide to access our services.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "We offer a 7-day money-back guarantee for our Mentorship programs if you're not satisfied with the content. Signal subscriptions and Account Management services can be canceled at any time but are non-refundable for the current billing period.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No, we believe in complete transparency. The prices listed for our services are all-inclusive, with no hidden fees or charges. For account management, our only fee is the agreed-upon profit-sharing percentage.",
        },
        {
          question: "Do you offer any discounts or promotions?",
          answer:
            "We occasionally offer special promotions, particularly for new members or during holiday seasons. Subscribe to our newsletter to stay informed about these opportunities. We also offer discounts for annual signal subscriptions compared to monthly payments.",
        },
      ],
    },
  ];

  // Create FAQ schema from the data
  const faqSchema: FAQPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap(category => 
      category.questions.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    )
  };

  const [activeCategory, setActiveCategory] = useState(faqs[0].category);
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  return (
    <div>
      <Helmet>
        <title>Frequently Asked Questions - SBM Forex Academy</title>
        <meta name="description" content="Find answers to common questions about SBM Forex Academy's forex education, trading signals, account management, and mentorship programs." />
      </Helmet>

      <SchemaMarkup schema={faqSchema} />

      {/* Hero Section */}
      <section className="bg-hero-pattern bg-cover bg-center py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection className="max-w-3xl">
            <span className="inline-block bg-gold/20 text-gold px-4 py-1 rounded-full text-sm font-medium mb-6">
              Frequently Asked Questions
            </span>
            <h1 className="heading-xl mb-6 text-gray-900">
              Find <span className="gradient-text">Answers</span> To Your
              Questions
            </h1>
            <p className="text-gray-400 text-lg">
              Browse our comprehensive FAQ section to find answers to the most
              common questions about our services, processes, and forex trading
              in general.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection>
                <div className="card-glass sticky top-24 p-6">
                  <h3 className="font-bold text-xl mb-6 text-gray-900">
                    Categories
                  </h3>
                  <nav className="space-y-2">
                    {faqs.map((category) => (
                      <button
                        key={category.category}
                        onClick={() => setActiveCategory(category.category)}
                        className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeCategory === category.category
                            ? "bg-gold text-white font-medium"
                            : "bg-gray-900 hover:bg-gray-800 text-gray-200"
                        }`}
                      >
                        {category.category}
                      </button>
                    ))}
                  </nav>
                </div>
              </AnimatedSection>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="card-glass p-6 md:p-8">
                  {faqs.map(
                    (category) =>
                      category.category === activeCategory && (
                        <div key={category.category}>
                          <h2 className="heading-lg mb-8">
                            {category.category}
                          </h2>
                          <div className="space-y-6">
                            {category.questions.map((faq, index) => (
                              <div
                                key={index}
                                className="border-b border-gray-700 pb-6 last:border-b-0"
                              >
                                <button
                                  onClick={() => toggleQuestion(faq.question)}
                                  className="flex justify-between items-center w-full text-left"
                                >
                                  <h3 className="text-xl font-semibold text-gray-700">
                                    {faq.question}
                                  </h3>
                                  {openQuestions[faq.question] ? (
                                    <ChevronUp className="h-5 w-5 text-gold" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gold" />
                                  )}
                                </button>
                                <AnimatePresence>
                                  {openQuestions[faq.question] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <p className="text-gray-400 mt-4">
                                        {faq.answer}
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-dark-darker relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-darker/0 via-gold/5 to-dark-darker/0"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-lg mb-6 text-gray-900">
              Still Have <span className="gradient-text">Questions?</span>
            </h2>
            <p className="text-gray-400">
              If you couldn't find the answer to your question, feel free to
              contact our support team. We're here to help!
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="card-glass p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Contact Information
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Our support team is available 24/7 to assist you with any
                    questions or concerns.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-700 mb-1">Email</div>
                      <a
                        href="mailto:support@sbmforexacademy.com"
                        className="text-gold hover:underline"
                      >
                        support@sbmforexacademy.com
                      </a>
                    </div>
                    <div>
                      <div className="text-sm text-gray-700 mb-1">Phone</div>
                      <div className="text-gray-400">+234 706 423 7847</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-700 mb-1">Hours</div>
                      <div className="text-gray-400">24/7 Support</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <Link
                      to="/about"
                      className="block text-gold hover:underline"
                    >
                      About SBM Forex Academy
                    </Link>
                    <Link
                      to="/services"
                      className="block text-gold hover:underline"
                    >
                      Our Services
                    </Link>
                    <Link
                      to="/register"
                      className="block text-gold hover:underline"
                    >
                      Create an Account
                    </Link>
                    <Link
                      to="/login"
                      className="block text-gold hover:underline"
                    >
                      Member Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
