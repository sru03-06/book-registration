
import React, { useState, useEffect, useCallback } from 'react';
import type { Book } from './types';
import AddBookForm from './components/AddBookForm';
import BookList from './components/BookList';
import Header from './components/Header';
import EditBookModal from './components/EditBookModal';

const initialBooks: Book[] = [
  { book_id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99 },
  { book_id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 12.50 },
  { book_id: 3, title: '1984', author: 'George Orwell', price: 9.99 },
  { book_id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 8.75 },
];

// Mock API functions
const mockApi = {
  getBooks: async (): Promise<Book[]> => {
    console.log('API: GET /books');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const books = localStorage.getItem('books');
    if (books) {
      return JSON.parse(books);
    }
    localStorage.setItem('books', JSON.stringify(initialBooks));
    return initialBooks;
  },
  addBook: async (newBookData: Omit<Book, 'book_id'>): Promise<Book> => {
    console.log('API: POST /books', newBookData);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const currentBooks: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
    const newBook: Book = {
      ...newBookData,
      book_id: new Date().getTime(), // Simple unique ID
    };
    const updatedBooks = [...currentBooks, newBook];
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    return newBook;
  },
  updateBook: async (updatedBook: Book): Promise<Book> => {
    console.log('API: PUT /books', updatedBook);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const currentBooks: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
    const updatedBooks = currentBooks.map(book => book.book_id === updatedBook.book_id ? updatedBook : book);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    return updatedBook;
  },
  deleteBook: async (bookId: number): Promise<void> => {
    console.log('API: DELETE /books', bookId);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const currentBooks: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
    const updatedBooks = currentBooks.filter(book => book.book_id !== bookId);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  },
};

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mockApi.getBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddBook = async (newBookData: Omit<Book, 'book_id' | 'price'> & { price: string }) => {
    try {
      const bookToAdd = { ...newBookData, price: parseFloat(newBookData.price) };
      if (isNaN(bookToAdd.price) || bookToAdd.price <= 0) {
        alert("Please enter a valid price.");
        return;
      }
      const newBook = await mockApi.addBook(bookToAdd);
      setBooks(prevBooks => [...prevBooks, newBook]);
    } catch (err) {
      setError('Failed to add book.');
      console.error(err);
    }
  };
  
  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      await mockApi.updateBook(updatedBook);
      setBooks(prevBooks => prevBooks.map(book => book.book_id === updatedBook.book_id ? updatedBook : book));
      setEditingBook(null);
    } catch (err) {
        setError('Failed to update book.');
        console.error(err);
    }
  }

  const handleDeleteBook = async (bookId: number) => {
    if(window.confirm('Are you sure you want to delete this book?')){
        try {
            await mockApi.deleteBook(bookId);
            setBooks(prevBooks => prevBooks.filter(book => book.book_id !== bookId));
        } catch (err) {
            setError('Failed to delete book.');
            console.error(err);
        }
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header theme={theme} setTheme={setTheme} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddBookForm onAddBook={handleAddBook} />
          </div>
          <div className="lg:col-span-2">
            <BookList books={books} isLoading={isLoading} error={error} onEdit={setEditingBook} onDelete={handleDeleteBook} />
          </div>
        </div>
      </main>
      {editingBook && (
          <EditBookModal 
            book={editingBook}
            onSave={handleUpdateBook}
            onClose={() => setEditingBook(null)}
          />
      )}
      <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; 2024 Book Registry. All rights reserved.</p>
      </footer>
    </div>
  );
}
