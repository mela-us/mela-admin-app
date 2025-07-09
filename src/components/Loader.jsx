import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-20">
      <div className="flex items-center space-x-3">
        <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
        <div className="text-base font-medium text-pink-600">Đang tải...</div>
      </div>
    </div>
  );
}
