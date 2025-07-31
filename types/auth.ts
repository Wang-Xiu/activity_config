// 认证相关类型定义

// 登录请求参数
export interface LoginRequest {
    username: string;
    password: string;
}

// 登录响应数据
export interface LoginResponseData {
    token: string;
    expires_at: string;
    username: string;
}

// 登录响应格式
export interface LoginResponse {
    code: number;
    msg: string;
    data: LoginResponseData;
}

// Token验证请求参数
export interface VerifyTokenRequest {
    token: string;
}

// Token验证响应数据
export interface VerifyTokenData {
    valid: boolean;
    username?: string;
}

// Token验证响应格式
export interface VerifyTokenResponse {
    code: number;
    msg: string;
    data: VerifyTokenData;
}

// 用户信息
export interface User {
    username: string;
    loginTime?: string;
}

// 认证状态
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

// 认证上下文方法
export interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    verifyToken: () => Promise<boolean>;
    clearError: () => void;
}

// JWT Token载荷
export interface JWTPayload {
    username: string;
    exp: number;
    iat: number;
}