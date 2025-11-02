
import React from 'react';
import BookIcon from './icons/BookIcon';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Book Registry
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <p className="hidden md:block text-gray-500 dark:text-gray-400">Manage your book collection with ease.</p>
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;
