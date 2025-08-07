'use client';

import { useState } from 'react';
import { LoadingButton } from '../ui/loading';
import { UsernameValidator, PasswordValidator } from '../../utils/auth';

interface LoginFormProps {
    onLogin: (username: string, password: string) => Promise<boolean>;
    isLoading?: boolean;
    error?: string | null;
}

export default function LoginForm({ onLogin, isLoading = false, error }: LoginFormProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [fieldErrors, setFieldErrors] = useState({
        username: [] as string[],
        password: [] as string[],
    });
    const [showPassword, setShowPassword] = useState(false);

    // 处理表单字段变更
    const handleFieldChange = (field: 'username' | 'password', value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // 清除该字段的错误
        setFieldErrors((prev) => ({
            ...prev,
            [field]: [],
        }));
    };

    // 表单验证
    const validateForm = (): boolean => {
        const usernameValidation = UsernameValidator.validateUsername(formData.username);
        const passwordValidation = PasswordValidator.validatePassword(formData.password);

        setFieldErrors({
            username: usernameValidation.errors,
            password: passwordValidation.errors,
        });

        return usernameValidation.isValid && passwordValidation.isValid;
    };

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onLogin(formData.username, formData.password);
        } catch (error) {
            console.error('登录失败:', error);
        }
    };

    // 处理回车键提交
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit(e as any);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名输入框 */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    用户名
                </label>
                <div className="relative">
                    <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleFieldChange('username', e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            fieldErrors.username.length > 0
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="请输入用户名"
                        disabled={isLoading}
                        autoComplete="username"
                        autoFocus
                    />

                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                </div>
                {fieldErrors.username.length > 0 && (
                    <div className="mt-1">
                        {fieldErrors.username.map((error, index) => (
                            <p key={index} className="text-sm text-red-600">
                                {error}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            {/* 密码输入框 */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    密码
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            fieldErrors.password.length > 0
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="请输入密码"
                        disabled={isLoading}
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <svg
                                className="w-5 h-5 text-gray-400 hover:text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 text-gray-400 hover:text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
                {fieldErrors.password.length > 0 && (
                    <div className="mt-1">
                        {fieldErrors.password.map((error, index) => (
                            <p key={index} className="text-sm text-red-600">
                                {error}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            {/* 错误信息显示 */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-red-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 登录按钮 */}
            <LoadingButton
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                loadingText="登录中..."
                className="w-full"
                disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
            >
                登录
            </LoadingButton>

            {/* 提示信息 */}
            <div className="text-center">
                <p className="text-sm text-gray-500">请使用管理员提供的账号和密码登录</p>
            </div>
        </form>
    );
}
