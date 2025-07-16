import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

function ContributorStats({ lectureContributions, exerciseContributions }) {
  return (
    <Card className="border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-100/80/20">
      <CardHeader className="bg-indigo-200/50 border-b border-indigo-200">
        <CardTitle className="text-xl font-bold text-gray-700/90">Thông tin đóng góp tổng quan</CardTitle>
        <CardDescription className="text-gray-700/80">Các số liệu đóng góp của contributor cho app</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {lectureContributions || exerciseContributions ? (
          <div className="grid grid-cols-3 gap-4">
            {lectureContributions && (
              <>
                <div className="p-3 bg-gradient-to-r from-blue-100/80 to-blue-200/80 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Bài giảng đã tạo</p>
                  <div className="text-2xl font-bold text-blue-700">{lectureContributions.totalCreatedNumber.toLocaleString()}</div>
                  <p className="text-xs text-blue-600">bài giảng</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-100/80 to-green-200/80 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-1">Bài giảng được duyệt</p>
                  <div className="text-2xl font-bold text-green-700">{lectureContributions.verifiedNumber.toLocaleString()}</div>
                  <p className="text-xs text-green-600">bài giảng được duyệt</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-100/80 to-purple-200/80 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Lượt truy cập vào bài giảng</p>
                  <div className="text-2xl font-bold text-purple-700">{lectureContributions.accessedContentNumber.toLocaleString()}</div>
                  <p className="text-xs text-purple-600">lượt truy cập</p>
                </div>
              </>
            )}
            {exerciseContributions && (
              <>
                <div className="p-3 bg-gradient-to-r from-indigo-100/80 to-indigo-200/80 rounded-lg">
                  <p className="text-sm font-semibold text-indigo-900 mb-1">Bài luyện tập đã tạo</p>
                  <div className="text-2xl font-bold text-indigo-700">{exerciseContributions.totalCreatedNumber.toLocaleString()}</div>
                  <p className="text-xs text-indigo-600">bài luyện tập</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-amber-100/80 to-amber-200/80 rounded-lg">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Bài luyện tập được duyệt</p>
                  <div className="text-2xl font-bold text-amber-700">{exerciseContributions.verifiedNumber.toLocaleString()}</div>
                  <p className="text-xs text-amber-600">bài luyện tập được duyệt</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-pink-100/80 to-pink-200/80 rounded-lg">
                  <p className="text-sm font-semibold text-pink-900 mb-1">Lượt truy cập vào bài luyện tập</p>
                  <div className="text-2xl font-bold text-pink-700">{exerciseContributions.accessedContentNumber.toLocaleString()}</div>
                  <p className="text-xs text-pink-600">lượt truy cập</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-100/800 text-center py-4">Chưa có dữ liệu đóng góp</p>
        )}
      </CardContent>
    </Card>
  );
}

export default ContributorStats;
