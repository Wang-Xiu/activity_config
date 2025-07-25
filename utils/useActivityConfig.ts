'use client';

import { useState, useEffect } from 'react';
import { Activity } from '../types/activity';

interface UseActivityConfigProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

interface UseActivityConfigReturn<T> {
    config: T | null;
    setConfig: (config: T | null) => void;
    apiStatus: string;
    fetchConfig: () => void;
    submitConfig: () => void;
}

export default function useActivityConfig<T>({ activity, onStatusChange }: UseActivityConfigProps): UseActivityConfigReturn<T> {
    const [config, setConfig] = useState<T | null>(null);
    const [apiStatus, setApiStatus] = useState<string>('');

    const fetchConfig = async () => {
        try {
            setApiStatus('正在获取配置...');
            const response = await fetch(`/api/${activity.type}/config?activity_id=${activity.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setConfig(data.data as T);
                setApiStatus('配置获取成功');
                onStatusChange?.('loaded');
            } else {
                throw new Error(data.message || '获取配置失败');
            }
        } catch (error) {
            console.error('获取配置错误:', error);
            setApiStatus(`获取配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
            onStatusChange?.('error');
        }
    };

    const submitConfig = async () => {
        if (!config) {
            setApiStatus('没有配置可保存');
            return;
        }

        try {
            setApiStatus('正在保存配置...');
            const response = await fetch(`/api/config/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activity_id: activity.id,
                    activity_type: activity.type,
                    config: config,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setApiStatus('配置保存成功');
                onStatusChange?.('saved');
            } else {
                throw new Error(data.message || '保存配置失败');
            }
        } catch (error) {
            console.error('保存配置错误:', error);
            setApiStatus(`保存配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
            onStatusChange?.('error');
        }
    };

    useEffect(() => {
        if (activity?.id) {
            fetchConfig();
        }
    }, [activity?.id]);

    return {
        config,
        setConfig,
        apiStatus,
        fetchConfig,
        submitConfig,
    };
}