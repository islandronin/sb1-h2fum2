import React, { useState } from 'react';
import { ContactCard } from '../components/ContactCard';
import { AddContactModal } from '../components/AddContactModal';
import { contacts as initialContacts } from '../data/contacts';
import { Users, UserPlus, LogOut } from 'lucide-react';
import type { Contact } from '../types/Contact';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user, logout } = useAuth();

  const handleUpdateContact = (contactId: string, updatedContact: Contact) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId ? updatedContact : contact
    ));
  };

  const handleAddContact = (formData: any) => {
    const contact: Contact = {
      id: crypto.randomUUID(),
      name: formData.name,
      jobTitle: formData.jobTitle,
      imageUrl: formData.imageUrl,
      about: formData.about,
      socialLinks: {
        linkedin: formData.linkedinUrl,
        twitter: formData.twitterUrl,
        github: formData.githubUrl,
      },
      calendarLink: formData.calendarLink,
      conversations: [],
    };
    setContacts([...contacts, contact]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Networking CRM</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Contact</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onUpdateContact={handleUpdateContact}
            />
          ))}
        </div>
      </div>

      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddContact}
      />
    </div>
  );
}