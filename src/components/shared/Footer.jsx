import React from 'react';
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { Mail } from 'lucide-react';
import { VscLocation } from 'react-icons/vsc';

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-3xl mb-4">Workify</h3>
            <p className="text-secondary-foreground text-sm leading-relaxed">
              Empowering careers through AI-driven insights and opportunities.
            </p>
            <p className="text-secondary-foreground text-sm leading-relaxed mt-4">
              Bridging talent with the right opportunities for a brighter future.
            </p>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-semibold text-lg mb-4">"Your AI-Powered Career Companion"</h2>
            <p className="text-secondary-foreground text-sm leading-relaxed">
              At Workify, we leverage cutting-edge AI to connect individuals with the right opportunities, helping them thrive in the ever-evolving job market.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Workify</h3>
            <ul className="space-y-2">
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Our Solutions</li>
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Our Vision</li>
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Contact Us</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Blog</li>
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Guides</li>
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">FAQs</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Opportunities</h3>
            <ul className="space-y-2">
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Find Jobs</li>
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Post a Job</li>
              <li className="text-secondary-foreground hover:text-primary cursor-pointer">Career Counseling</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect with Us</h3>
            <div className="space-y-4">
              <div className="flex items-center text-secondary-foreground">
                <VscLocation className="text-xl mr-2" />
                <span>123 Career St., Job City</span>
              </div>
              <div className="flex items-center text-secondary-foreground">
                <Mail className="text-xl mr-2" />
                <span>support@workify.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-6 text-2xl">
          <a href="#" className="text-secondary-foreground hover:text-primary">
            <FaTwitter />
          </a>
          <a href="#" className="text-secondary-foreground hover:text-primary">
            <FaInstagram />
          </a>
          <a href="#" className="text-secondary-foreground hover:text-primary">
            <FaLinkedin />
          </a>
          <a href="#" className="text-secondary-foreground hover:text-primary">
            <FaYoutube />
          </a>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-secondary-foreground text-sm">&copy; 2024 Workify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
