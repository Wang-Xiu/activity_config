'use client';

import { useState, useEffect } from 'react';
import { Activity } from '../types/activity';
import { MainConfig } from '../types/config';

interface ActivityConfigPageProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function ActivityConfigPage({ activity, onStatusChange }: ActivityConfigPageProps) {
    const [config, setConfig] = useState<MainConfig | null>(null);
    const [apiStatus, setApiStatus] = useState('');

    // 页面加载时自动获取配置数据
    useEffect(() => {
        fetchConfig();
    }, [activity]);

    // 获取配置数据
    const fetchConfig = async () => {
        setApiStatus('正在获取数据...');
        try {
            const response = await fetch(activity.configUrl, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setConfig(result.data);
            setApiStatus('数据获取成功');
            onStatusChange?.('数据获取成功');
            setTimeout(() => {
                setApiStatus('');
                onStatusChange?.('');
            }, 2000);
        } catch (error) {
            const errorMessage = `获取数据失败: ${(error as Error).message}`;
            setApiStatus(errorMessage);
            onStatusChange?.(errorMessage);
            setTimeout(() => {
                setApiStatus('');
                onStatusChange?.('');
            }, 3000);
        }
    };

    // 保存配置数据
    const submitConfig = async () => {
        if (!config) return;
        setApiStatus('正在提交数据...');
        try {
            const response = await fetch(activity.configUrl, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ config }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setApiStatus('数据提交成功');
            onStatusChange?.('数据提交成功');
            setTimeout(() => {
                setApiStatus('');
                onStatusChange?.('');
            }, 2000);
        } catch (error) {
            const errorMessage = `提交数据失败: ${(error as Error).message}`;
            setApiStatus(errorMessage);
            onStatusChange?.(errorMessage);
            setTimeout(() => {
                setApiStatus('');
                onStatusChange?.('');
            }, 3000);
        }
    };

    return {
        config,
        setConfig,
        apiStatus,
        fetchConfig,
        submitConfig,
    };
}