import { Instagram, Twitter, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-phindex-teal/20 mt-24" style={{ backgroundColor: '#007a75' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="/jobs" className="text-gray-300 hover:text-white transition-colors">Jobs</a></li>
              <li><a href="/record" className="text-gray-300 hover:text-white transition-colors">For the Record</a></li>
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h3 className="font-semibold text-white mb-4">Communities</h3>
            <ul className="space-y-3">
              <li><a href="/artists" className="text-gray-300 hover:text-white transition-colors">For Artists</a></li>
              <li><a href="/developers" className="text-gray-300 hover:text-white transition-colors">Developers</a></li>
              <li><a href="/advertising" className="text-gray-300 hover:text-white transition-colors">Advertising</a></li>
              <li><a href="/investors" className="text-gray-300 hover:text-white transition-colors">Investors</a></li>
              <li><a href="/vendors" className="text-gray-300 hover:text-white transition-colors">Vendors</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Useful Links</h3>
            <ul className="space-y-3">
              <li><a href="/support" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
              <li><a href="/mobile" className="text-gray-300 hover:text-white transition-colors">Free Mobile App</a></li>
              <li><a href="/country" className="text-gray-300 hover:text-white transition-colors">Popular by Country</a></li>
            </ul>
          </div>

          {/* Phindex Plans */}
          <div>
            <h3 className="font-semibold text-white mb-4">Phindex Plans</h3>
            <ul className="space-y-3">
              <li><a href="/premium-individual" className="text-gray-300 hover:text-white transition-colors">Premium Individual</a></li>
              <li><a href="/premium-duo" className="text-gray-300 hover:text-white transition-colors">Premium Duo</a></li>
              <li><a href="/premium-family" className="text-gray-300 hover:text-white transition-colors">Premium Family</a></li>
              <li><a href="/premium-student" className="text-gray-300 hover:text-white transition-colors">Premium Student</a></li>
              <li><a href="/free" className="text-gray-300 hover:text-white transition-colors">Phindex Free</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-end mb-8">
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Instagram className="w-5 h-5" style={{ color: '#007a75' }} />
            </a>
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Twitter className="w-5 h-5" style={{ color: '#007a75' }} />
            </a>
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Facebook className="w-5 h-5" style={{ color: '#007a75' }} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-300">
          © Copyright 2025 Phindex. All rights reserved.
        </div>
      </div>
    </footer>
  );
};