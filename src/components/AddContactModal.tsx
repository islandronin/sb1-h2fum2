import React, { useState } from 'react';
import { X, Loader2, Plus, Minus } from 'lucide-react';
import { fetchLinkedInProfile } from '../services/linkedinApi';
import type { ContactMethod } from '../types/Contact';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactData: any) => void;
}

export function AddContactModal({ isOpen, onClose, onSubmit }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    company: '',
    location: '',
    website: '',
    birthday: '',
    linkedinUrl: '',
    imageUrl: '',
    about: '',
    calendarLink: '',
    notes: '',
    contactMethods: [] as ContactMethod[],
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      instagram: '',
      facebook: '',
      youtube: '',
      medium: '',
      skype: '',
      discord: '',
      telegram: '',
    },
    tags: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSocialLinkChange = (network: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: e.target.value,
      },
    }));
  };

  const addContactMethod = () => {
    setFormData(prev => ({
      ...prev,
      contactMethods: [
        ...prev.contactMethods,
        { type: 'email', value: '', label: '', isPrimary: prev.contactMethods.length === 0 },
      ],
    }));
  };

  const removeContactMethod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.filter((_, i) => i !== index),
    }));
  };

  const updateContactMethod = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.map((method, i) =>
        i === index ? { ...method, [field]: value } : method
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    onSubmit({ ...formData, tags });
  };

  const handleLinkedInFetch = async () => {
    if (!formData.linkedinUrl) {
      setError('Please enter a LinkedIn URL');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const profile = await fetchLinkedInProfile(formData.linkedinUrl);
      setFormData(prev => ({
        ...prev,
        name: profile.name || prev.name,
        jobTitle: profile.jobTitle || prev.jobTitle,
        imageUrl: profile.imageUrl || prev.imageUrl,
        about: profile.about || prev.about,
        socialLinks: {
          ...prev.socialLinks,
          linkedin: prev.linkedinUrl,
        },
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch LinkedIn profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Contact</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LinkedIn Import Section */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <button
              type="button"
              onClick={handleLinkedInFetch}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Fetch Profile'
              )}
            </button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Contact Methods */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Methods
              </label>
              <button
                type="button"
                onClick={addContactMethod}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Contact
              </button>
            </div>
            <div className="space-y-3">
              {formData.contactMethods.map((method, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="w-24">
                    <select
                      value={method.type}
                      onChange={(e) => updateContactMethod(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type={method.type === 'email' ? 'email' : 'tel'}
                      value={method.value}
                      onChange={(e) => updateContactMethod(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={method.type === 'email' ? 'Email address' : 'Phone number'}
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={method.label}
                      onChange={(e) => updateContactMethod(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Label"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContactMethod(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Image & Website */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* About & Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Add any private notes about this contact..."
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Links
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData.socialLinks).map((network) => (
                <div key={network}>
                  <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                    {network}
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks[network as keyof typeof formData.socialLinks]}
                    onChange={handleSocialLinkChange(network)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={`${network} URL`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Calendar & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calendar Link
              </label>
              <input
                type="url"
                name="calendarLink"
                value={formData.calendarLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://calendly.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="client, tech, marketing"
              />
            </div>
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}