import { Check, Phone, UserPlus, MessageCircle } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { Link } from 'react-router-dom';

const GetStartedSection = () => {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8 text-emerald" />,
      title: 'Create an Account',
      description: 'Register for free and complete your profile to get started with SBM Forex Academy.',
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-emerald" />,
      title: 'Choose Your Service',
      description: 'Select from our mentorship programs, signal packages, or account management services.',
    },
    {
      icon: <Check className="h-8 w-8 text-emerald" />,
      title: 'Start Trading Successfully',
      description: 'Follow our expert guidance and start seeing consistent results in your trading.',
    },
  ];

  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-medium mb-4">
              Getting Started Is Easy
            </span>
            <h2 className="heading-lg mb-6 text-gray-900">
              Your Journey To <span className="gradient-text">Trading Success</span>
            </h2>
            <p className="text-gray-900 mb-8">
              Begin your forex trading journey with SBM Forex Academy in three simple steps. 
              Our streamlined process gets you from signup to successful trading quickly.
            </p>
            
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-12 w-12 rounded-full bg-dark-lighter flex items-center justify-center card-neumorphic">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <Link to="/register" className="btn btn-primary">
                Start Your Journey Today
              </Link>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="card-glass p-8 border border-gray-700/50 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-emerald/30 rounded-xl blur-xl opacity-20 -z-10"></div>
              
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Need Help Getting Started?</h3>
              <p className="text-gray-900 mb-6">
                Our team is ready to assist you with choosing the right service package
                for your trading goals and experience level.
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-full bg-emerald/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-emerald" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Call us directly</div>
                  <div className="text-lg font-semibold text-gray-800">+234 706 423 7847</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-emerald">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-gray-400">Free consultation with a trading expert</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-emerald">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-gray-400">Personalized service recommendation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-emerald">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-gray-400">24/7 customer support for all members</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <a href="mailto:support@sbmforexacademy.com" className="btn btn-outline w-full">
                  Contact Support Team
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;