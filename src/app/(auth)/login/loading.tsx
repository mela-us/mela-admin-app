export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-50 mx-auto mb-4" />
        <p className="text-gray-700">Đang tải trang đăng nhập...</p>
      </div>
    </div>
  );
}
