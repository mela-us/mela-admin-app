import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { message: "Đã đăng xuất!" },
        { status: 200 }
      );
    }

    // Nếu có token, gọi API backend để logout
    if (accessToken || refreshToken) {
      const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
        cache: "no-store",
      });

      if (!backendResponse.ok) {
        console.error("Backend logout failed:", await backendResponse.text());
        // Vẫn tiếp tục xóa cookies ngay cả khi backend logout thất bại
      }
    }

    const response = NextResponse.json(
      { message: "Đăng xuất thành công!" },
      { status: 200 }
    );

    // Xóa cookies với các options bảo mật
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (err: any) {
    console.error("Logout Error:", err);
    const message = err instanceof Error ? err.message : "Lỗi không xác định";
    return NextResponse.json(
      { error: `Lỗi server khi đăng xuất: ${message}` },
      { status: 500 }
    );
  }
}
