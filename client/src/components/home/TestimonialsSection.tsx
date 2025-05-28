import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Michael Roberts',
    position: 'Full-time Trader',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'SBM Forex Academy transformed my trading journey. The mentorship program provided me with clear strategies that have consistently yielded profits. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    position: 'Part-time Trader',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The signals service is phenomenal. Almost 95% of the trades I\'ve taken based on their signals have been profitable. The team is responsive and the alerts are timely.',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Chen',
    position: 'Investor',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'I\'ve tried several signal providers before, but SBM Forex Academy stands out with their accuracy and detailed analysis. The account management service exceeds expectations.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Jessica Williams',
    position: 'Finance Professional',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The educational content provided by SBM is exceptional. Their step-by-step approach helped me understand complex forex concepts that I struggled with for years.',
    rating: 4,
  },
];

const TestimonialsSection = () => {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="section-padding bg-dark-darker relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-darker/0 via-gold/5 to-dark-darker/0"></div>
      
      <div className="container-custom relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-emerald/10 text-emerald px-4 py-1 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="heading-lg mb-6 text-gray-900">
            What Our <span className="emerald-gradient-text">Traders Say</span>
          </h2>
          <p className="text-gray-900">
            Join thousands of satisfied traders who have transformed their trading results with SBM Forex Academy.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={slidesPerView}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="testimonials-carousel"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="card-glass p-6 h-full border border-gray-700/30 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-700 text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? 'text-gold fill-gold' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-400 flex-grow">{testimonial.content}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialsSection;