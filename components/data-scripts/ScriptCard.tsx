'use client';

import { useState } from 'react';
import { DataScript, ScriptParameter } from '../../types/data-scripts';

interface ScriptCardProps {
    script: DataScript;
}

export default function ScriptCard({ script }: ScriptCardProps) {
    const [selectedParams, setSelectedParams] = useState<Record<string, { enabled: boolean; value: string }>>(() => {
        const initial: Record<string, { enabled: boolean; value: string }> = {};
        script.params.forEach(param => {
            initial[param.name] = {
                enabled: param.required,
                value: param.default || ''
            };
        });
        return initial;
    });

    const handleParamToggle = (paramName: string) => {
        setSelectedParams(prev => ({
            ...prev,
            [paramName]: {
                ...prev[paramName],
                enabled: !prev[paramName].enabled
            }
        }));
    };

    const handleParamValueChange = (paramName: string, value: string) => {
        setSelectedParams(prev => ({
            ...prev,
            [paramName]: {
                ...prev[paramName],
                value
            }
        }));
    };

    const handleAccessScript = () => {
        // 构建URL参数（使用 & 符号拼接）
        const paramParts: string[] = [];
        
        Object.entries(selectedParams).forEach(([paramName, paramData]) => {
            if (paramData.enabled && paramData.value) {
                paramParts.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(paramData.value)}`);
            }
        });

        // 构建完整URL
        // 如果原URL已经包含参数，使用 & 连接；否则使用 ?
        const separator = script.url.includes('?') ? '&' : '?';
        const fullUrl = paramParts.length > 0 
            ? `${script.url}${separator}${paramParts.join('&')}`
            : script.url;
        
        console.log('访问脚本URL:', fullUrl); // 添加日志便于调试
        
        // 在新窗口打开
        window.open(fullUrl, '_blank');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* 脚本头部 */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{script.name}</h3>
                {script.description && (
                    <p className="text-sm text-gray-600">{script.description}</p>
                )}
                <div className="mt-2">
                    <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                        {script.url}
                    </div>
                </div>
            </div>

            {/* 参数配置区域 */}
            {script.params && script.params.length > 0 ? (
                <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">参数配置</h4>
                    {script.params.map(param => (
                        <div key={param.name} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                            {/* 启用复选框 */}
                            <div className="flex items-center pt-1">
                                <input
                                    type="checkbox"
                                    id={`${script.id}-${param.name}`}
                                    checked={selectedParams[param.name]?.enabled || false}
                                    onChange={() => handleParamToggle(param.name)}
                                    disabled={param.required}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* 参数信息和输入 */}
                            <div className="flex-1">
                                <label 
                                    htmlFor={`${script.id}-${param.name}`}
                                    className="flex items-center space-x-2 mb-1"
                                >
                                    <span className="text-sm font-medium text-gray-700">
                                        {param.label || param.name}
                                    </span>
                                    {param.required && (
                                        <span className="text-xs text-red-500">*必填</span>
                                    )}
                                </label>
                                
                                {param.description && (
                                    <p className="text-xs text-gray-500 mb-2">{param.description}</p>
                                )}

                                <input
                                    type={param.type === 'date' ? 'date' : 'text'}
                                    value={selectedParams[param.name]?.value || ''}
                                    onChange={(e) => handleParamValueChange(param.name, e.target.value)}
                                    disabled={!selectedParams[param.name]?.enabled}
                                    placeholder={param.placeholder || param.default || `请输入${param.label || param.name}`}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded">
                    此脚本无需配置参数
                </div>
            )}

            {/* 访问按钮 */}
            <button
                onClick={handleAccessScript}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                访问脚本
            </button>
        </div>
    );
}

