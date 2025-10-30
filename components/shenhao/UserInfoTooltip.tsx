'use client';

import { useState, useRef, useEffect } from 'react';
import { ShenhaoUser } from '../../types/shenhao';

interface UserInfoTooltipProps {
    user: ShenhaoUser;
    children: React.ReactNode;
}

export default function UserInfoTooltip({ user, children }: UserInfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<'left' | 'right'>('left');
    const [verticalPosition, setVerticalPosition] = useState<'bottom' | 'top'>('bottom');
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const formatDateTime = (dateTime?: string) => {
        if (!dateTime) return '未知';
        return new Date(dateTime).toLocaleString('zh-CN');
    };

    // 检查位置，防止超出屏幕
    useEffect(() => {
        if (isVisible && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // 检查水平位置：如果右侧空间不足，则显示在左侧
            if (rect.left + 320 > windowWidth) {
                setPosition('right');
            } else {
                setPosition('left');
            }
            
            // 检查垂直位置：如果下方空间不足（小于300px），则显示在上方
            const spaceBelow = windowHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            if (spaceBelow < 300 && spaceAbove > 250) {
                setVerticalPosition('top');
            } else {
                setVerticalPosition('bottom');
            }
        }
    }, [isVisible]);

    // 清理定时器
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        // 延迟隐藏，给用户足够时间移动到tooltip上
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 300); // 增加延迟到300ms
    };

    const handleTooltipMouseEnter = () => {
        // 鼠标进入tooltip时，取消隐藏
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const handleTooltipMouseLeave = () => {
        // 鼠标离开tooltip时，稍作延迟再隐藏
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 200);
    };

    return (
        <div ref={containerRef} className="relative inline-block">
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsVisible(!isVisible)}
                className="cursor-pointer"
            >
                {children}
            </div>
            
            {isVisible && (
                <>
                    <div 
                        className={`absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-xl transform transition-all duration-200 ease-out ${
                            position === 'left' ? 'left-0' : 'right-0'
                        } ${
                            verticalPosition === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
                        }`}
                        onMouseEnter={handleTooltipMouseEnter}
                        onMouseLeave={handleTooltipMouseLeave}
                    >
                        {/* 箭头 - 根据垂直位置调整 */}
                        <div className={`absolute w-4 h-4 bg-white border-gray-200 transform ${
                            verticalPosition === 'bottom' 
                                ? '-top-2 border-l border-t rotate-45' 
                                : '-bottom-2 border-r border-b rotate-45'
                        } ${
                            position === 'left' ? 'left-4' : 'right-4'
                        }`}></div>
                        
                        {/* 用户详细信息 */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                                {user.avatar ? (
                                    <img 
                                        className="h-12 w-12 rounded-full" 
                                        src={user.avatar} 
                                        alt={user.username}
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium text-lg">
                                            {user.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium text-gray-900">{user.username}</div>
                                    <div className="text-sm text-gray-500">UID: {user.uid}</div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-600">手机号:</span>
                                    <span className="text-sm text-gray-900">{user.phone || '未绑定'}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-600">注册时间:</span>
                                    <span className="text-sm text-gray-900">{formatDateTime(user.register_time)}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-600">最后登录:</span>
                                    <span className="text-sm text-gray-900">{formatDateTime(user.last_login_time)}</span>
                                </div>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-100">
                                <div className="text-xs text-gray-400 text-center">
                                    点击用户名或悬停查看详情
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
