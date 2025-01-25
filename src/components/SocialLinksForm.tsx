import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { SocialLinks } from '../types';
import { updateSocialLinks } from '../lib/firebase';

interface SocialLinksFormProps {
  links?: SocialLinks;
  onClose: () => void;
}

export function SocialLinksForm({ links, onClose }: SocialLinksFormProps) {
  const [formData, setFormData] = useState({
    github: links?.github || '',
    kofi: links?.kofi || '',
    website: links?.website || '',
    linkedin: links?.linkedin || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSocialLinks(formData);
      onClose();
    } catch (error) {
      console.error('Error saving social links:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Edit Social Links</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Ko-fi URL
            </label>
            <input
              type="url"
              value={formData.kofi}
              onChange={(e) => setFormData({ ...formData, kofi: e.target.value })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="https://ko-fi.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Personal Website URL
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Links'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}