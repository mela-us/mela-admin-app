'use client'

import type React from "react";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Tài khoản hoặc mật khẩu không đúng!`)
      }
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra thông tin.")
      setLoading(false)
    }
  };

  return (
    <CardContent className="pt-6">
      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-600/15 border border-red-500 text-red-100 shadow-md shadow-red-500/20 backdrop-blur-md rounded-md">
          <AlertTitle className="text-sm font-semibold text-red-200">Lỗi đăng nhập</AlertTitle>
          <AlertDescription className="text-sm text-red-100">{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-white">Tên đăng nhập</Label>
          <Input
            id="username"
            type="text"
            {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
            className="bg-white/20 text-white placeholder-white/70 rounded-md border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-white">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
            required
            className="bg-white/20 text-white placeholder-white/70 rounded-md border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div></div>
        <Button
          type="submit"
          className="w-full
                  bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-fuchsia-500
                  transition-all duration-200 text-white font-semibold py-2 rounded-md
                  shadow-md shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/50
                  focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:ring-offset-transparent"
          disabled={loading}
        >
          {loading ? <span className="animate-pulse">Đang xử lý, vui lòng chờ...</span> : "Đăng nhập"}
        </Button>
      </form>
    </CardContent>
  )
}
