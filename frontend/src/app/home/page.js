'use client';

import React from 'react';
import { FaSearch, FaHeart, FaPen, FaShoppingCart, FaUtensils, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'Search Recipes',
      description: 'Discover thousands of delicious recipes from around the world. Get detailed instructions, ingredient lists, and cooking times for every recipe.',
      icon: FaSearch,
      link: '/search',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Favorites',
      description: 'Save your favorite recipes to a personal collection. Access them anytime and never lose track of the dishes you love.',
      icon: FaHeart,
      link: '/favorites',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Community Reviews',
      description: 'Read and write reviews for recipes. Share your cooking experiences with the community and learn from other home chefs.',
      icon: FaPen,
      link: '/reviews',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Shopping Cart',
      description: 'Transform your favorite recipes into organized shopping lists. Effortlessly combine ingredients from multiple recipes and adjust quantities.',
      icon: FaShoppingCart,
      link: '/shopping',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fde7cb]">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-lg mb-8 group">
            <FaUtensils size={40} className="text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-5xl font-bold text-black mb-6">
            Welcome to Delish
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your complete culinary companion for discovering, saving, reviewing, and shopping for delicious recipes. 
            Explore our features below and start your culinary journey today.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-start space-x-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <Link
                    href={feature.link}
                    className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 group/link"
                  >
                    <span>Explore {feature.title}</span>
                    <FaArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
