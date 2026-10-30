'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) {
      return;
    }
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#888] hover:text-[#1a1a1a] transition-colors z-10"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <Search className="w-6 h-6 text-[#C8547A] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 text-lg sm:text-xl font-medium text-[#1a1a1a] placeholder-[#bbb] outline-none"
                />
              </div>

              {/* Hint */}
              <p className="text-xs text-[#888] mt-4 ml-10">
                Enter at least 2 characters to search
              </p>

              {/* Search Button */}
              <button
                type="submit"
                disabled={searchQuery.trim().length < 2}
                className="mt-6 w-full py-3 px-4 bg-[#C8547A] text-white font-semibold rounded-lg hover:bg-[#b04468] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick tips */}
            <div className="bg-[#FDF6F8] px-6 sm:px-8 py-4 border-t border-gray-100">
              <p className="text-xs text-[#888] font-medium mb-2">Quick Tips:</p>
              <ul className="text-xs text-[#888] space-y-1">
                <li>• Search by product name</li>
                <li>• Search by category or brand</li>
                <li>• Use specific keywords for better results</li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
