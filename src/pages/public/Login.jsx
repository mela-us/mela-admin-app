import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, CircleAlert, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { state, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.isAuthenticated) {
      switch (state.user?.role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'contributor':
          navigate('/dashboard');
          break;
        default:
          break;
      }
    }
  }, [state.isAuthenticated, state.user?.role, navigate]);

  const usernameRequirements = [
    {
      label: 'Username not empty',
      test: (username) => username.length >= 1,
    },
  ];

  const passwordRequirements = [
    {
      label: 'Password not empty',
      test: (password) => password.length >= 1,
    },
  ];

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
      password: Yup.string().required('Vui lòng nhập mật khẩu'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      await login(values.username, values.password);
      setIsLoading(false);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <Card className="w-full max-w-md rounded-2xl px-6 py-4 text-white bg-[#3a005caa] backdrop-blur-xl border border-white/20 ring-1 ring-fuchsia-500/20 shadow-2xl shadow-purple-900/50">
        <CardHeader className="space-y-1 pb-4 border-b border-white/20">
          <CardTitle className="text-3xl font-bold text-white text-center">MELA</CardTitle>
          <CardDescription className="text-center text-gray-200">
            Đăng nhập để quản lý nội dung toán học
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {state.authError && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-600/15 border border-red-500 text-red-100 shadow-md shadow-red-500/20 backdrop-blur-md rounded-md"
            >
              <AlertTitle className="text-sm font-semibold text-red-200 flex items-center gap-2">
                <CircleAlert className="w-5 h-5 text-red-500" />
                Lỗi đăng nhập
              </AlertTitle>
              <AlertDescription className="text-sm text-red-100 flex justify-between items-center">
                <span>{state.authError}</span>
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-white">
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-white/20 text-white placeholder-white/70 rounded-md border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="password" className="text-sm font-medium text-white">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white/20 text-white placeholder-white/70 rounded-md border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white hover:text-indigo-400 transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {(formik.values.username || formik.values.password) && (
              <div className="p-5 bg-gray-800/30 rounded-lg border border-white/20 mt-4">
                <p className="text-xs text-gray-400 mb-2 font-medium">
                  Yêu cầu tên đăng nhập
                </p>
                <div className="space-y-1.5 mb-2">
                  {usernameRequirements.map((req, index) => {
                    const isValid = req.test(formik.values.username);
                    return (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isValid
                              ? 'bg-purple-500/20 border border-indigo-500/50'
                              : 'bg-gray-700/50 border border-gray-600/50'
                          }`}
                        >
                          {isValid ? (
                            <svg
                              className="w-2.5 h-2.5 text-indigo-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                          )}
                        </div>
                        <span
                          className={`transition-all duration-200 ${
                            isValid ? 'text-indigo-400' : 'text-gray-500'
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mb-2 font-medium">
                  Yêu cầu mật khẩu
                </p>
                <div className="space-y-1.5">
                  {passwordRequirements.map((req, index) => {
                    const isValid = req.test(formik.values.password);
                    return (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isValid
                              ? 'bg-purple-500/20 border border-indigo-500/50'
                              : 'bg-gray-700/50 border border-gray-600/50'
                          }`}
                        >
                          {isValid ? (
                            <svg
                              className="w-2.5 h-2.5 text-indigo-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                          )}
                        </div>
                        <span
                          className={`transition-all duration-200 ${
                            isValid ? 'text-indigo-400' : 'text-gray-500'
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-fuchsia-500 transition-all duration-200 text-white font-semibold py-2 rounded-md shadow-md shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/50 mt-6"
              disabled={isLoading || Object.keys(formik.errors).length > 0}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
