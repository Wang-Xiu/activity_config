// 认证工具函数

import { JWTPayload } from '../types/auth';

// JWT Token操作
export class AuthTokenManager {
    private static readonly TOKEN_KEY = 'auth_token';
    private static readonly USER_KEY = 'auth_user';
    
    // 保存token到localStorage
    static saveToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }
    
    // 从localStorage获取token
    static getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }
    
    // 清除token
    static clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
        }
    }
    
    // 保存用户信息
    static saveUser(user: { username: string }): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }
    
    // 获取用户信息
    static getUser(): { username: string } | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem(this.USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }
    
    // 解析JWT token（简单实现，生产环境建议使用专业JWT库）
    static parseJWT(token: string): JWTPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token解析失败:', error);
            return null;
        }
    }
    
    // 检查token是否过期
    static isTokenExpired(token: string): boolean {
        const payload = this.parseJWT(token);
        if (!payload) return true;
        
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    }
    
    // 生成简单的JWT token（前端临时使用，实际应该由后端生成）
    static generateTemporaryToken(username: string): string {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };
        
        const payload = {
            username,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7天过期
            iat: Math.floor(Date.now() / 1000)
        };
        
        // 简单的base64编码（生产环境应该使用真正的JWT库）
        const encodedHeader = btoa(JSON.stringify(header));
        const encodedPayload = btoa(JSON.stringify(payload));
        
        return `${encodedHeader}.${encodedPayload}.temp_signature`;
    }
}

// API请求工具
export class ApiClient {
    private static getAuthHeaders(): HeadersInit {
        const token = AuthTokenManager.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        return headers;
    }
    
    // 通用的API请求方法
    static async request<T>(url: string, options: RequestInit = {}): Promise<T> {
        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getAuthHeaders(),
                ...options.headers,
            },
        };
        
        const response = await fetch(url, config);
        
        // 检查认证状态
        if (response.status === 401) {
            // Token无效，清除本地认证状态
            AuthTokenManager.clearToken();
            // 可以在这里触发重定向到登录页
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    }
    
    // GET请求
    static async get<T>(url: string): Promise<T> {
        return this.request<T>(url, { method: 'GET' });
    }
    
    // POST请求
    static async post<T>(url: string, data?: unknown): Promise<T> {
        return this.request<T>(url, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

// 密码验证工具
export class PasswordValidator {
    // 基本密码强度检查
    static validatePassword(password: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];
        
        if (password.length < 6) {
            errors.push('密码长度至少6位');
        }
        
        if (password.length > 50) {
            errors.push('密码长度不能超过50位');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// 用户名验证工具
export class UsernameValidator {
    // 基本用户名检查
    static validateUsername(username: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];
        
        if (!username.trim()) {
            errors.push('用户名不能为空');
        }
        
        if (username.length < 2) {
            errors.push('用户名长度至少2位');
        }
        
        if (username.length > 20) {
            errors.push('用户名长度不能超过20位');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}