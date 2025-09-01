import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ReaderData } from '@/types/audiobook';

interface ReaderContextType {
  bookData: ReaderData | null;
  setReaderData: (data: ReaderData) => void;
  clearReaderData: () => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [bookData, setBookData] = useState<ReaderData | null>(null);

  const setReaderData = (data: ReaderData) => setBookData(data);
  const clearReaderData = () => setBookData(null);

  // log changes to reader data
  useEffect(() => {
    if (bookData) {
      console.log('Reader data set');
    } else {
      console.log('Reader data cleared');
    }
  }, [bookData]);

  return (
    <ReaderContext.Provider
      value={{
        bookData,
        setReaderData,
        clearReaderData,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}