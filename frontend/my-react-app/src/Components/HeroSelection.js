import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Women from '../Assets/Womens.jpg';
import Mens from '../Assets/Mens.jpg';
import Baby from '../Assets/Baby.jpg';
import Kids from '../Assets/Kids.jpg';

function HeroSection() {
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  // Background images from internet - optimized for hero backgrounds
  const backgroundImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=80', // Women's fashion
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&h=1080&fit=crop&q=80', // Men's fashion
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1920&h=1080&fit=crop&q=80', // Kids fashion
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1920&h=1080&fit=crop&q=80'  // Baby fashion
  ];

  // Auto-transition background images every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const categories = [
    {
      name: "Women",
      image: Women,
      link: "/women"
    },
    {
      name: "Men",
      image: Mens,
      link: "/men"
    },
    {
      name: "Kids",
      image: Kids,
      link: "/kids"
    },
    {
      name: "Baby",
      image: Baby,
      link: "/baby"
    }
  ];

  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* Background Images - Transitioning */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentBackgroundIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundImage: `url(${image})`,
              filter: 'blur(2px)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[500px]">
          {/* Left Side - Text Overlay */}
          <div className="text-left z-10">
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-4  tracking-tight">
              WearHaus
            </h1>
            <p className="text-2xl md:text-3xl text-white font-light">
              Simplicity Woven in Every Thread.
            </p>
          </div>

          {/* Right Side - Category Cards Grid */}
          <div className="grid grid-cols-2 gap-4 z-10">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="text-white text-xl font-semibold">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;