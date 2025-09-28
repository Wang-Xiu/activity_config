'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthContextType, AuthState, User } from '../../types/auth';
import { AuthTokenManager } from '../../utils/auth';

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证状态的初始值
const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
    error: null,
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [authState, setAuthState] = useState<AuthState>(initialAuthState);

    // 设置认证状态 - 使用useCallback但不依赖任何状态
    const setAuthData = useCallback(
        (isAuthenticated: boolean, user: User | null, token: string | null) => {
            setAuthState({
                isAuthenticated,
                user,
                token,
                isLoading: false,
                error: null,
            });
        },
        [],
    );

    // 设置错误状态 - 使用useCallback但不依赖任何状态
    const setError = useCallback((error: string) => {
        setAuthState((prev) => ({
            ...prev,
            error,
            isLoading: false,
        }));
    }, []);

    // 清除错误 - 使用useCallback但不依赖任何状态
    const clearError = useCallback(() => {
        setAuthState((prev) => ({
            ...prev,
            error: null,
        }));
    }, []);

    // 验证token
    const verifyToken = useCallback(async (): Promise<boolean> => {
        const token = AuthTokenManager.getToken();

        if (!token) {
            setAuthData(false, null, null);
            return false;
        }

        // 检查token是否过期（客户端检查）
        if (AuthTokenManager.isTokenExpired(token)) {
            AuthTokenManager.clearToken();
            setAuthData(false, null, null);
            return false;
        }

        try {
            // 调用后端验证token
            const { postToNextjsApi } = await import('../../utils/frontendApiClient');
            const response = await postToNextjsApi('/api/auth/verify', { token });

            const result = await response.json();

            if (result.success && result.data.valid) {
                // 如果后端返回用户名，使用后端数据；否则使用本地存储的用户信息
                const username = result.data.username || AuthTokenManager.getUser()?.username;
                const user: User = {
                    username: username || 'unknown',
                    loginTime: AuthTokenManager.getUser()?.loginTime,
                };
                setAuthData(true, user, token);
                return true;
            } else {
                // Token无效，清除本地存储
                AuthTokenManager.clearToken();
                setAuthData(false, null, null);
                return false;
            }
        } catch (error) {
            console.error('Token验证失败:', error);
            // 网络错误时保持当前状态，但设置错误信息
            setError('网络连接失败，请检查网络连接');
            return false;
        }
    }, [setAuthData, setError]);

    // 登录函数
    const login = useCallback(
        async (username: string, password: string): Promise<boolean> => {
            try {
                clearError();
                setAuthState((prev) => ({ ...prev, isLoading: true }));

                const { postToNextjsApi } = await import('../../utils/frontendApiClient');
                const response = await postToNextjsApi('/api/auth/login', { username, password });

                const result = await response.json();

                if (result.success) {
                    // 保存token和用户信息
                    AuthTokenManager.saveToken(result.data.token);
                    AuthTokenManager.saveUser({
                        username: result.data.user.username,
                    });

                    const user: User = {
                        username: result.data.user.username,
                        loginTime: result.data.user.login_time,
                    };

                    setAuthData(true, user, result.data.token);
                    return true;
                } else {
                    setError(result.message || '登录失败');
                    return false;
                }
            } catch (error) {
                console.error('登录失败:', error);
                setError('网络连接失败，请检查网络后重试');
                return false;
            }
        },
        [setAuthData, setError, clearError],
    );

    // 登出函数
    const logout = useCallback(() => {
        AuthTokenManager.clearToken();
        setAuthData(false, null, null);
    }, [setAuthData]);

    // 初始化认证状态
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('[AuthProvider] 初始化认证状态...');
            const token = AuthTokenManager.getToken();

            if (!token) {
                setAuthData(false, null, null);
                return;
            }

            // 检查token是否过期（客户端检查）
            if (AuthTokenManager.isTokenExpired(token)) {
                AuthTokenManager.clearToken();
                setAuthData(false, null, null);
                return;
            }

            try {
                // 调用后端验证token
                const response = await fetch('/api/auth/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const result = await response.json();

                if (result.success && result.data.valid) {
                    // 如果后端返回用户名，使用后端数据；否则使用本地存储的用户信息
                    const username = result.data.username || AuthTokenManager.getUser()?.username;
                    const user: User = {
                        username: username || 'unknown',
                        loginTime: AuthTokenManager.getUser()?.loginTime,
                    };
                    setAuthData(true, user, token);
                } else {
                    // Token无效，清除本地存储
                    AuthTokenManager.clearToken();
                    setAuthData(false, null, null);
                }
            } catch (error) {
                console.error('Token验证失败:', error);
                // 网络错误时设置为未认证状态
                setAuthData(false, null, null);
            }
        };

        initializeAuth();
    }, []); // 只在组件挂载时执行一次

    // 定期验证token（优化：减少不必要的验证）
    useEffect(() => {
        if (!authState.isAuthenticated) return;

        // 只在长时间无操作时才定期验证，而不是频繁验证
        const interval = setInterval(
            async () => {
                const token = AuthTokenManager.getToken();

                // 首先进行客户端检查，避免不必要的网络请求
                if (!token || AuthTokenManager.isTokenExpired(token)) {
                    AuthTokenManager.clearToken();
                    setAuthData(false, null, null);
                    return;
                }

                // 检查token是否即将过期（剩余时间少于1小时）
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const expiresAt = tokenData.exp * 1000;
                const oneHour = 60 * 60 * 1000;

                // 只有在token即将过期时才进行后端验证
                if (expiresAt - Date.now() < oneHour) {
                    try {
                        const response = await fetch('/api/auth/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ token }),
                        });

                        const result = await response.json();

                        if (!result.success || !result.data.valid) {
                            AuthTokenManager.clearToken();
                            setAuthData(false, null, null);
                        }
                    } catch (error) {
                        console.error('定期Token验证失败:', error);
                        // 网络错误时不做处理，保持当前状态
                    }
                }
            },
            30 * 60 * 1000,
        ); // 每30分钟检查一次

        return () => clearInterval(interval);
    }, [authState.isAuthenticated, setAuthData]);

    const contextValue: AuthContextType = {
        ...authState,
        login,
        logout,
        verifyToken,
        clearError,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// 使用认证上下文的Hook
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// 检查是否已认证的Hook
export function useRequireAuth(): AuthContextType {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            // 可以在这里处理未认证的情况，比如重定向到登录页
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                const redirectUrl =
                    currentPath !== '/login' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
                window.location.href = `/login${redirectUrl}`;
            }
        }
    }, [auth.isAuthenticated, auth.isLoading]);

    return auth;
}
