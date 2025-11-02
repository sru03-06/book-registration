
import React from 'react';
import type { Book } from '../types';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  onEdit: (book: Book) => void;
  onDelete: (bookId: number) => void;
}

const BookList: React.FC<BookListProps> = ({ books, isLoading, error, onEdit, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <tr key={index} className="bg-white dark:bg-gray-800 animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></td>
        </tr>
      ));
    }

    if (error) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-10 text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (books.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
            No books found. Add one to get started!
          </td>
        </tr>
      );
    }

    return books.map((book, index) => (
      <tr key={book.book_id} className={`transition-colors duration-300 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">{book.book_id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{book.title}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{book.author}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-100">{formatPrice(book.price)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-3">
              <button onClick={() => onEdit(book)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 transition-colors" aria-label={`Edit ${book.title}`}>
                <EditIcon className="h-5 w-5" />
              </button>
              <button onClick={() => onDelete(book.book_id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors" aria-label={`Delete ${book.title}`}>
                <DeleteIcon className="h-5 w-5" />
              </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Registered Books</h2>
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                {renderContent()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
