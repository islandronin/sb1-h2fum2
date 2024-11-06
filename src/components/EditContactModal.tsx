import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Contact, ContactMethod, SocialLink } from '../types/Contact';
import { useSocialNetworks } from '../context/SocialNetworksContext';

interface EditContactModalProps {
  contact: Contact;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

interface FormData {
  name: string;
  jobTitle: string;
  imageUrl: string;
  about: string;
  website: string;
  calendarLink: string;
  contactMethods: ContactMethod[];
  socialLinks: SocialLink[];
  tags: string;
}

export function EditContactModal({ contact, onClose, onSave }: EditContactModalProps) {
  const { networks, addNetwork } = useSocialNetworks();
  const [showCustomNetwork, setShowCustomNetwork] = useState(false);
  const [customNetwork, setCustomNetwork] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: contact.name || '',
    jobTitle: contact.jobTitle || '',
    imageUrl: contact.imageUrl || '',
    about: contact.about || '',
    website: contact.website || '',
    calendarLink: contact.calendarLink || '',
    contactMethods: Array.isArray(contact.contactMethods) ? [...contact.contactMethods] : [],
    socialLinks: Array.isArray(contact.socialLinks) ? [...contact.socialLinks] : [],
    tags: Array.isArray(contact.tags) ? contact.tags.join(', ') : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addContactMethod = () => {
    setFormData(prev => ({
      ...prev,
      contactMethods: [
        ...prev.contactMethods,
        { type: 'email', value: '', isPrimary: prev.contactMethods.length === 0 },
      ],
    }));
  };

  const removeContactMethod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.filter((_, i) => i !== index),
    }));
  };

  const updateContactMethod = (index: number, field: keyof ContactMethod, value: any) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.map((method, i) =>
        i === index ? { ...method, [field]: value } : method
      ),
    }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: '', url: '' },
      ],
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const handleAddCustomNetwork = () => {
    if (customNetwork.trim()) {
      addNetwork(customNetwork.trim().toLowerCase());
      setCustomNetwork('');
      setShowCustomNetwork(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedContact: Contact = {
      ...contact,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    onSave(updatedContact);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Contact</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

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
                Add Contact Method
              </button>
            </div>
            <div className="space-y-3">
              {formData.contactMethods.map((method, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <select
                    value={method.type}
                    onChange={(e) => updateContactMethod(index, 'type', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                  <input
                    type={method.type === 'email' ? 'email' : 'tel'}
                    value={method.value}
                    onChange={(e) => updateContactMethod(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={method.type === 'email' ? 'Email address' : 'Phone number'}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={method.isPrimary}
                      onChange={(e) => updateContactMethod(index, 'isPrimary', e.target.checked)}
                      className="mr-2"
                    />
                    Primary
                  </label>
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Social Links
              </label>
              <button
                type="button"
                onClick={addSocialLink}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Social Link
              </button>
            </div>
            <div className="space-y-3">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <select
                    value={link.platform}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomNetwork(true);
                      } else {
                        updateSocialLink(index, 'platform', e.target.value);
                      }
                    }}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Platform</option>
                    {networks.sort().map((network) => (
                      <option key={network} value={network}>
                        {network.charAt(0).toUpperCase() + network.slice(1)}
                      </option>
                    ))}
                    <option value="custom">Add Custom...</option>
                  </select>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {showCustomNetwork && (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Social Network Name
                </label>
                <input
                  type="text"
                  value={customNetwork}
                  onChange={(e) => setCustomNetwork(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter network name"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomNetwork}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Network
              </button>
              <button
                type="button"
                onClick={() => setShowCustomNetwork(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          )}

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

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}