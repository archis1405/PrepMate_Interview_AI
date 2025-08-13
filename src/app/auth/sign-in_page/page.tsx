import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          {/* Left Side - Branding & Description (Hidden on Mobile) */}
          <section className="hidden lg:flex relative items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-blue-600 to-indigo-700">
            <div className="text-center z-10 text-white max-w-md mx-auto">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <svg 
                  className="w-12 h-12" 
                  viewBox="0 0 28 24" 
                  fill="currentColor"
                >
                  {/* Your existing SVG path */}
                </svg>
                <h1 className="text-3xl font-bold tracking-tight pr-16">
                  AI Mock Interview
                </h1>
              </div>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight text-center">
                Transform Your Interview Preparation
              </h2>
              <p className="text-lg opacity-90 mb-8 leading-relaxed text-center px-4">
                Leverage cutting-edge AI to simulate real interview scenarios, 
                receive instant feedback, and boost your confidence with data-driven insights.
              </p>
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <div className="w-8 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
          </section>
          {/* Right Side - Authentication */}
          <main className="flex items-center justify-center p-4 lg:p-8 ">
            <div className="w-full max-w-md space-y-8 text-center">
              {/* Mobile Branding (Visible only on Mobile) */}
              <div className="lg:hidden mb-6">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <svg 
                    className="w-10 h-10" 
                    viewBox="0 0 28 24" 
                    fill="currentColor"
                  >
                    {/* Your existing SVG path */}
                  </svg>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
                    AI Mock Interview
                  </h1>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                  Welcome from Aditya
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                  Sign in to unlock personalized interview preparation
                </p>
              </div>
              {/* Clerk SignIn Component */}
              <div className="flex justify-center">
                <SignIn />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  New to AI Mock Interview? 
                  <a 
                    href="/sign-up" 
                    className="ml-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}