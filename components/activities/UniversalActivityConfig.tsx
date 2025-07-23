'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Activity } from '../../types/activity';
import { MainConfig } from '../../types/config';
import useActivityConfig from '../../utils/useActivityConfig';

interface UniversalActivityConfigProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

// 通用配置渲染器组件
interface ConfigRendererProps {
    data: any;
    path: string[];
    onChange: (path: string[], value: any) => void;
    level?: number;
    searchTerm?: string;
    onFoundItem?: (key: string, path: string[]) => void;
}

function ConfigRenderer({ 
    data, 
    path, 
    onChange, 
    level = 0, 
    searchTerm = '',
    onFoundItem
}: ConfigRendererProps) {
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

    // 切换展开/折叠状态
    const toggleExpanded = (key: string) => {
        const newExpanded = new Set(expandedKeys);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedKeys(newExpanded);
    };

    // 判断值的类型
    const getValueType = (value: any): string => {
        if (value === null || value === undefined) return 'null';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object') {
            // 检查是否是礼物信息对象
            if (value.gift_id !== undefined && value.gift_type !== undefined) {
                return 'gift';
            }
            return 'object';
        }
        if (typeof value === 'boolean') return 'boolean';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'string') {
            // 检查是否是时间格式
            if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
                return 'datetime';
            }
            // 检查是否是时间格式（仅时间）
            if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
                return 'time';
            }
            // 检查是否是长文本
            if (value.length > 50 || value.includes('\n')) {
                return 'textarea';
            }
            return 'string';
        }
        return 'unknown';
    };

    // 检查是否匹配搜索词
    const isMatchSearch = useCallback((key: string, value: any): boolean => {
        if (!searchTerm) return false;
        
        const searchLower = searchTerm.toLowerCase();
        const keyLower = key.toLowerCase();
        const valueStr = String(value).toLowerCase();
        
        return keyLower.includes(searchLower) || valueStr.includes(searchLower);
    }, [searchTerm]);

    // 递归检查对象或数组是否包含匹配项
    const checkHasMatchingChildren = useCallback((data: any, currentPath: string[]): boolean => {
        if (!searchTerm) return false;
        
        if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
                return data.some((item, index) => 
                    checkHasMatchingChildren(item, [...currentPath, index.toString()])
                );
            } else {
                return Object.entries(data).some(([key, value]) => {
                    const itemPath = [...currentPath, key];
                    return isMatchSearch(key, value) || checkHasMatchingChildren(value, itemPath);
                });
            }
        }
        return false;
    }, [searchTerm, isMatchSearch]);

    // 高亮显示匹配文本
    const highlightMatch = (text: string): React.ReactNode => {
        if (!searchTerm) return text;
        
        const searchLower = searchTerm.toLowerCase();
        const textLower = text.toLowerCase();
        const index = textLower.indexOf(searchLower);
        
        if (index === -1) return text;
        
        return (
            <>
                {text.substring(0, index)}
                <span className="bg-yellow-200 font-bold">{text.substring(index, index + searchTerm.length)}</span>
                {text.substring(index + searchTerm.length)}
            </>
        );
    };

    // 自动展开包含匹配项的节点 - 使用useEffect避免在渲染中更新状态
    useEffect(() => {
        if (searchTerm && data) {
            const newExpanded = new Set<string>();
            
            const expandMatchingNodes = (currentData: any, currentPath: string[]) => {
                if (typeof currentData === 'object' && currentData !== null) {
                    if (Array.isArray(currentData)) {
                        currentData.forEach((item, index) => {
                            const itemPath = [...currentPath, index.toString()];
                            if (checkHasMatchingChildren(item, itemPath)) {
                                const key = currentPath[currentPath.length - 1];
                                if (key) newExpanded.add(key);
                            }
                            expandMatchingNodes(item, itemPath);
                        });
                    } else {
                        Object.entries(currentData).forEach(([key, value]) => {
                            const itemPath = [...currentPath, key];
                            if (isMatchSearch(key, value) || checkHasMatchingChildren(value, itemPath)) {
                                newExpanded.add(key);
                            }
                            expandMatchingNodes(value, itemPath);
                        });
                    }
                }
            };
            
            expandMatchingNodes(data, path);
            setExpandedKeys(newExpanded);
        }
    }, [searchTerm, data, path, checkHasMatchingChildren, isMatchSearch]); // 注意：移除了expandedKeys依赖以避免循环

    // 渲染数组项
    const renderArrayItem = (item: any, index: number, arrayPath: string[]) => {
        const itemPath = [...arrayPath, index.toString()];
        const itemType = getValueType(item);

        return (
            <div key={index} className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500 w-8">{index}</span>
                <div className="flex-1">
                    {itemType === 'object' ? (
                        <div className="border border-gray-200 rounded p-2">
                            <ConfigRenderer
                                data={item}
                                path={itemPath}
                                onChange={onChange}
                                level={level + 1}
                                searchTerm={searchTerm}
                                onFoundItem={onFoundItem}
                            />
                        </div>
                    ) : (
                        renderInput(item, itemPath, itemType)
                    )}
                </div>
                <button
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    onClick={() => {
                        const newArray = [...(data as any[])];
                        newArray.splice(index, 1);
                        onChange(arrayPath, newArray);
                    }}
                >
                    删除
                </button>
            </div>
        );
    };

    // 渲染输入框
    const renderInput = (value: any, inputPath: string[], type: string) => {
        const handleChange = (newValue: any) => {
            onChange(inputPath, newValue);
        };

        switch (type) {
            case 'boolean':
                return (
                    <div className="flex items-center space-x-4">
                        <button
                            className={`px-3 py-1 rounded ${value === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleChange(true)}
                        >
                            是
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${value === false ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleChange(false)}
                        >
                            否
                        </button>
                    </div>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                );

            case 'datetime':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="YYYY-MM-DD HH:MM:SS"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                );

            case 'time':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="HH:MM:SS"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                    />
                );

            case 'gift':
                return (
                    <div className="border border-gray-200 rounded p-3 bg-gray-50">
                        <div className="text-sm text-gray-600 mb-2">礼物信息（只读）</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>ID: {value.gift_id}</div>
                            <div>类型: {value.gift_type}</div>
                            <div>数量: {value.gift_num}</div>
                            <div>概率: {value.real_probability}</div>
                            {value.remark && <div className="col-span-2">备注: {value.remark}</div>}
                        </div>
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                );
        }
    };

    // 渲染对象的每个属性
    const renderObjectProperty = (key: string, value: any) => {
        const propertyPath = [...path, key];
        const valueType = getValueType(value);
        const isExpanded = expandedKeys.has(key);
        const isMatch = isMatchSearch(key, value);
        
        // 使用局部变量避免函数名冲突
        let hasChildrenMatch = false;
        if (searchTerm) {
            hasChildrenMatch = typeof value === 'object' && value !== null && 
                   (isMatchSearch(key, value) || checkHasMatchingChildren(value, propertyPath));
        }

        // 跳过注释字段（以特殊字符开头的字段）
        if (key.includes('↓') || key.includes('注释') || key.includes('说明')) {
            return null;
        }

        // 如果正在搜索且当前项不匹配，隐藏该项
        if (searchTerm && !isMatch && !hasChildrenMatch) {
            return null;
        }

        return (
            <div key={key} className={`mb-4 ${isMatch ? 'bg-yellow-50 p-2 rounded border border-yellow-300' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {highlightMatch(key)}
                        <span className="ml-2 text-xs text-gray-500">({valueType})</span>
                    </label>
                    {(valueType === 'object' || valueType === 'array') && (
                        <button
                            className="text-sm text-blue-500 hover:text-blue-700"
                            onClick={() => toggleExpanded(key)}
                        >
                            {isExpanded ? '折叠' : '展开'}
                        </button>
                    )}
                </div>

                {valueType === 'array' ? (
                    <div className={`${isExpanded ? 'block' : 'hidden'}`}>
                        <div className="border border-gray-200 rounded p-3">
                            <div className="mb-2">
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                    onClick={() => {
                                        const newArray = [...(value as any[])];
                                        // 根据数组现有元素类型添加新元素
                                        if (newArray.length > 0) {
                                            const firstItemType = getValueType(newArray[0]);
                                            if (firstItemType === 'string') {
                                                newArray.push('');
                                            } else if (firstItemType === 'number') {
                                                newArray.push(0);
                                            } else if (firstItemType === 'object') {
                                                newArray.push({});
                                            } else {
                                                newArray.push('');
                                            }
                                        } else {
                                            newArray.push('');
                                        }
                                        onChange(propertyPath, newArray);
                                    }}
                                >
                                    添加项目
                                </button>
                            </div>
                            {(value as any[]).map((item, index) =>
                                renderArrayItem(item, index, propertyPath)
                            )}
                        </div>
                    </div>
                ) : valueType === 'object' ? (
                    <div className={`${isExpanded ? 'block' : 'hidden'}`}>
                        <div className="border border-gray-200 rounded p-3">
                            <ConfigRenderer
                                data={value}
                                path={propertyPath}
                                onChange={onChange}
                                level={level + 1}
                                searchTerm={searchTerm}
                            />
                        </div>
                    </div>
                ) : (
                    renderInput(value, propertyPath, valueType)
                )}
            </div>
        );
    };

    if (data === null || data === undefined) {
        return <div className="text-gray-500">无数据</div>;
    }

    if (Array.isArray(data)) {
        return (
            <div>
                {data.map((item, index) => renderArrayItem(item, index, path))}
            </div>
        );
    }

    if (typeof data === 'object') {
        return (
            <div className={`space-y-4 ${level > 0 ? 'pl-4' : ''}`}>
                {Object.entries(data).map(([key, value]) =>
                    renderObjectProperty(key, value)
                )}
            </div>
        );
    }

    return renderInput(data, path, getValueType(data));
}

export default function UniversalActivityConfig({ activity, onStatusChange }: UniversalActivityConfigProps) {
    const [activeTab, setActiveTab] = useState('config');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Array<{key: string, path: string[], label: string}>>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    const { config, setConfig, apiStatus, fetchConfig, submitConfig } = useActivityConfig<MainConfig>({
        activity,
        onStatusChange,
    });

    // 更新配置字段的处理函数
    const handleConfigChange = (path: string[], value: any) => {
        if (!config) return;

        // 创建配置的深拷贝
        const newConfig = JSON.parse(JSON.stringify(config));

        // 根据路径更新配置
        let current = newConfig;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;

        // 更新配置状态
        setConfig(newConfig);
    };

    // 处理搜索 - 使用useCallback避免重复创建函数
    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        // 搜索结果将在useEffect中计算
    }, []);

    // 使用useEffect计算搜索结果，避免在渲染过程中更新状态
    useEffect(() => {
        if (searchTerm && config) {
            const results: Array<{key: string, path: string[], label: string}> = [];
            
            const searchInObject = (obj: any, currentPath: string[], label: string) => {
                if (typeof obj === 'object' && obj !== null) {
                    Object.entries(obj).forEach(([key, value]) => {
                        const newPath = [...currentPath, key];
                        const newLabel = label ? `${label} > ${key}` : key;
                        
                        if (key.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            String(value).toLowerCase().includes(searchTerm.toLowerCase())) {
                            results.push({
                                key,
                                path: newPath,
                                label: newLabel
                            });
                        }
                        
                        if (typeof value === 'object' && value !== null) {
                            searchInObject(value, newPath, newLabel);
                        }
                    });
                }
            };
            
            searchInObject(config, [], '');
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, config]);

    // 跳转到搜索结果 - 使用状态提升来管理展开状态
    const jumpToResult = (result: {path: string[]}) => {
        // 构建需要展开的所有父节点路径
        const pathsToExpand = new Set<string>();
        let currentPath: string[] = [];
        
        result.path.forEach((segment, index) => {
            if (index < result.path.length - 1) {
                currentPath = [...currentPath, segment];
                pathsToExpand.add(segment);
            }
        });
        
        // 通过URL参数或全局状态传递展开信息
        // 这里简化处理，实际应该通过状态提升或context
        console.log('需要展开的节点:', Array.from(pathsToExpand));
    };

    if (!config) {
        return <div className="flex items-center justify-center h-full">加载中...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            {/* 标签页导航 */}
            <div className="flex space-x-4 mb-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'config' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('config')}
                >
                    配置编辑
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'json' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('json')}
                >
                    JSON预览
                </button>
            </div>

            {/* 搜索栏 */}
            {activeTab === 'config' && (
                <div className="mb-4 bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="搜索配置项..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSearchResults([]);
                                    searchInputRef.current?.focus();
                                }}
                                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                清除
                            </button>
                        )}
                    </div>
                    
                    {searchResults.length > 0 && (
                        <div className="mt-4 border-t pt-3">
                            <div className="text-sm text-gray-600 mb-2">搜索到 {searchResults.length} 个结果：</div>
                            <div className="max-h-48 overflow-y-auto space-y-1">
                                {searchResults.map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() => jumpToResult(result)}
                                        className="block w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border text-blue-700"
                                        title={`跳转到：${result.label}`}
                                    >
                                        <div className="truncate">{result.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'config' ? (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">通用配置编辑器</h3>
                        <ConfigRenderer
                            data={config}
                            path={[]}
                            onChange={handleConfigChange}
                            searchTerm={searchTerm}
                        />
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">JSON配置预览</h3>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(config, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* API操作按钮和状态 */}
            <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="space-x-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={fetchConfig}
                    >
                        获取配置
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={submitConfig}
                    >
                        保存配置
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => setConfig(null)}
                    >
                        重置配置
                    </button>
                </div>
                {apiStatus && (
                    <div className="text-sm text-gray-600">{apiStatus}</div>
                )}
            </div>
        </div>
    );
}