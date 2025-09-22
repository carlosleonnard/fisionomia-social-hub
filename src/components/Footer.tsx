import { Instagram, Twitter, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-phindex-teal/20 mt-12 md:mt-24 lg:ml-80" style={{ backgroundColor: '#007a75' }}>
      <div className="container mx-auto px-2 md:px-4 py-3">
        <div className="text-center text-xs md:text-sm text-gray-300">
          © Copyright 2025 Phindex. All rights reserved.
        </div>
      </div>
    </footer>
  );
};