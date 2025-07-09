import { Book } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#3a005caa] backdrop-blur-md"></div>

      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 text-center w-full max-w-md rounded-2xl px-6 py-8 text-white bg-[#3a005caa] backdrop-blur-xl border border-white/20 ring-1 ring-fuchsia-500/20 shadow-2xl shadow-purple-900/50">
        {/* Logo Area */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-bold text-3xl bg-clip-text mb-2 text-white">MELA WEB</h1>
          <p className="text-gray-300 font-semibold text-lg">Quản lý nội dung toán học cho App MELA</p>
        </div>

        {/* Main Spinner */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            {/* Animated Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
            {/* Inner Ring */}
            <div
              className="absolute inset-4 border-2 border-white/30 rounded-full animate-spin"
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}
            ></div>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Book className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-10 -left-10 w-5 h-5 bg-fuchsia-400/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-10 -right-10 w-4 h-4 bg-pink-400/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-fuchsia-400/20 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
}
