import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Phone, Mail, Linkedin, Home } from 'lucide-react';
import { B2BData, B2CData } from '../../types/data';

interface ContactDataProps {
  data: B2BData[] | B2CData[];
}

export default function ContactData({ data }: ContactDataProps) {
  const stats = [
    {
      title: 'Phone Numbers',
      items: [
        { label: 'Mobile', value: data.filter(d => d.MOBILE_PHONE).length },
        { label: 'Direct', value: data.filter(d => d.DIRECT_NUMBER).length },
        { label: 'Personal', value: data.filter(d => d.PERSONAL_PHONE).length }
      ],
      icon: Phone
    },
    {
      title: 'Emails',
      items: [
        { label: 'Personal', value: data.filter(d => d.PERSONAL_EMAIL).length },
        { label: 'Business', value: data.filter(d => d.BUSINESS_EMAIL).length }
      ],
      icon: Mail
    },
    {
      title: 'LinkedIn Profiles',
      items: [
        { 
          label: 'Total', 
          value: data.filter(d => d.LINKEDIN_URL).length
        }
      ],
      icon: Linkedin
    },
    {
      title: 'Homeowner Status',
      items: [
        { 
          label: 'Yes', 
          value: data.filter(d => d.HOMEOWNER === 'Y').length
        }
      ],
      icon: Home
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}