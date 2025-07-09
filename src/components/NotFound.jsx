import { AlertCircle, HouseIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#3a005caa] backdrop-blur-md"></div>

      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main 404 Container */}
      <div className="relative z-10 text-center w-full max-w-md rounded-2xl px-6 py-8 text-white bg-[#3a005caa] backdrop-blur-xl border border-white/20 ring-1 ring-fuchsia-500/20 shadow-2xl shadow-purple-900/50 animate-fadeIn">
        {/* Error Message */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
            <AlertCircle className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="font-bold text-3xl bg-clip-text mb-2 text-white">Page Not Found</h2>
          <p className="text-gray-300 font-semibold text-lg">
            Trang này không tồn tại hoặc đã bị xóa.
            <br />
            Vui lòng kiểm tra lại đường dẫn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-center gap-4">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 text-white font-semibold rounded-xl
              bg-gradient-to-r from-fuchsia-500 to-pink-500
              hover:from-fuchsia-600 hover:to-pink-600
              shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-2"
          >
            <HouseIcon className="w-5 h-5" />
            Về Trang Chính
          </NavLink>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-10 -left-10 w-5 h-5 bg-fuchsia-400/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-10 -right-10 w-4 h-4 bg-pink-400/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-fuchsia-400/20 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
}
