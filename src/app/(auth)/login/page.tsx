import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from '@/components/auth/login-form';
import styles from '@/styles/login.module.css'

export default function LoginPage() {
  return (
    <div className={`${styles.background} flex h-screen items-center justify-center`}>
      <Card
        className="w-full max-w-md rounded-2xl px-6 py-4
             text-white
             bg-[#3a005caa]
             backdrop-blur-xl
             border border-white/20
             ring-1 ring-fuchsia-500/20
             shadow-2xl shadow-purple-900/50"
      >
        <CardHeader className="space-y-1 pb-4 border-b border-white/20">
          <CardTitle className="text-3xl font-bold text-white text-center">MELA</CardTitle>
          <CardDescription className="text-center text-gray-200">Đăng nhập để quản lý nội dung toán học</CardDescription>
        </CardHeader>

        <LoginForm />

        <CardFooter className="text-center text-sm text-gray-300 pt-4 border-t border-white/20">
          <p className="w-full">Hệ thống quản lý nội dung toán học MELA</p>
        </CardFooter>
      </Card>
    </div>
  );
}
