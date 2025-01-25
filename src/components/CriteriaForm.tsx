import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { Criteria } from '../types';
import { addCriteria, updateCriteria } from '../lib/firebase';

interface CriteriaFormProps {
  criteria?: Criteria;
  onClose: () => void;
}

export function CriteriaForm({ criteria, onClose }: CriteriaFormProps) {
  const [formData, setFormData] = useState({
    name: criteria?.name || '',
    weight: criteria?.weight || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const criteriaData = {
        name: formData.name,
        weight: parseInt(formData.weight.toString()) || 1
      };
      
      if (criteria?.id) {
        await updateCriteria(criteria.id, criteriaData);
      } else {
        await addCriteria(criteriaData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving criteria:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            {criteria ? 'Edit Criteria' : 'Add New Criteria'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium mb-2">
              Criteria Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter criteria name"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">
              Weight (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.weight.toString()}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="input-field"
              placeholder="Enter weight (1-10)"
              required
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Higher weight means this criteria has more impact on the final score
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Criteria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}