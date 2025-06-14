import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp tên đăng nhập và mật khẩu!' },
        { status: 400 }
      );
    }

    const loginResponse = {
      ok: true,
      status: 200,
      json: () => ({
        accessToken: 'fakeAccess',
        refreshToken: 'fakeRefresh',
      })
    }
    // Gọi API backend để xác thực
    // const loginResponse = await fetch(`${process.env.BACKEND_URL}/api/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    //   cache: 'no-store',
    // });

    if (loginResponse.status === 401 || loginResponse.status === 400) {
      return NextResponse.json(
        { error: 'Tài khoản hoặc mật khẩu không chính xác!' },
        { status: 401 }
      );
    } else if (loginResponse.status === 429) {
      return NextResponse.json(
        { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau!' },
        { status: 429 }
      );
    } else if (!loginResponse.ok) {
      return NextResponse.json(
        { error: 'Đăng nhập thất bại!' },
        { status: loginResponse.status }
      );
    }

    const { accessToken, refreshToken } = await loginResponse.json();
    const response = NextResponse.json(
      { message: 'Đăng nhập thành công!' },
      { status: 200 }
    );

    // Lưu access token
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 60, // 2 hours
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    // Lưu refresh token
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json(
      { error: `Lỗi server: ${message}` },
      { status: 500 }
    );
  }
}
