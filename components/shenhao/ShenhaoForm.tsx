'use client';

import { useState, useEffect } from 'react';
import { 
    ShenhaoData, 
    ShenhaoFormData, 
    SHENHAO_LEVELS, 
    SHENHAO_STATUS_OPTIONS
} from '../../types/shenhao';
import { LoadingButton } from '../ui/loading';
import { useToast } from '../ToastProvider';
import { postToNextjsApi } from '../../utils/frontendApiClient';

interface ShenhaoFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingData?: ShenhaoData | null;
    currentUser: string; // 当前登录用户名
}

export default function ShenhaoForm({ 
    isOpen, 
    onClose, 
    onSuccess, 
    editingData, 
    currentUser 
}: ShenhaoFormProps) {
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState<ShenhaoFormData>({
        uid: '',
        level: 1,
    });

    const { showSuccess, showError } = useToast();

    // 初始化表单数据
    useEffect(() => {
        if (editingData) {
            setFormData({
                uid: editingData.user.uid,
                level: editingData.shenhao.level,
            });
        } else {
            // 重置为默认值
            setFormData({
                uid: '',
                level: 1,
            });
        }
    }, [editingData, isOpen]);

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 基本验证
        if (!formData.uid || !formData.level) {
            showError('请填写必填字段：用户ID和神壕等级');
            return;
        }

        setLoading(true);
        try {
            const apiUrl = editingData ? '/api/shenhao/update' : '/api/shenhao/create';
            const requestData = {
                ...formData,
                ...(editingData ? { 
                    id: editingData.shenhao.id,
                    updated_by: currentUser 
                } : { 
                    created_by: currentUser 
                }),
            };

            console.log(`开始${editingData ? '更新' : '创建'}神壕:`, requestData);

            const response = await postToNextjsApi(apiUrl, requestData);
            
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
            
            console.log(`${editingData ? '更新' : '创建'}神壕响应:`, result);
            
            if (result.success) {
                showSuccess(
                    editingData ? '成功更新神壕信息' : '成功创建神壕'
                );
                onSuccess();
                onClose();
            } else {
                // 显示详细的错误信息
                const errorMsg = result.message || result.error || '操作失败';
                console.error(`${editingData ? '更新' : '创建'}神壕失败:`, errorMsg);
                showError(`${editingData ? '更新' : '创建'}神壕失败: ${errorMsg}`);
            }
        } catch (error) {
            console.error('神壕操作出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`${editingData ? '更新' : '创建'}神壕时发生错误: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingData ? '编辑神壕' : '创建神壕'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 神壕信息 */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">神壕信息</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {!editingData && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            用户ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.uid}
                                            onChange={(e) => setFormData(prev => ({ ...prev, uid: e.target.value }))}
                                            placeholder="请输入用户ID"
                                        />
                                    </div>
                                )}
                                {editingData && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            用户ID
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                                            value={formData.uid}
                                            placeholder="用户ID不可修改"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        神壕等级 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.level}
                                        onChange={(e) => setFormData(prev => ({ ...prev, level: Number(e.target.value) }))}
                                    >
                                        {SHENHAO_LEVELS.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                {editingData ? '更新' : '创建'}
                            </LoadingButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

