import React from 'react';
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    about: [
      'Our Solutions',
      'Our Vision',
      'Contact Us',
      'Careers',
    ],
    resources: [
      'Blog',
      'Guides',
      'FAQs',
      'Help Center',
    ],
    opportunities: [
      'Find Jobs',
      'Post a Job',
      'Career Counseling',
      'Skill Development',
    ],
    legal: [
      'Privacy Policy',
      'Terms of Service',
      'Cookie Policy',
    ],
  };

  const socialLinks = [
    { icon: <FaTwitter />, label: 'Twitter' },
    { icon: <FaInstagram />, label: 'Instagram' },
    { icon: <FaLinkedin />, label: 'LinkedIn' },
    { icon: <FaYoutube />, label: 'YouTube' },
  ];

  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Workify
              </h3>
              <p className="text-secondary-foreground text-sm leading-relaxed mt-2">
                Empowering careers through AI-driven insights and opportunities.
              </p>
            </motion.div>
            <div className="space-y-2">
              <div className="flex items-center text-secondary-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                <span>123 Career St., Job City</span>
              </div>
              <div className="flex items-center text-secondary-foreground">
                <Mail className="w-4 h-4 mr-2" />
                <span>support@workify.com</span>
              </div>
              <div className="flex items-center text-secondary-foreground">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (234) 567-890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerSections).map(([section, items]) => (
            <div key={section} className="lg:col-span-1">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg font-semibold mb-4 capitalize pl-0"
              >
                {section}
              </motion.h3>
              <ul className="space-y-2 pl-0">
                {items.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                    className="list-none text-secondary-foreground"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-12 space-x-6"
        >
          {socialLinks.map((social, index) => (
            <motion.div
              key={social.label}
              className="text-secondary-foreground text-2xl relative group"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              {social.icon}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-background px-2 py-1 rounded whitespace-nowrap">
                {social.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 border-t border-border pt-6 text-center"
        >
          <p className="text-secondary-foreground text-sm">
            &copy; {currentYear} Workify. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-xs text-secondary-foreground">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Cookie Policy</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
