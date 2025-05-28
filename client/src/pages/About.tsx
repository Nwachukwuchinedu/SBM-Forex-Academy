import { useEffect } from 'react';
import { Users, Award, Lightbulb, TrendingUp, LineChart, Shield } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Us - SBM Forex Academy';
  }, []);

  const values = [
    {
      icon: <Users className="h-8 w-8 text-gold" />,
      title: 'Community First',
      description: 'We prioritize building a supportive community of traders who help each other succeed.'
    },
    {
      icon: <Award className="h-8 w-8 text-emerald" />,
      title: 'Excellence',
      description: 'We are committed to providing the highest quality education and trading signals.'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-gold" />,
      title: 'Innovation',
      description: 'We continuously refine our strategies to stay ahead in the ever-changing forex market.'
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald" />,
      title: 'Integrity',
      description: 'We operate with full transparency and always put our clients\' interests first.'
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-hero-pattern bg-cover bg-center py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection className="max-w-3xl">
            <span className="inline-block5bg-gold/20 text-gold px-4 py-1 rounded-full text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="heading-xl mb-6 text-gray-900">
              Our Mission is to <span className="gradient-text">Empower Traders</span>
            </h1>
            <p className="text-gray-400 text-lg">
              SBM Forex Academy was founded with a clear vision: to provide traders 
              with the education, tools, and support they need to succeed in the challenging 
              world of forex trading.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-dark relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="heading-lg mb-6 text-gray-900">
                From Struggling Traders to <span className="gradient-text">Mentors</span>
              </h2>
              <p className="text-gray-400 mb-6">
                Founded in 2018, SBM Forex Academy began when a group of successful traders 
                recognized the need for quality forex education and accurate signals in an 
                industry filled with false promises.
              </p>
              <p className="text-gray-400 mb-6">
                After years of personal struggles and eventual success in the forex market, 
                our founders decided to share their knowledge and proven strategies with traders 
                worldwide.
              </p>
              <p className="text-gray-400">
                Today, SBM Forex Academy has grown into a global community of over 5,000 traders, 
                all benefiting from our comprehensive education, accurate signals, and professional 
                account management services.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative">
                {/* <div className="card-glass p-8 relative z-10">
                  <h3 className="text-xl font-bold text-gold mb-6">SBM Forex Academy Timeline</h3>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-10 w-10 rounded-full bg-gold/50 flex items-center justify-center">
                          <span className="font-bold">2018</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Academy Founded</h4>
                        <p className="text-gray-400 text-sm">Started with 3 traders and a vision</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-10 w-10 rounded-full bg-emerald/50 flex items-center justify-center">
                          <span className="font-bold">2019</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Signal Service Launch</h4>
                        <p className="text-gray-400 text-sm">Expanded services to include daily signals</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-10 w-10 rounded-full5bg-gold/50 flex items-center justify-center">
                          <span className="font-bold">2021</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">100,000 Members</h4>
                        <p className="text-gray-400 text-sm">Reached 100k community milestone</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-10 w-10 rounded-full bg-emerald/50 flex items-center justify-center">
                          <span className="font-bold">2023</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Account Management</h4>
                        <p className="text-gray-400 text-sm">Launched professional account management service</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-10 w-10 rounded-full5bg-gold/50 flex items-center justify-center">
                          <span className="font-bold">2025</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Global Expansion</h4>
                        <p className="text-gray-400 text-sm">Expanding to serve traders in over 150 countries</p>
                      </div>
                    </div>
                  </div>
                </div> */}
                
                {/* Background glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-emerald/20 rounded-xl blur-3xl opacity-30 -z-10"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-dark-darker relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-darker/0 via-gold/5 to-dark-darker/0"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-emerald/10 text-emerald px-4 py-1 rounded-full text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="heading-lg mb-6 text-gray-900">
              The Principles That <span className="emerald-gradient-text">Guide Us</span>
            </h2>
            <p className="text-gray-400">
              At SBM Forex Academy, our core values shape everything we do, from how we create content 
              to how we interact with our community.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={index} delay={index * 0.1} className="card-neumorphic p-6">
                <div className="mb-5">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="heading-lg mb-6 text-gray-900">
              Meet The <span className="gradient-text">Experts</span>
            </h2>
            <p className="text-gray-400">
              Our team consists of experienced traders who have mastered the forex market 
              and are passionate about sharing their knowledge.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="card-glass p-6 text-center">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="John Davis"
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">John Davis</h3>
                <p className="text-emerald font-medium mb-4">Founder & Head Trader</p>
                <p className="text-gray-400 mb-6">
                  With over 15 years of trading experience, John has developed the proprietary 
                  strategies that form the foundation of our training programs.
                </p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-gold hover:text-amber-400 transition-colors">
                    <LineChart className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gold hover:text-amber-400 transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card-glass p-6 text-center">
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Sarah Johnson"
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">Sarah Johnson</h3>
                <p className="text-emerald font-medium mb-4">Head of Education</p>
                <p className="text-gray-400 mb-6">
                  Sarah specializes in breaking down complex trading concepts into easy-to-understand 
                  lessons that traders at all levels can apply immediately.
                </p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-gold hover:text-amber-400 transition-colors">
                    <LineChart className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gold hover:text-amber-400 transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="card-glass p-6 text-center">
                <img
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Michael Chang"
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">Michael Chang</h3>
                <p className="text-emerald font-medium mb-4">Lead Signal Provider</p>
                <p className="text-gray-400 mb-6">
                  Michael\'s analytical approach to the market and ability to identify high-probability 
                  setups has made our signal service one of the most accurate in the industry.
                </p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-gold hover:text-amber-400 transition-colors">
                    <LineChart className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gold hover:text-amber-400 transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-dark-darker to-dark-darker relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-emerald/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        <div className="container-custom relative z-10">
          <div className="card-glass border border-gray-700/30 p-8 md:p-12 text-center max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="heading-lg mb-6 text-gray-900">
                Join Our <span className="gradient-text">Growing Community</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Become part of the SBM Forex Academy family and take your trading to the next level 
                with our comprehensive education and support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/register" className="btn btn-primary">
                  Join Now
                </a>
                <a href="/services" className="btn btn-outline">
                  Explore Services
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;