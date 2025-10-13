'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    ShenhaoData, 
    ShenhaoListParams, 
    SHENHAO_LEVELS, 
    SHENHAO_STATUS_OPTIONS
} from '../../types/shenhao';
import { LoadingButton, LoadingSpinner } from '../ui/loading';
import { useToast } from '../ToastProvider';
import { postToNextjsApi } from '../../utils/frontendApiClient';
import ShenhaoForm from './ShenhaoForm';
import UserInfoTooltip from './UserInfoTooltip';
import { useAuth } from '../auth/AuthProvider';

interface ShenhaoListProps {
    activityId: string;
}

export default function ShenhaoList({ activityId }: ShenhaoListProps) {
    const [shenhaoList, setShenhaoList] = useState<ShenhaoData[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchParams, setSearchParams] = useState<ShenhaoListParams>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingShenhao, setEditingShenhao] = useState<ShenhaoData | null>(null);
    const [deletingShenhao, setDeletingShenhao] = useState<ShenhaoData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { showSuccess, showError } = useToast();
    const { user } = useAuth();

    // 获取神壕列表
    const fetchShenhaoList = useCallback(async (params?: ShenhaoListParams) => {
        setLoading(true);
        try {
            const requestParams = params || {
                page: 1,
                page_size: 10,
            };
            
            console.log('开始获取神壕列表:', requestParams);
            
            const response = await postToNextjsApi('/api/shenhao/list', requestParams);
            
            // 检查HTTP状态码
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                console.error('解析响应JSON失败:', jsonError);
                throw new Error('服务器响应格式错误');
            }
            
            console.log('获取神壕列表响应:', result);
            
            if (result.success) {
                setShenhaoList(result.data.list || []);
                setTotal(result.data.total || 0);
                console.log('成功获取神壕列表:', result.data);
            } else {
                // 显示详细的错误信息
                const errorMsg = result.message || result.error || '获取神壕列表失败';
                console.error('获取神壕列表失败:', errorMsg);
                showError(`获取神壕列表失败: ${errorMsg}`);
                setShenhaoList([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('获取神壕列表出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`获取神壕列表时发生错误: ${errorMsg}`);
            setShenhaoList([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [showError]);

    // 显示删除确认对话框
    const handleDeleteClick = useCallback((shenhao: ShenhaoData) => {
        setDeletingShenhao(shenhao);
    }, []);

    // 执行删除操作
    const handleConfirmDelete = useCallback(async () => {
        if (!deletingShenhao) return;

        setIsDeleting(true);
        try {
            const requestData = {
                id: deletingShenhao.shenhao.id,
                deleted_by: user?.username || 'unknown'
            };
            
            console.log('开始删除神壕:', requestData);
            
            const response = await postToNextjsApi('/api/shenhao/delete', requestData);
            
            // 检查HTTP状态码
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                console.error('解析响应JSON失败:', jsonError);
                throw new Error('服务器响应格式错误');
            }
            
            console.log('删除神壕响应:', result);
            
            if (result.success) {
                showSuccess('成功删除神壕');
                setDeletingShenhao(null); // 关闭确认对话框
                // 重新加载列表，使用当前的搜索参数
                fetchShenhaoList({
                    page: currentPage,
                    page_size: pageSize,
                    ...searchParams,
                });
            } else {
                // 显示详细的错误信息
                const errorMsg = result.message || result.error || '删除神壕失败';
                console.error('删除神壕失败:', errorMsg);
                showError(`删除神壕失败: ${errorMsg}`);
            }
        } catch (error) {
            console.error('删除神壕出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`删除神壕时发生错误: ${errorMsg}`);
        } finally {
            setIsDeleting(false);
        }
    }, [deletingShenhao, user?.username, currentPage, pageSize, searchParams, fetchShenhaoList, showSuccess, showError]);

    // 取消删除
    const handleCancelDelete = useCallback(() => {
        setDeletingShenhao(null);
    }, []);

    // 格式化金额
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount);
    };

    // 获取神壕等级标签
    const getLevelLabel = (level: number) => {
        const levelConfig = SHENHAO_LEVELS.find(l => l.value === level);
        return levelConfig ? levelConfig.label : `等级${level}`;
    };

    // 获取状态标签
    const getStatusLabel = (status: string) => {
        const statusConfig = SHENHAO_STATUS_OPTIONS.find(s => s.value === status);
        return statusConfig ? statusConfig.label : status;
    };

    // 获取状态颜色
    const getStatusColor = (status: string) => {
        const statusConfig = SHENHAO_STATUS_OPTIONS.find(s => s.value === status);
        return statusConfig ? statusConfig.color : 'gray';
    };

    // 初始加载
    useEffect(() => {
        fetchShenhaoList({
            page: 1,
            page_size: pageSize,
        });
    }, []);

    // 当分页变化时重新加载
    useEffect(() => {
        if (currentPage > 1) { // 避免初始加载时重复请求
            fetchShenhaoList({
                page: currentPage,
                page_size: pageSize,
                ...searchParams,
            });
        }
    }, [currentPage]);

    return (
        <div className="space-y-6">
            {/* 页面标题和操作按钮 */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">在期神壕列表管理</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    创建神壕
                </button>
            </div>

            {/* 搜索和筛选 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            用户ID搜索
                        </label>
                        <input
                            type="text"
                            placeholder="请输入用户ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchParams.uid || ''}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, uid: e.target.value }))}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            神壕等级
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchParams.level || ''}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, level: e.target.value ? Number(e.target.value) : undefined }))}
                        >
                            <option value="">全部等级</option>
                            {SHENHAO_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex items-end">
                        <LoadingButton
                            onClick={() => {
                                setCurrentPage(1); // 搜索时重置到第一页
                                fetchShenhaoList({
                                    page: 1,
                                    page_size: pageSize,
                                    ...searchParams,
                                });
                            }}
                            loading={loading}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            搜索
                        </LoadingButton>
                    </div>
                </div>
            </div>

            {/* 神壕列表 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading && shenhaoList.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            用户信息
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            神壕等级
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            总消耗金币
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            总充值金额
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            状态
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            创建人
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            修改时间
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            预计过期时间
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {shenhaoList.map((item) => (
                                        <tr key={item.shenhao.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {item.user.avatar ? (
                                                            <img 
                                                                className="h-10 w-10 rounded-full" 
                                                                src={item.user.avatar} 
                                                                alt={item.user.username}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-gray-600 font-medium">
                                                                    {item.user.username.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <UserInfoTooltip user={item.user}>
                                                            <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                                                                {item.user.username}
                                                            </div>
                                                        </UserInfoTooltip>
                                                        <div className="text-sm text-gray-500">
                                                            UID: {item.user.uid}
                                                        </div>
                                                        {item.user.nickname && (
                                                            <div className="text-sm text-gray-500">
                                                                昵称: {item.user.nickname}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {getLevelLabel(item.shenhao.level)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.shenhao.total_consume.toLocaleString()} 金币
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ¥{Math.floor(item.shenhao.total_recharge).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    getStatusColor(item.shenhao.status) === 'green' ? 'bg-green-100 text-green-800' :
                                                    getStatusColor(item.shenhao.status) === 'red' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {getStatusLabel(item.shenhao.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.shenhao.created_by || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.shenhao.updated_time 
                                                    ? new Date(item.shenhao.updated_time).toLocaleString('zh-CN') 
                                                    : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.shenhao.expected_expire_time 
                                                    ? new Date(item.shenhao.expected_expire_time).toLocaleString('zh-CN') 
                                                    : '无期限'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => setEditingShenhao(item)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    编辑
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    删除
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 分页 */}
                        {total > pageSize && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        上一页
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage * pageSize >= total}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        下一页
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                                            <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> 条，
                                            共 <span className="font-medium">{total}</span> 条记录
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                上一页
                                            </button>
                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                {currentPage} / {Math.ceil(total / pageSize)}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                disabled={currentPage * pageSize >= total}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                下一页
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 空状态 */}
                        {!loading && shenhaoList.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg mb-2">暂无神壕数据</div>
                                <div className="text-gray-400 text-sm">
                                    {Object.keys(searchParams).some(key => searchParams[key as keyof ShenhaoListParams]) 
                                        ? '请尝试调整搜索条件' 
                                        : '点击上方"创建神壕"按钮添加第一个神壕用户'
                                    }
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 创建/编辑神壕模态框 */}
            <ShenhaoForm
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => fetchShenhaoList({
                    page: currentPage,
                    page_size: pageSize,
                    ...searchParams,
                })}
                currentUser={user?.username || 'unknown'}
            />

            <ShenhaoForm
                isOpen={!!editingShenhao}
                onClose={() => setEditingShenhao(null)}
                onSuccess={() => fetchShenhaoList({
                    page: currentPage,
                    page_size: pageSize,
                    ...searchParams,
                })}
                editingData={editingShenhao}
                currentUser={user?.username || 'unknown'}
            />

            {/* 删除确认对话框 */}
            {deletingShenhao && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                    确认删除神壕
                                </h3>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-2">
                                您即将删除以下神壕用户，此操作不可撤销：
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                    {deletingShenhao.user.avatar ? (
                                        <img 
                                            className="h-10 w-10 rounded-full" 
                                            src={deletingShenhao.user.avatar} 
                                            alt={deletingShenhao.user.username}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-gray-600 font-medium">
                                                {deletingShenhao.user.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                            {deletingShenhao.user.username}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            UID: {deletingShenhao.user.uid} | 等级: {getLevelLabel(deletingShenhao.shenhao.level)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                取消
                            </button>
                            <LoadingButton
                                onClick={handleConfirmDelete}
                                loading={isDeleting}
                                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                确认删除
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
