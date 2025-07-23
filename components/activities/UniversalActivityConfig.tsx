'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Activity } from '../../types/activity';
import { UniversalConfig } from '../../types/config';
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
    getDisplayFieldName?: (fieldName: string) => string;
    isPureEnglish?: (str: string) => boolean;
}

function ConfigRenderer({ 
    data, 
    path, 
    onChange, 
    level = 0, 
    searchTerm = '',
    onFoundItem,
    getDisplayFieldName = (name) => name,
    isPureEnglish = (str) => /^[a-zA-Z0-9_]+$/.test(str)
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

    // 检查是否匹配搜索词 - 支持原名称和映射名称
    const isMatchSearch = useCallback((key: string, value: any): boolean => {
        if (!searchTerm) return false;
        
        const searchLower = searchTerm.toLowerCase();
        const originalKey = key.toLowerCase();
        const displayKey = getDisplayFieldName(key).toLowerCase();
        const valueStr = String(value).toLowerCase();
        
        // 同时搜索原字段名、显示名和值
        return originalKey.includes(searchLower) || 
               displayKey.includes(searchLower) || 
               valueStr.includes(searchLower);
    }, [searchTerm, getDisplayFieldName]);

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
                    // 跳过非纯英文键的字段
                    if (!isPureEnglish(key)) {
                        return false;
                    }
                    
                    const itemPath = [...currentPath, key];
                    return isMatchSearch(key, value) || checkHasMatchingChildren(value, itemPath);
                });
            }
        }
        return false;
    }, [searchTerm, isMatchSearch, isPureEnglish]);

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
                            // 跳过非纯英文键的字段
                            if (!isPureEnglish(key)) {
                                return;
                            }
                            
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
    }, [searchTerm, data, path, checkHasMatchingChildren, isMatchSearch, isPureEnglish]); // 注意：移除了expandedKeys依赖以避免循环

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
                                getDisplayFieldName={getDisplayFieldName}
                                isPureEnglish={isPureEnglish}
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
        const displayKey = getDisplayFieldName(key);
        
        // 使用局部变量避免函数名冲突
        let hasChildrenMatch = false;
        if (searchTerm) {
            hasChildrenMatch = typeof value === 'object' && value !== null && 
                   (isMatchSearch(key, value) || checkHasMatchingChildren(value, propertyPath));
        }

        // 跳过非纯英文键的字段
        if (!isPureEnglish(key)) {
            return null;
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
                        {highlightMatch(displayKey)}
                        <span className="ml-2 text-xs text-gray-500">({valueType})</span>
                    </label>
                    {(valueType === 'object' || valueType === 'array') && (
                        <button
                            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md border transition-all duration-200 ${
                                isExpanded 
                                    ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' 
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleExpanded(key)}
                        >
                            <span className="mr-1">
                                {isExpanded ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </span>
                            {isExpanded ? '收起' : '展开'}
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
                                getDisplayFieldName={getDisplayFieldName}
                                isPureEnglish={isPureEnglish}
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
    const [activityId, setActivityId] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // 字段名称映射配置 - 内部配置
    const fieldNameMapping: {[key: string]: string} = {
        'mission_pool': '任务池配置',
        'new_user': '新用户任务',
        'old_user': '老用户任务',
        'open_box_config': '开宝箱配置',
        'free_box_time_1': '免费宝箱时间1',
        'free_box_time_2': '免费宝箱时间2',
        'send_gift_get_box': '送礼得宝箱',
        'get_gift_send_hat': '收礼送尾巴',
        'happy_birthday_config': '生日配置',
        'origin_price': '原价',
        'now_price': '现价',
        'mission_list': '任务列表',
        'get_flower_prize': '鲜花奖励',
        'all_stone': '宝石配置',
        'wash_hands_config': '洗手池配置',
        'day_chance': '每日次数',
        'prop_img': '道具图片',
        'quarter_prize': '季度奖励',
        'gift_id': '礼物ID',
        'gift_type': '礼物类型',
        'gift_num': '礼物数量',
        'real_probability': '真实概率',
        'gift_name': '礼物名称',
        'gift_img': '礼物图片',
        'get_prop_num': '获得道具数量',
        'hat_gift_info': '尾巴礼物信息',
        'need_flower': '所需鲜花',
        'format_price': '格式化价格',
        'remark': '备注',
        'desc': '描述',
        'need': '需要',
        'get': '获得',
        'type': '类型',
        'sort': '排序',
        'need_gift_ids': '需要的礼物ID',
        'msg_list': '消息列表',
        'name': '名称',
        'value': '数值',
        'probability': '概率',
        'pool': '奖池',
        'start': '开始时间',
        'end': '结束时间'
    };
    
    const { config, setConfig, apiStatus, fetchConfig, submitConfig } = useActivityConfig<UniversalConfig>({
        activity,
        onStatusChange,
    });

    // 获取指定活动ID的配置
    const fetchConfigById = async () => {
        if (!activityId.trim()) {
            alert('请先输入活动ID');
            return;
        }
        
        try {
            onStatusChange?.('loading');
            const url = `/api/universal/config?activityId=${encodeURIComponent(activityId)}`;
            console.log('正在调用API:', url);
            
            const response = await fetch(url, {
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
                setConfig(data.data);
                onStatusChange?.('loaded');
                alert(`活动ID ${activityId} 的配置获取成功`);
            } else {
                throw new Error(data.message || '获取配置失败');
            }
        } catch (error) {
            console.error('获取配置错误:', error);
            alert(`获取配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
            onStatusChange?.('error');
        }
    };

    // 更新缓存
    const handleUpdateCache = async () => {
        try {
            // TODO: 调用更新缓存API
            console.log('更新缓存API调用待实现');
            alert('更新缓存功能待实现');
        } catch (error) {
            console.error('更新缓存失败:', error);
            alert('更新缓存失败');
        }
    };

    // 重置配置功能
    const handleResetConfig = async () => {
        if (!confirm('确定要重置配置吗？这将清空当前所有修改并重新获取默认配置。')) {
            return;
        }
        
        try {
            onStatusChange?.('loading');
            // 先清空当前配置
            setConfig(null);
            
            // 重新获取默认配置
            const response = await fetch('/api/universal/config', {
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
                setConfig(data.data);
                onStatusChange?.('loaded');
                // 清空活动ID和搜索
                setActivityId('');
                setSearchTerm('');
                setSearchResults([]);
                alert('配置重置成功');
            } else {
                throw new Error(data.message || '获取默认配置失败');
            }
        } catch (error) {
            console.error('重置配置错误:', error);
            alert(`重置配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
            onStatusChange?.('error');
        }
    };

    // 更新物料缓存
    const handleUpdateMaterialCache = async () => {
        try {
            // TODO: 调用更新物料缓存API
            console.log('更新物料缓存API调用待实现');
            alert('更新物料缓存功能待实现');
        } catch (error) {
            console.error('更新物料缓存失败:', error);
            alert('更新物料缓存失败');
        }
    };

    // 获取字段显示名称（支持映射替换）
    const getDisplayFieldName = (fieldName: string): string => {
        return fieldNameMapping[fieldName] || fieldName;
    };

    // 判断字符串是否为纯英文（包含字母、数字、下划线）
    const isPureEnglish = (str: string): boolean => {
        return /^[a-zA-Z0-9_]+$/.test(str);
    };

    // 更新配置字段的处理函数 - 只处理act_config
    const handleConfigChange = (path: string[], value: any) => {
        if (!config) return;

        // 创建配置的深拷贝
        const newConfig = JSON.parse(JSON.stringify(config));

        // 根据路径更新act_config
        let current = newConfig.act_config;
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

    // 使用useEffect计算搜索结果，避免在渲染过程中更新状态 - 只搜索act_config
    useEffect(() => {
        if (searchTerm && config && config.act_config) {
            const results: Array<{key: string, path: string[], label: string}> = [];
            
            const searchInObject = (obj: any, currentPath: string[], label: string) => {
                if (typeof obj === 'object' && obj !== null) {
                    Object.entries(obj).forEach(([key, value]) => {
                        // 跳过非纯英文键的字段
                        if (!isPureEnglish(key)) {
                            return;
                        }
                        
                        const newPath = [...currentPath, key];
                        const displayKey = getDisplayFieldName(key);
                        const newLabel = label ? `${label} > ${displayKey}` : displayKey;
                        
                        // 支持原字段名和显示名搜索
                        const searchLower = searchTerm.toLowerCase();
                        const originalKeyMatch = key.toLowerCase().includes(searchLower);
                        const displayKeyMatch = displayKey.toLowerCase().includes(searchLower);
                        const valueMatch = String(value).toLowerCase().includes(searchLower);
                        
                        if (originalKeyMatch || displayKeyMatch || valueMatch) {
                            results.push({
                                key: displayKey,
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
            
            searchInObject(config.act_config, [], '活动配置');
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, config, fieldNameMapping]);

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
            {/* 活动ID输入区域 */}
            <div className="mb-4 bg-white p-4 rounded-lg shadow">
                <div className="flex items-end space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            活动ID
                        </label>
                        <input
                            type="text"
                            placeholder="请输入活动ID（留空则使用默认配置）..."
                            value={activityId}
                            onChange={(e) => setActivityId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    fetchConfigById();
                                }
                            }}
                        />
                    </div>
                    <div>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                            onClick={fetchConfigById}
                        >
                            获取配置
                        </button>
                    </div>
                </div>
            </div>

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
                        <h3 className="text-lg font-semibold mb-4">活动配置编辑器 (act_config)</h3>
                        {config && config.act_config ? (
                            <ConfigRenderer
                                data={config.act_config}
                                path={[]}
                                onChange={handleConfigChange}
                                searchTerm={searchTerm}
                                getDisplayFieldName={getDisplayFieldName}
                                isPureEnglish={isPureEnglish}
                            />
                        ) : (
                            <div className="text-gray-500">暂无活动配置数据</div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">活动配置预览 (act_config)</h3>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                            {config && config.act_config ? JSON.stringify(config.act_config, null, 2) : '暂无数据'}
                        </pre>
                    </div>
                )}
            </div>

            {/* API操作按钮和状态 */}
            <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="space-x-4">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={submitConfig}
                    >
                        保存配置
                    </button>
                    <button
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        onClick={handleUpdateCache}
                    >
                        更新缓存
                    </button>
                    <button
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        onClick={handleUpdateMaterialCache}
                    >
                        更新物料缓存
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={handleResetConfig}
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