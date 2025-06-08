import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Award, Lightbulb, TrendingUp, LineChart, Shield } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { ORGANIZATION_DATA } from '../data/schemaData';
import sbm from '../assets/images/sbm.jpg';
import sbm1 from '../assets/images/sbm1.jpg';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Us - SBM Forex Academy';
  }, []);

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About SBM Forex Academy",
    description: "Learn about SBM Forex Academy's mission, history, and values. Founded in 2018, we've grown into a global community of over 5,000 traders.",
    mainEntity: ORGANIZATION_DATA,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://sbmforexacademy.com/"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: "https://sbmforexacademy.com/about"
        }
      ]
    }
  };

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
      <Helmet>
        <title>About Us - SBM Forex Academy</title>
        <meta name="description" content="Learn about SBM Forex Academy's mission to empower traders worldwide. Founded in 2018, we've built a global community of 5,000+ successful traders." />
      </Helmet>

      <SchemaMarkup schema={aboutPageSchema} />

      {/* Hero Section */}
      <section className="bg-hero-pattern bg-cover bg-center py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection className="max-w-3xl">
            <span className="inline-block bg-gold/20 text-gold px-4 py-1 rounded-full text-sm font-medium mb-6">
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

      {/* Meet the Owner */}
      <section className="py-12">
        <div className="container-custom flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex flex-col md:flex-row gap-6 items-center">
            <img
              src={sbm}
              alt="Owner 1"
              className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-gold"
            />
            <img
              src={sbm1}
              alt="Owner 2"
              className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-emerald"
            />
          </div>
          <div className="flex-1">
            <h2 className="heading-lg mb-2 text-gold">Meet the Owner</h2>
            <p className="text-gray-400">
              Our founders are passionate traders and educators dedicated to empowering others in the forex market. Their vision and expertise drive SBM Forex Academy's mission and success.
            </p>
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