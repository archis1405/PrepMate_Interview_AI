import React from 'react'

// Type definitions
interface NavigationLink {
  name: string
  href: string
}

interface SocialLink {
  name: string
  href: string
  icon: React.ReactNode
}

const Footer: React.FC = () => {
  // Navigation links data with proper typing
  const navigationLinks: NavigationLink[] = [
    { name: "About", href: "/about" },
    { name: "Features", href: "https://github.com/Adi1816/AI-Mock-Interview" },
    { name: "Contact", href: "https://www.linkedin.com/in/archisman-das-037b36241/" },
    { name: "Privacy", href: "/privacy" }
  ]

  // Social links data with proper typing
  const socialLinks: SocialLink[] = [
    { 
      name: "GitHub", 
      href: "https://github.com/archis1405/PrepMate_Interview_AI",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="GitHub">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    { 
      name: "LinkedIn", 
      href: "https://www.linkedin.com/in/archisman-das-037b36241/",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="LinkedIn">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    }
  ]

  // Get current year with proper typing
  const currentYear: number = new Date().getFullYear()

  return (
    <footer className="relative text-white bg-black/50 backdrop-blur-xl border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-2xl mr-5 font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500">
                Prep Mate AI
              </h2>
            </div>
            <p className="text-sm text-gray-300 text-center md:text-left max-w-xs">
              Transforming interview preparation with next-generation AI innovation.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-3 text-center">
              {navigationLinks.map((link: NavigationLink) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-300 
                    relative group"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-blue-500 
                    group-hover:w-full transition-all duration-300"></span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-500">
              Connect
            </h3>
            <div className="flex space-x-6">
              {socialLinks.map((social: SocialLink) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-300 
                    hover:scale-110 transform"
                  aria-label={`Visit our ${social.name} page`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            © {currentYear} AI Mock Interview. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Made with ❤️ by{" "}
            <a 
              href="https://www.linkedin.com/in/archisman-das-037b36241/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500 hover:from-purple-300 hover:to-pink-500 transition-all duration-300"
            >
              Archisman Das
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer