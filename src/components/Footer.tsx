import { Instagram, Twitter, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-phindex-teal/20 mt-24" style={{ backgroundColor: '#007a75' }}>
      <div className="container mx-auto px-4 py-6 lg:ml-80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 max-w-2xl mx-auto">
          {/* Company */}
          <div className="text-center">
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="/contato" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
              <li><a href="/record" className="text-gray-300 hover:text-white transition-colors">For the Record</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="text-center">
            <h3 className="font-semibold text-white mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li><a href="/support" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
              <li><a href="/mobile" className="text-gray-300 hover:text-white transition-colors">Free Mobile App</a></li>
              <li><a href="/country" className="text-gray-300 hover:text-white transition-colors">Popular by Country</a></li>
            </ul>
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