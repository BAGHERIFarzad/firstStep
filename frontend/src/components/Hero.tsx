import React from 'react';
import { Code2, Sparkles, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-20 px-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
              FirstStep
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Your AI-powered companion for understanding and documenting code
          </p>
        </div>

        {/* Stories section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Henri's Story */}
          <div className="card p-8 hover:shadow-2xl transition-all duration-300 animate-slide-up">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                H
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Meet Henri
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  Senior Developer
                </p>
              </div>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Henri has been coding for 15 years, but recently inherited a massive legacy codebase with zero documentation. 
                Every day feels like archaeology, digging through thousands of lines trying to understand what each piece does.
              </p>
              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm italic">
                  "FirstStep transformed my workflow. I paste code, and instantly get a clear summary, component breakdown, 
                  and test suggestions. What used to take hours now takes minutes."
                </p>
              </div>
            </div>
          </div>

          {/* Amina's Story */}
          <div className="card p-8 hover:shadow-2xl transition-all duration-300 animate-slide-up delay-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                A
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Meet Amina
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  Junior Developer
                </p>
              </div>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="leading-relaxed">
                Amina just started her first developer job. She's eager to contribute but often feels overwhelmed by 
                complex codebases. Understanding how different components interact and what tests to write feels daunting.
              </p>
              <div className="flex items-start gap-2 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm italic">
                  "FirstStep is like having a senior developer mentor available 24/7. It breaks down complex code into 
                  digestible pieces and suggests tests I should write. I'm learning and contributing faster than ever!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center animate-fade-in">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Whether you're a seasoned developer or just starting out, FirstStep helps you understand code faster
          </p>
          <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400">
            <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Paste your code below to get started</span>
            <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// Made with Bob
