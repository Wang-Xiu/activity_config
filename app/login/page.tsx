'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../components/auth/AuthProvider';
import { useToast, ToastContainer } from '../../components/Toast';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); // 使用AuthProvider的login方法
    const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

    // 获取重定向目标页面
    const redirectTo = searchParams.get('redirect') || '/';

    useEffect(() => {
        setMounted(true);
        // 不再在这里检查登录状态，让AuthGuard统一处理
    }, []); // 只设置mounted状态

    // 处理登录
    const handleLogin = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            // 使用AuthProvider的login方法
            const success = await login(username, password);
            
            if (success) {
                showSuccess('登录成功！正在跳转...');
                
                // 延迟跳转，让AuthGuard处理状态变化
                setTimeout(() => {
                    router.replace(redirectTo);
                }, 1000);
                
                return true;
            } else {
                setError('登录失败，请检查用户名和密码');
                showError('登录失败');
                return false;
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            const errorMessage = '网络连接失败，请检查网络后重试';
            setError(errorMessage);
            showError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 服务器端渲染时显示加载状态
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* 登录卡片 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* 头部 */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            声吧活动配置管理
                        </h1>
                        <p className="text-gray-600">
                            请登录您的管理员账号
                        </p>
                    </div>

                    {/* 登录表单 */}
                    <LoginForm
                        onLogin={handleLogin}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>

                {/* 底部信息 */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        © 2024 声吧活动配置管理系统
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        安全登录 · 数据保护
                    </p>
                </div>
            </div>

            {/* Toast 提示容器 */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}