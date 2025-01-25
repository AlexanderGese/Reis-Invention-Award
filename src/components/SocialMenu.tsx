import React, { useState } from 'react';
import { Menu, Github, Coffee, Globe, Linkedin, X } from 'lucide-react';

export function SocialMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const links = {
    github: "https://github.com/alexandergese",
    kofi: "https://ko-fi.com/alexandergese",
    website: "https://alexander-gese.com",
    linkedin: "https://linkedin.com/in/alexander-gese"
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <div className={`absolute top-14 right-0 bg-white rounded-lg shadow-xl p-2 transition-all duration-200 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="flex flex-col gap-2">
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>
          <a
            href={links.kofi}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
          >
            <Coffee className="w-5 h-5" />
            <span>Ko-fi</span>
          </a>
          <a
            href={links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span>Website</span>
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}
