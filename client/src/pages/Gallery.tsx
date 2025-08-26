import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/ui/AnimatedSection';

// Import all images
import trade1 from '../assets/images/trade1.jpg';
import trade2 from '../assets/images/trade2.jpg';
import trade3 from '../assets/images/trade3.jpg';
import trade4 from '../assets/images/trade4.jpg';
import sbmProfile1 from '../assets/images/sbm-profile1.jpg';
import sbmProfile2 from '../assets/images/sbm-profile2.jpg';
import sbm1 from '../assets/images/sbm1.jpg';
import sbm from '../assets/images/sbm.jpg';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const images = [
        { src: trade1, alt: 'Trading Analysis 1', title: 'Trading Analysis' },
        { src: trade2, alt: 'Trading Analysis 2', title: 'Market Analysis' },
        { src: trade3, alt: 'Trading Analysis 3', title: 'Forex Trading' },
        { src: trade4, alt: 'Trading Analysis 4', title: 'Trading Strategy' },
        { src: sbmProfile1, alt: 'SBM Profile 1', title: 'SBM Forex Academy' },
        { src: sbmProfile2, alt: 'SBM Profile 2', title: 'Professional Training' },
        { src: sbm1, alt: 'SBM Academy', title: 'Academy Overview' },
        { src: sbm, alt: 'SBM Logo', title: 'SBM Brand' }
    ];

    const nextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (selectedImage !== null) {
            setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
        }
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <Helmet>
                <title>Gallery - SBM Forex Academy</title>
                <meta name="description" content="Explore our gallery of trading analysis, academy photos, and professional training materials at SBM Forex Academy." />
                <meta name="keywords" content="forex gallery, trading analysis, SBM academy photos, forex training images" />
            </Helmet>

            <div className="min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <section className="bg-hero-pattern bg-cover bg-center py-20 md:py-32 relative">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
                    <div className="container-custom relative z-10">
                        <AnimatedSection className="max-w-3xl mx-auto text-center">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-block bg-gold/20 text-gold px-4 py-1 rounded-full text-sm font-medium mb-6"
                            >
                                Gallery
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="heading-xl mb-6 text-gray-900"
                            >
                                Explore Our <span className="gradient-text">Visual Journey</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-gray-400 text-lg"
                            >
                                Discover our collection of trading analysis, academy photos, and professional training materials that showcase our commitment to excellence.
                            </motion.p>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Gallery Grid */}
                <div className="container-custom py-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-100"
                            >
                                <div
                                    className="relative aspect-square overflow-hidden"
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                            <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                                            <p className="text-sm">Click to view</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                            onClick={closeLightbox}
                        >
                            <div className="relative max-w-4xl max-h-full">
                                <button
                                    onClick={closeLightbox}
                                    className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
                                >
                                    <X size={32} />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
                                >
                                    <ChevronLeft size={40} />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold transition-colors z-10"
                                >
                                    <ChevronRight size={40} />
                                </button>

                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    src={images[selectedImage].src}
                                    alt={images[selectedImage].alt}
                                    className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                                    <h3 className="text-xl font-semibold mb-2">{images[selectedImage].title}</h3>
                                    <p className="text-sm opacity-80">
                                        {selectedImage + 1} of {images.length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Gallery;
