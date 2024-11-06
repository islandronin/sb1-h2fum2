import React, { useState } from 'react';
import { Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import type { Contact } from '../types/Contact';
import { ContactProfile } from './ContactProfile';

interface ContactCardProps {
  contact: Contact;
  onUpdateContact: (id: string, contact: Contact) => void;
}

export function ContactCard({ contact, onUpdateContact }: ContactCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  
  const primaryEmail = contact.contactMethods?.find(
    method => method.type === 'email' && method.isPrimary
  )?.value || contact.contactMethods?.find(method => method.type === 'email')?.value;

  const primaryPhone = contact.contactMethods?.find(
    method => method.type === 'phone' && method.isPrimary
  )?.value || contact.contactMethods?.find(method => method.type === 'phone')?.value;

  const handleUpdateContact = (updatedContact: Contact) => {
    onUpdateContact(contact.id, updatedContact);
    setShowProfile(false);
  };

  return (
    <>
      <div
        onClick={() => setShowProfile(true)}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-start space-x-4">
          <img
            src={contact.imageUrl || 'https://via.placeholder.com/100'}
            alt={contact.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
            {contact.jobTitle && (
              <p className="text-sm text-gray-600 mb-2">{contact.jobTitle}</p>
            )}
            
            <div className="space-y-2">
              {primaryEmail && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{primaryEmail}</span>
                </div>
              )}
              
              {primaryPhone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{primaryPhone}</span>
                </div>
              )}
              
              {contact.calendarLink && (
                <div className="flex items-center text-sm text-blue-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <a
                    href={contact.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-blue-700"
                  >
                    Schedule Meeting
                  </a>
                </div>
              )}
              
              {contact.website && (
                <div className="flex items-center text-sm text-blue-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-blue-700 truncate"
                  >
                    {contact.website}
                  </a>
                </div>
              )}
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfile && (
        <ContactProfile
          contact={contact}
          onClose={() => setShowProfile(false)}
          onUpdate={handleUpdateContact}
        />
      )}
    </>
  );
}