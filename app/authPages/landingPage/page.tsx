"use client"
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-slow"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container-responsive py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="text-2xl font-bold text-gradient">City Pulse</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/authPages/signin" 
              className="btn btn-outline text-white border-white/30 hover:bg-white hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link 
              href="/authPages/signup" 
              className="btn btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container-responsive pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your City with{" "}
                <span className="text-gradient">Real-Time</span> Civic Reporting
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Connect citizens and officers to resolve urban issues faster. Report problems, 
                track progress, and build better communities—together.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/authPages/signup" 
                className="btn btn-primary text-lg px-8 py-4 hover-lift"
              >
                Start Reporting Now
              </Link>
              <Link 
                href="#features" 
                className="btn btn-outline text-white border-white/30 hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Smart Analytics</span>
              </div>
            </div>
          </div>

          <div className={`${isVisible ? 'animate-slide-in' : 'opacity-0'}`}>
            <div className="relative">
              <div className="card-dark p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Live Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">12</div>
                    <div className="text-xs text-gray-400">Overdue</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">8</div>
                    <div className="text-xs text-gray-400">In Progress</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">24</div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                    <span className="text-sm">Pothole on Main St</span>
                    <span className="status-badge status-not-done">Not Done</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                    <span className="text-sm">Streetlight Repair</span>
                    <span className="status-badge status-in-progress">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                    <span className="text-sm">Garbage Collection</span>
                    <span className="status-badge status-finished">Finished</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container-responsive py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose City Pulse?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our platform connects citizens and city officials for faster, more efficient problem resolution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-dark p-8 text-center hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Citizen Reporting</h3>
            <p className="text-gray-400">
              Report issues in seconds with location details and descriptions. Track your submissions 
              from your personal dashboard with real-time updates.
            </p>
          </div>

          <div className="card-dark p-8 text-center hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Officer Dashboard</h3>
            <p className="text-gray-400">
              View all complaints in one organized interface, update statuses efficiently, and 
              prioritize overdue items with smart alerts.
            </p>
          </div>

          <div className="card-dark p-8 text-center hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4">Real-time Insights</h3>
            <p className="text-gray-400">
              Auto-refreshing boards and intelligent alerts keep teams aligned and residents 
              informed about progress and resolutions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container-responsive py-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">500+</div>
            <div className="text-gray-400">Issues Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">48h</div>
            <div className="text-gray-400">Average Resolution Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">95%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">24/7</div>
            <div className="text-gray-400">Platform Availability</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container-responsive py-20">
        <div className="card-dark p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Neighborhood?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens and officers already using City Pulse to make their communities better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/authPages/signup" 
              className="btn btn-primary text-lg px-8 py-4 hover-lift"
            >
              Create Your Account
            </Link>
            <Link 
              href="/authPages/signin" 
              className="btn btn-outline text-white border-white/30 hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container-responsive py-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CP</span>
            </div>
            <span className="text-lg font-semibold">City Pulse</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 City Pulse. Empowering communities through technology.
          </div>
        </div>
      </footer>
    </main>
  );
}

