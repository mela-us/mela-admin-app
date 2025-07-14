import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';

function ContributorStats({ lectureContributions, exerciseContributions }) {
  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin đóng góp tổng quan</CardTitle>
        <CardDescription className="text-gray-700/80">Các số liệu đóng góp của contributor cho app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {(lectureContributions || exerciseContributions) ? (
          <div className="grid grid-cols-3 gap-y-4 gap-x-36">
            {lectureContributions && (
              <>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Bài giảng đã tạo</p>
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {lectureContributions.totalCreatedNumber.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Bài giảng được duyệt</p>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {lectureContributions.verifiedNumber.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Lượt truy cập bài giảng</p>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {lectureContributions.accessedContentNumber.toLocaleString()}
                  </Badge>
                </div>
              </>
            )}
            {exerciseContributions && (
              <>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Bài tập đã tạo</p>
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {exerciseContributions.totalCreatedNumber.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Bài tập được duyệt</p>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {exerciseContributions.verifiedNumber.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Lượt truy cập bài tập</p>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {exerciseContributions.accessedContentNumber.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Câu hỏi đã tạo</p>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {exerciseContributions.totalQuestionCreatedNumber.toLocaleString()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Câu hỏi được duyệt</p>
                  <Badge
                    variant="outline"
                    className="bg-pink-50 text-pink-700 hover:bg-pink-100 px-3 py-1 cursor-default text-sm font-medium"
                  >
                    {exerciseContributions.totalQuestionVerifiedNumber.toLocaleString()}
                  </Badge>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Chưa có dữ liệu đóng góp</p>
        )}
      </CardContent>
    </Card>
  );
}

export default ContributorStats;
