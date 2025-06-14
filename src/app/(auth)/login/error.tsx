'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Login Error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-red-600 mb-3">Đã xảy ra lỗi khi đăng nhập</h2>
        <p className="text-gray-700 mb-6">
          {error?.message || 'Không rõ nguyên nhân. Vui lòng thử lại.'}
        </p>
        <button
          onClick={reset}
          className="w-full py-2 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
