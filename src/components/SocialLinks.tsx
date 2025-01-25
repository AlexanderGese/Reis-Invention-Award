import React from 'react';
import { Github, Coffee, Globe, Linkedin } from 'lucide-react';

interface SocialLinksProps {
  github?: string;
  kofi?: string;
  website?: string;
  linkedin?: string;
}

export function SocialLinks({ github, kofi, website, linkedin }: SocialLinksProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
          title="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
      )}
      {kofi && (
        <a
          href={kofi}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all duration-200"
          title="Ko-fi"
        >
          <Coffee className="w-5 h-5" />
        </a>
      )}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
          title="Personal Website"
        >
          <Globe className="w-5 h-5" />
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
          title="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}