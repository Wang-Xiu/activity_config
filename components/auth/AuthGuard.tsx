'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { LoadingSpinner } from '../ui/loading';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // 如果认证状态还在加载中，等待
        if (isLoading) {
            return;
        }

        // 如果当前页面是登录页，不需要认证检查
        if (pathname === '/login') {
            setIsChecking(false);
            return;
        }

        // 如果未认证，重定向到登录页
        if (!isAuthenticated) {
            const redirectUrl = pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : '';
            router.replace(`/login${redirectUrl}`);
            return;
        }

        // 认证通过
        setIsChecking(false);
    }, [isAuthenticated, isLoading, pathname, router]);

    // 显示加载状态
    if (isLoading || isChecking) {
        return (
            fallback || (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
                        <div className="text-center">
                            <LoadingSpinner size="xl" color="blue" className="mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                验证登录状态
                            </h2>
                            <p className="text-gray-600">正在验证您的登录状态，请稍候...</p>
                        </div>
                    </div>
                </div>
            )
        );
    }

    // 如果在登录页且已认证，显示已登录状态
    if (pathname === '/login' && isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">您已登录</h1>
                        <p className="text-gray-600 mb-6">欢迎回来，{user?.username}</p>
                        <button
                            onClick={() => router.replace('/')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            进入系统
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 如果未认证且不在登录页，不渲染内容（等待重定向）
    if (!isAuthenticated && pathname !== '/login') {
        return null;
    }

    // 渲染受保护的内容
    return <>{children}</>;
}
