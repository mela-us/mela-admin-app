import { User, Calendar, Award, Flame, KeyRound, CreditCardIcon } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';

function UserProfileCard({ user, levels, tokens, streak }) {
  const getLevelName = (levelId) => {
    const level = levels.find((l) => l.levelId === levelId);
    return level ? level.name : 'Chưa có cấp độ';
  };

  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin cá nhân</CardTitle>
        <CardDescription className="text-gray-700/80">Thông tin cơ bản của người dùng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-900 min-w-[120px] flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Username
          </span>
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 cursor-default text-sm font-medium"
          >
            {user.username || 'Không có'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-900 min-w-[120px] flex items-center gap-2">
            <User className="h-4 w-4" /> Họ và tên
          </span>
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 cursor-default text-sm font-medium"
          >
            {user.fullname || 'Không có'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-900 min-w-[120px] flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Ngày sinh
          </span>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 cursor-default text-sm font-medium"
          >
            {user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : 'Không có'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-900 min-w-[120px] flex items-center gap-2">
            <Award className="h-4 w-4" /> Cấp độ
          </span>
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 cursor-default text-sm font-medium"
          >
            {getLevelName(user.levelId)}
          </Badge>
        </div>
        {user.userRole?.toUpperCase() === 'USER' && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-indigo-900 min-w-[120px] flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4" /> Tokens
              </span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 cursor-default text-sm font-medium"
              >
                {tokens.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-indigo-900 min-w-[120px] flex items-center gap-2">
                <Flame className="h-4 w-4" /> Chuỗi học tập
              </span>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1 cursor-default text-sm font-medium"
              >
                {streak.streakDays} ngày (Dài nhất: {streak.longestStreak} ngày)
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UserProfileCard;
