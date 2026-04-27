'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { LoadingButton } from '../../components/ui/loading';
import { useToast } from '../../components/ToastProvider';
import type { ActInfoData } from '../../types/act-material';

type TableChatResponse =
    | {
          success: true;
          data: {
              reply: string;
              id: string;
              model: string;
              usage: Record<string, unknown>;
              finish_reason: string | null;
              processingTimeMs?: number;
          };
      }
    | { success: false; message: string; code?: string; detail?: string };

type GetActInfoResponse =
    | { success: true; data: ActInfoData; message?: string }
    | { success: false; message: string };

type SaveMaterialResponse = { success: boolean; message?: string };

export default function MaterialOverridePage() {
    const { user, logout } = useAuth();
    const { showError, showSuccess, showWarning } = useToast();
    const [tableText, setTableText] = useState('');
    const [reply, setReply] = useState('');
    const [meta, setMeta] = useState<{
        model: string;
        id: string;
        clientMs: number;
        serverMs: number | null;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [actIdForCover, setActIdForCover] = useState('');
    const [coverFlowLoading, setCoverFlowLoading] = useState(false);
    const [deployEnvLabel, setDeployEnvLabel] = useState('检测中…');

    useEffect(() => {
        let cancelled = false;
        fetch('/api/config/deploy-env')
            .then((r) => r.json())
            .then((d: { label?: string }) => {
                if (!cancelled && typeof d.label === 'string') {
                    setDeployEnvLabel(d.label);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setDeployEnvLabel('测试环境');
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSubmit = async () => {
        setReply('');
        setMeta(null);
        setLoading(true);
        const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
        try {
            const res = await fetch('/api/bigmodel/table-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableText }),
            });
            const json = (await res.json()) as TableChatResponse;
            if (!json.success) {
                showError(json.message || '请求失败');
                return;
            }
            const clientMs =
                typeof performance !== 'undefined'
                    ? Math.round(performance.now() - t0)
                    : Math.round(Date.now() - t0);
            setReply(json.data.reply);
            setMeta({
                model: json.data.model,
                id: json.data.id,
                clientMs,
                serverMs:
                    typeof json.data.processingTimeMs === 'number'
                        ? json.data.processingTimeMs
                        : null,
            });
            showSuccess('生成完成');
        } catch {
            showError('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleCoverMaterial = async () => {
        const actId = actIdForCover.trim();
        if (!actId) {
            showWarning('请填写活动 ID');
            return;
        }
        if (!reply.trim()) {
            showWarning('请先生成物料 JSON');
            return;
        }
        const operator = (user?.nickname || user?.username || '').trim();
        if (!operator) {
            showError('无法获取当前登录用户，请重新登录后再试');
            return;
        }

        setCoverFlowLoading(true);
        try {
            const infoRes = await fetch('/api/activity/get-act-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ act_id: actId }),
            });
            const infoJson = (await infoRes.json()) as GetActInfoResponse;
            if (!infoJson.success || !infoJson.data) {
                showError(infoJson.message || '获取活动信息失败');
                return;
            }
            const act = infoJson.data;
            const lines = [
                `已获取活动：${act.activity_name}`,
                `活动 ID：${act.id}`,
                `类型：${act.activity_type}`,
                `时间：${act.start_time} ~ ${act.end_time}`,
                '',
                '是否确定覆盖物料？',
            ];
            if (!confirm(lines.join('\n'))) {
                return;
            }

            const saveRes = await fetch('/api/activity/save-material', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    act_id: actId,
                    material: reply,
                    operator,
                }),
            });
            const saveJson = (await saveRes.json()) as SaveMaterialResponse;
            if (!saveJson.success) {
                showError(saveJson.message || '保存物料失败');
                return;
            }
            showSuccess(saveJson.message || '物料已覆盖');
        } catch {
            showError('网络错误，请稍后重试');
        } finally {
            setCoverFlowLoading(false);
        }
    };

    const handleLogout = () => {
        if (confirm('确定要退出登录吗？')) {
            logout();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ← 返回首页
                            </Link>
                            <h1 className="text-2xl font-bold">覆盖物料配置</h1>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                后端：{deployEnvLabel}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-600">{user?.username}</div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                退出登录
                            </button>
                        </div>
                    </div>
                    <p className="mt-3 text-gray-600 text-sm">
                        请从表格复制完整内容粘贴到下方。表头行须在同一行内同时包含：售价、id、类型（可与 gift_type
                        同列）、数量、礼物名字、礼物价值、权重；兼容表头写「礼物名」。生成结果中 gift_id 对应 id
                        列，gift_num 对应数量列。智谱侧使用内置 JSON 生成规则。查询活动与保存物料走{' '}
                        <strong>{deployEnvLabel}</strong> 的 PHP 地址（由部署变量 DEPLOY_ENV 控制）。
                    </p>
                    <p className="mt-2 text-sm">
                        <span className="text-gray-600">表格模板（腾讯文档）：</span>
                        <a
                            href="https://doc.weixin.qq.com/sheet/e3_ADcApgZIAH0CN1glNmIIqQrSO2Zds?scode=AGUAVgd5AA059Ml9MFADcApgZIAH0&tab=BB08J2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                            https://doc.weixin.qq.com/sheet/e3_ADcApgZIAH0CN1glNmIIqQrSO2Zds?scode=AGUAVgd5AA059Ml9MFADcApgZIAH0&tab=BB08J2
                        </a>
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
                    <div className="flex flex-col min-h-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            表格内容
                        </label>
                        <textarea
                            value={tableText}
                            onChange={(e) => setTableText(e.target.value)}
                            rows={18}
                            placeholder="在此粘贴从表格复制的文本（保留换行与制表符）"
                            className="w-full min-h-[320px] border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                        />
                    </div>
                    <LoadingButton
                        type="button"
                        variant="primary"
                        loading={loading}
                        loadingText="生成中…"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        提交并调用智谱生成
                    </LoadingButton>
                </div>

                {reply !== '' && (
                    <div className="bg-white rounded-lg shadow p-6 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
                            <div className="flex flex-col items-end gap-0.5 text-xs text-gray-500">
                                {meta && (
                                    <span>
                                        {meta.model}
                                        {meta.id ? ` · ${meta.id}` : ''}
                                    </span>
                                )}
                                {meta && (
                                    <span className="text-gray-600">
                                        本次处理耗时：{(meta.clientMs / 1000).toFixed(2)} 秒（端到端）
                                        {meta.serverMs != null
                                            ? ` · 服务端 ${meta.serverMs} ms`
                                            : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                        <pre className="whitespace-pre-wrap break-words text-sm bg-gray-50 border border-gray-200 rounded-md p-4 max-h-[480px] overflow-auto">
                            {reply}
                        </pre>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                覆盖到线上活动
                            </h3>
                            <p className="text-xs text-gray-600 mb-3">
                                将先请求 get-act-info 校验活动，确认后再调用 save-material，提交 act_id、解析后的
                                material_list 及当前登录用户作为 operator。
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        活动 ID（act_id）
                                    </label>
                                    <input
                                        type="text"
                                        value={actIdForCover}
                                        onChange={(e) => setActIdForCover(e.target.value)}
                                        placeholder="例如 290"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <LoadingButton
                                    type="button"
                                    variant="warning"
                                    loading={coverFlowLoading}
                                    loadingText="处理中…"
                                    onClick={handleCoverMaterial}
                                    disabled={coverFlowLoading}
                                    className="sm:mb-0"
                                >
                                    获取活动信息并覆盖物料
                                </LoadingButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
