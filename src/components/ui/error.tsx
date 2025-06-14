export default function ErrorPage({ error }: { error: Error }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600">Lỗi xảy ra</h1>
            <p className="mt-4 text-lg text-gray-600">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </p>
            <p className="mt-4 text-lg text-gray-700">{error.message}</p>
            <p className="mt-2 text-sm text-gray-500">
            [Annotation: Nội dung không được tải do lỗi server, dẫn đến hiển thị giao diện trống.]
            </p>
        </div>
    );
}