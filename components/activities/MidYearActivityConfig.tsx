'use client';

import { useState } from 'react';
import { Activity } from '../../types/activity';
import ActivityConfigPage from '../ActivityConfigPage';
import { MidYearConfig } from '../../types/midyear-config';

interface MidYearActivityConfigProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function MidYearActivityConfig({ activity, onStatusChange }: MidYearActivityConfigProps) {
    const [activeConfigTab, setActiveConfigTab] = useState('send_msg');
    const { config, setConfig, apiStatus, fetchConfig, submitConfig } = ActivityConfigPage({
        activity,
        onStatusChange,
    });
    
    // 类型断言，确保config是MidYearConfig类型
    const midYearConfig = config as MidYearConfig;

    // 更新配置字段的处理函数
    const handleConfigChange = (path: string[], value: any) => {
        if (!midYearConfig) return;
        
        // 创建配置的深拷贝
        const newConfig = JSON.parse(JSON.stringify(midYearConfig));
        
        // 根据路径更新配置
        let current = newConfig;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        
        // 更新配置状态
        setConfig(newConfig);
    };

    // 渲染文本输入字段
    const renderTextField = (label: string, path: string[], value: string | number) => {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigChange(path, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        );
    };

    // 渲染文本区域输入字段
    const renderTextAreaField = (label: string, path: string[], value: string) => {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <textarea
                    value={value}
                    onChange={(e) => handleConfigChange(path, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                />
            </div>
        );
    };

    // 渲染开关字段
    const renderToggle = (label: string, path: string[], value: number) => {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex items-center space-x-4">
                    <button
                        className={`px-3 py-1 rounded ${value === 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleConfigChange(path, 1)}
                    >
                        开启
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${value === 0 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleConfigChange(path, 0)}
                    >
                        关闭
                    </button>
                </div>
            </div>
        );
    };

    // 渲染日期时间输入字段
    const renderDateTimeField = (label: string, path: string[], value: string) => {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigChange(path, e.target.value)}
                    placeholder="YYYY-MM-DD HH:MM:SS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        );
    };

    // 渲染礼物配置字段
    const renderGiftField = (label: string, path: string[], gift: any) => {
        return (
            <div className="mb-4 border p-3 rounded-md">
                <h4 className="font-medium text-gray-800 mb-2">{label}</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-gray-500">礼物ID</label>
                        <input
                            type="text"
                            value={gift.gift_id}
                            onChange={(e) => {
                                const newGift = {...gift, gift_id: e.target.value};
                                handleConfigChange(path, newGift);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">礼物类型</label>
                        <input
                            type="text"
                            value={gift.gift_type}
                            onChange={(e) => {
                                const newGift = {...gift, gift_type: e.target.value};
                                handleConfigChange(path, newGift);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">礼物数量</label>
                        <input
                            type="text"
                            value={gift.gift_num}
                            onChange={(e) => {
                                const newGift = {...gift, gift_num: e.target.value};
                                handleConfigChange(path, newGift);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">概率</label>
                        <input
                            type="text"
                            value={gift.real_probability}
                            onChange={(e) => {
                                const newGift = {...gift, real_probability: e.target.value};
                                handleConfigChange(path, newGift);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                {gift.remark && (
                    <div className="mt-2">
                        <label className="text-xs text-gray-500">备注</label>
                        <input
                            type="text"
                            value={gift.remark}
                            onChange={(e) => {
                                const newGift = {...gift, remark: e.target.value};
                                handleConfigChange(path, newGift);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                )}
            </div>
        );
    };

    if (!midYearConfig) {
        return <div className="flex items-center justify-center h-full">加载中...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            {/* 配置管理子菜单 */}
            <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'send_msg' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('send_msg')}
                >
                    发送消息
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'alert' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('alert')}
                >
                    告警
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'rank_game' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('rank_game')}
                >
                    榜单玩法
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'sign_game' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('sign_game')}
                >
                    签到玩法
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'draw_game' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('draw_game')}
                >
                    抽奖玩法
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'fight_game' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('fight_game')}
                >
                    掐架玩法
                </button>
            </div>

            {/* 配置内容区域 */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
                {/* 发送消息配置 */}
                {activeConfigTab === 'send_msg' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">发送消息配置</h3>
                        <div className="space-y-6">
                            {renderToggle('是否开启发送通知', ['send_msg_config', 'send_msg'], midYearConfig.send_msg_config.send_msg)}
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">通知发送内容</h4>
                                {renderTextField('匹配完成通知', ['send_msg_config', 'send_msg_info', 'match_done'], 
                                    midYearConfig.send_msg_config.send_msg_info.match_done)}
                                {renderTextField('周四提示通知', ['send_msg_config', 'send_msg_info', 'thursday_tips'], 
                                    midYearConfig.send_msg_config.send_msg_info.thursday_tips)}
                                {renderTextField('差20点提示', ['send_msg_config', 'send_msg_info', 'need_20_value'], 
                                    midYearConfig.send_msg_config.send_msg_info.need_20_value)}
                                {renderTextField('两天提示', ['send_msg_config', 'send_msg_info', 'two_days_tips'], 
                                    midYearConfig.send_msg_config.send_msg_info.two_days_tips)}
                                {renderTextField('第四周提示', ['send_msg_config', 'send_msg_info', 'fourth_week'], 
                                    midYearConfig.send_msg_config.send_msg_info.fourth_week)}
                            </div>
                        </div>
                    </div>
                )}

                {/* 告警配置 */}
                {activeConfigTab === 'alert' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">告警配置</h3>
                        <div className="space-y-6">
                            {renderToggle('是否开启告警邮件发送', ['send_warning_config', 'send_warning'], 
                                midYearConfig.send_warning_config.send_warning)}
                            
                            {renderTextField('告警产生的活动名', ['send_warning_config', 'send_warning_act_name'], 
                                midYearConfig.send_warning_config.send_warning_act_name)}
                            
                            {renderTextField('告警邮件发送间隔(秒)', ['send_warning_config', 'send_warning_interval'], 
                                midYearConfig.send_warning_config.send_warning_interval)}
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">告警礼物时间间隔配置</h4>
                                {Object.entries(midYearConfig.send_warning_config.interval_warning_time).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-gray-600 w-24">礼物ID: {key}</span>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const newIntervalWarningTime = {...midYearConfig.send_warning_config.interval_warning_time};
                                                newIntervalWarningTime[key] = e.target.value;
                                                handleConfigChange(['send_warning_config', 'interval_warning_time'], newIntervalWarningTime);
                                            }}
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">告警礼物数量阈值配置</h4>
                                {Object.entries(midYearConfig.send_warning_config.interval_warning_prize).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-gray-600 w-24">礼物ID: {key}</span>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const newIntervalWarningPrize = {...midYearConfig.send_warning_config.interval_warning_prize};
                                                newIntervalWarningPrize[key] = e.target.value;
                                                handleConfigChange(['send_warning_config', 'interval_warning_prize'], newIntervalWarningPrize);
                                            }}
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 榜单玩法配置 */}
                {activeConfigTab === 'rank_game' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">榜单玩法配置</h3>
                        <div className="space-y-6">
                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">导入礼物配置</h4>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">导入礼物ID列表</label>
                                    <input
                                        type="text"
                                        value={midYearConfig.act_config.import_gifts ? midYearConfig.act_config.import_gifts.join(', ') : ''}
                                        onChange={(e) => {
                                            const giftIds = e.target.value.split(',').map(id => parseInt(id.trim()));
                                            handleConfigChange(['act_config', 'import_gifts'], giftIds);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">多个ID用逗号分隔</p>
                                </div>
                            </div>

                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">家族榜配置</h4>
                                
                                {renderTextAreaField('介绍信息', 
                                    ['act_config', 'rank_game_config', 'family_rank_config', 'intro_msg'], 
                                    midYearConfig.act_config.rank_game_config.family_rank_config.intro_msg)}
                                
                                {renderTextAreaField('备用信息1', 
                                    ['act_config', 'rank_game_config', 'family_rank_config', 'spare_msg'], 
                                    midYearConfig.act_config.rank_game_config.family_rank_config.spare_msg)}
                                
                                {renderTextAreaField('备用信息2', 
                                    ['act_config', 'rank_game_config', 'family_rank_config', 'spare_msg_2'], 
                                    midYearConfig.act_config.rank_game_config.family_rank_config.spare_msg_2)}
                                
                                {renderDateTimeField('开始时间', 
                                    ['act_config', 'rank_game_config', 'family_rank_config', 'start_time'], 
                                    midYearConfig.act_config.rank_game_config.family_rank_config.start_time)}
                                
                                {renderDateTimeField('结束时间', 
                                    ['act_config', 'rank_game_config', 'family_rank_config', 'end_time'], 
                                    midYearConfig.act_config.rank_game_config.family_rank_config.end_time)}
                                
                                {renderTextField('榜单值比例', 
                                    ['act_config', 'rank_game_config', 'family_rank_config', 'rank_value_ratio'], 
                                    midYearConfig.act_config.rank_game_config.family_rank_config.rank_value_ratio)}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">家族赛上榜礼物ID</label>
                                    <input
                                        type="text"
                                        value={midYearConfig.act_config.rank_game_config.family_rank_config.rank_gift.join(', ')}
                                        onChange={(e) => {
                                            const giftIds = e.target.value.split(',').map(id => parseInt(id.trim()));
                                            handleConfigChange(['act_config', 'rank_game_config', 'family_rank_config', 'rank_gift'], giftIds);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">多个ID用逗号分隔</p>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-700 mb-2">阶段配置</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border p-3 rounded-md">
                                            <h6 className="font-medium mb-2">第一阶段</h6>
                                            {renderDateTimeField('开始时间', 
                                                ['act_config', 'rank_game_config', 'family_rank_config', 'first_stage', 'start_time'], 
                                                midYearConfig.act_config.rank_game_config.family_rank_config.first_stage.start_time)}
                                            
                                            {renderDateTimeField('结束时间', 
                                                ['act_config', 'rank_game_config', 'family_rank_config', 'first_stage', 'end_time'], 
                                                midYearConfig.act_config.rank_game_config.family_rank_config.first_stage.end_time)}
                                            
                                            {renderTextField('晋级所需值', 
                                                ['act_config', 'rank_game_config', 'family_rank_config', 'first_stage', 'winner_need_value'], 
                                                midYearConfig.act_config.rank_game_config.family_rank_config.first_stage.winner_need_value)}
                                        </div>
                                        
                                        <div className="border p-3 rounded-md">
                                            <h6 className="font-medium mb-2">第二阶段</h6>
                                            {renderDateTimeField('开始时间', 
                                                ['act_config', 'rank_game_config', 'family_rank_config', 'second_stage', 'start_time'], 
                                                midYearConfig.act_config.rank_game_config.family_rank_config.second_stage.start_time)}
                                            
                                            {renderDateTimeField('结束时间', 
                                                ['act_config', 'rank_game_config', 'family_rank_config', 'second_stage', 'end_time'], 
                                                midYearConfig.act_config.rank_game_config.family_rank_config.second_stage.end_time)}
                                            
                                            {renderTextField('晋级所需值', 
                                                ['act_config', 'rank_game_config', 'family_rank_config', 'second_stage', 'winner_need_value'], 
                                                midYearConfig.act_config.rank_game_config.family_rank_config.second_stage.winner_need_value)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">风云榜配置</h4>
                                
                                {renderTextAreaField('介绍信息', 
                                    ['act_config', 'rank_game_config', 'user_rank_config', 'intro_msg'], 
                                    config.act_config.rank_game_config.user_rank_config.intro_msg)}
                                
                                {renderTextAreaField('备用信息1', 
                                    ['act_config', 'rank_game_config', 'user_rank_config', 'spare_msg'], 
                                    config.act_config.rank_game_config.user_rank_config.spare_msg)}
                                
                                {renderTextAreaField('备用信息2', 
                                    ['act_config', 'rank_game_config', 'user_rank_config', 'spare_msg_2'], 
                                    config.act_config.rank_game_config.user_rank_config.spare_msg_2)}
                                
                                {renderDateTimeField('开始时间', 
                                    ['act_config', 'rank_game_config', 'user_rank_config', 'start_time'], 
                                    config.act_config.rank_game_config.user_rank_config.start_time)}
                                
                                {renderDateTimeField('结束时间', 
                                    ['act_config', 'rank_game_config', 'user_rank_config', 'end_time'], 
                                    config.act_config.rank_game_config.user_rank_config.end_time)}
                                
                                {renderTextField('榜单值比例', 
                                    ['act_config', 'rank_game_config', 'user_rank_config', 'rank_value_ratio'], 
                                    config.act_config.rank_game_config.user_rank_config.rank_value_ratio)}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">风云榜上榜礼物ID</label>
                                    <input
                                        type="text"
                                        value={config.act_config.rank_game_config.user_rank_config.rank_gift.join(', ')}
                                        onChange={(e) => {
                                            const giftIds = e.target.value.split(',').map(id => parseInt(id.trim()));
                                            handleConfigChange(['act_config', 'rank_game_config', 'user_rank_config', 'rank_gift'], giftIds);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">多个ID用逗号分隔</p>
                                </div>
                                
                                {renderTextField('参与奖所需榜单值', 
                                    ['act_config', 'rank_game_config', 'user_rank_config', 'patch_in_prize_need_value'], 
                                    config.act_config.rank_game_config.user_rank_config.patch_in_prize_need_value)}
                            </div>
                        </div>
                    </div>
                )}

                {/* 签到玩法配置 */}
                {activeConfigTab === 'sign_game' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">签到玩法配置</h3>
                        <div className="space-y-6">
                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">神豪签到配置</h4>
                                
                                {renderTextField('最大补签数', 
                                    ['act_config', 'sign_game_config', 'rich_sign_in', 'remedy_sign_in_max_num'], 
                                    config.act_config.sign_game_config.rich_sign_in.remedy_sign_in_max_num)}
                                
                                {renderTextField('补签需人民币', 
                                    ['act_config', 'sign_game_config', 'rich_sign_in', 'remedy_sign_in_need_rmb'], 
                                    config.act_config.sign_game_config.rich_sign_in.remedy_sign_in_need_rmb)}
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-700 mb-2">累计签到奖励</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(config.act_config.sign_game_config.rich_sign_in.total_sign_in_prize).map(([key, prize]) => (
                                            <div key={key} className="border p-3 rounded-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h6 className="font-medium">累计{prize.need_num}天奖励</h6>
                                                </div>
                                                
                                                {Object.entries(prize.gift_list).map(([giftKey, gift]) => (
                                                    <div key={giftKey} className="mt-2">
                                                        {renderGiftField(`奖励礼物${giftKey}`, 
                                                            ['act_config', 'sign_game_config', 'rich_sign_in', 'total_sign_in_prize', key, 'gift_list', giftKey], 
                                                            gift)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-700 mb-2">每日签到奖励</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(config.act_config.sign_game_config.rich_sign_in.prize_list).slice(0, 6).map(([day, gifts]) => (
                                            <div key={day} className="border p-3 rounded-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h6 className="font-medium">第{day}天奖励</h6>
                                                </div>
                                                
                                                {Object.entries(gifts).map(([giftKey, gift]) => (
                                                    <div key={giftKey} className="mt-2">
                                                        {renderGiftField(`奖励礼物${giftKey}`, 
                                                            ['act_config', 'sign_game_config', 'rich_sign_in', 'prize_list', day, giftKey], 
                                                            gift)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">普通用户签到配置</h4>
                                
                                {renderTextField('最大补签数', 
                                    ['act_config', 'sign_game_config', 'user_sign_in', 'remedy_sign_in_max_num'], 
                                    config.act_config.sign_game_config.user_sign_in.remedy_sign_in_max_num)}
                                
                                {renderTextField('补签需人民币', 
                                    ['act_config', 'sign_game_config', 'user_sign_in', 'remedy_sign_in_need_rmb'], 
                                    config.act_config.sign_game_config.user_sign_in.remedy_sign_in_need_rmb)}
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-700 mb-2">累计签到奖励</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(config.act_config.sign_game_config.user_sign_in.total_sign_in_prize).map(([key, prize]) => (
                                            <div key={key} className="border p-3 rounded-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h6 className="font-medium">累计{prize.need_num}天奖励</h6>
                                                </div>
                                                
                                                {Object.entries(prize.gift_list).map(([giftKey, gift]) => (
                                                    <div key={giftKey} className="mt-2">
                                                        {renderGiftField(`奖励礼物${giftKey}`, 
                                                            ['act_config', 'sign_game_config', 'user_sign_in', 'total_sign_in_prize', key, 'gift_list', giftKey], 
                                                            gift)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-700 mb-2">每日签到奖励</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(config.act_config.sign_game_config.user_sign_in.prize_list).slice(0, 6).map(([day, gifts]) => (
                                            <div key={day} className="border p-3 rounded-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h6 className="font-medium">第{day}天奖励</h6>
                                                </div>
                                                
                                                {Object.entries(gifts).map(([giftKey, gift]) => (
                                                    <div key={giftKey} className="mt-2">
                                                        {renderGiftField(`奖励礼物${giftKey}`, 
                                                            ['act_config', 'sign_game_config', 'user_sign_in', 'prize_list', day, giftKey], 
                                                            gift)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 抽奖玩法配置 */}
                {activeConfigTab === 'draw_game' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">抽奖玩法配置</h3>
                        <div className="space-y-6">
                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">基础配置</h4>
                                
                                {renderDateTimeField('开始时间', 
                                    ['act_config', 'draw_game_config', 'start_time'], 
                                    config.act_config.draw_game_config.start_time)}
                                
                                {renderDateTimeField('结束时间', 
                                    ['act_config', 'draw_game_config', 'end_time'], 
                                    config.act_config.draw_game_config.end_time)}
                                
                                {renderTextAreaField('游戏说明', 
                                    ['act_config', 'draw_game_config', 'game_msg'], 
                                    config.act_config.draw_game_config.game_msg)}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">切换奖池时间</label>
                                    <div className="space-y-2">
                                        {config.act_config.draw_game_config.change_pool_time.map((time, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={time}
                                                    onChange={(e) => {
                                                        const newTimes = [...config.act_config.draw_game_config.change_pool_time];
                                                        newTimes[index] = e.target.value;
                                                        handleConfigChange(['act_config', 'draw_game_config', 'change_pool_time'], newTimes);
                                                    }}
                                                    className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                                    placeholder="YYYY-MM-DD HH:MM:SS"
                                                />
                                                <button
                                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                                    onClick={() => {
                                                        const newTimes = [...config.act_config.draw_game_config.change_pool_time];
                                                        newTimes.splice(index, 1);
                                                        handleConfigChange(['act_config', 'draw_game_config', 'change_pool_time'], newTimes);
                                                    }}
                                                >
                                                    删除
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                            onClick={() => {
                                                const newTimes = [...config.act_config.draw_game_config.change_pool_time, ''];
                                                handleConfigChange(['act_config', 'draw_game_config', 'change_pool_time'], newTimes);
                                            }}
                                        >
                                            添加时间
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">购买道具礼物配置</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(config.act_config.draw_game_config.pay_prop_gift).map(([key, gift]) => (
                                        <div key={key} className="border p-3 rounded-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <h6 className="font-medium">道具{key}</h6>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-500">礼物ID</label>
                                                    <input
                                                        type="text"
                                                        value={gift.gift_id}
                                                        onChange={(e) => {
                                                            const newGift = {...gift, gift_id: e.target.value};
                                                            handleConfigChange(['act_config', 'draw_game_config', 'pay_prop_gift', key], newGift);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">礼物类型</label>
                                                    <input
                                                        type="text"
                                                        value={gift.gift_type}
                                                        onChange={(e) => {
                                                            const newGift = {...gift, gift_type: e.target.value};
                                                            handleConfigChange(['act_config', 'draw_game_config', 'pay_prop_gift', key], newGift);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">礼物数量</label>
                                                    <input
                                                        type="text"
                                                        value={gift.gift_num}
                                                        onChange={(e) => {
                                                            const newGift = {...gift, gift_num: e.target.value};
                                                            handleConfigChange(['act_config', 'draw_game_config', 'pay_prop_gift', key], newGift);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">需要价格</label>
                                                    <input
                                                        type="text"
                                                        value={gift.need_price}
                                                        onChange={(e) => {
                                                            const newGift = {...gift, need_price: e.target.value};
                                                            handleConfigChange(['act_config', 'draw_game_config', 'pay_prop_gift', key], newGift);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <label className="text-xs text-gray-500">备注</label>
                                                <input
                                                    type="text"
                                                    value={gift.remark}
                                                    onChange={(e) => {
                                                        const newGift = {...gift, remark: e.target.value};
                                                        handleConfigChange(['act_config', 'draw_game_config', 'pay_prop_gift', key], newGift);
                                                    }}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 掐架玩法配置 */}
                {activeConfigTab === 'fight_game' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">掐架玩法配置</h3>
                        <div className="space-y-6">
                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">基础配置</h4>
                                
                                {renderDateTimeField('开始时间', 
                                    ['act_config', 'fight_game_config', 'start_time'], 
                                    config.act_config.fight_game_config.start_time)}
                                
                                {renderDateTimeField('结束时间', 
                                    ['act_config', 'fight_game_config', 'end_time'], 
                                    config.act_config.fight_game_config.end_time)}
                                
                                {renderTextField('PK玩法开启时间', 
                                    ['act_config', 'fight_game_config', 'pk_game_start'], 
                                    config.act_config.fight_game_config.pk_game_start)}
                                
                                {renderTextField('PK玩法结束时间', 
                                    ['act_config', 'fight_game_config', 'pk_game_end'], 
                                    config.act_config.fight_game_config.pk_game_end)}
                                
                                {renderTextAreaField('抽奖区域文案', 
                                    ['act_config', 'fight_game_config', 'game_msg_draw'], 
                                    config.act_config.fight_game_config.game_msg_draw)}
                                
                                {renderTextAreaField('掐架区域文案', 
                                    ['act_config', 'fight_game_config', 'game_msg_fight'], 
                                    config.act_config.fight_game_config.game_msg_fight)}
                            </div>

                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">武林打架配置</h4>
                                
                                {renderTextField('最大回合数', 
                                    ['act_config', 'fight_game_config', 'fight_config', 'max_round'], 
                                    config.act_config.fight_game_config.fight_config.max_round)}
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-700 mb-2">消息配置</h5>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">开始消息</label>
                                        <div className="space-y-2">
                                            {config.act_config.fight_game_config.fight_config.msg_config.start_msg.map((msg, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        value={msg}
                                                        onChange={(e) => {
                                                            const newMsgs = [...config.act_config.fight_game_config.fight_config.msg_config.start_msg];
                                                            newMsgs[index] = e.target.value;
                                                            handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'start_msg'], newMsgs);
                                                        }}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                    <button
                                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                                        onClick={() => {
                                                            const newMsgs = [...config.act_config.fight_game_config.fight_config.msg_config.start_msg];
                                                            newMsgs.splice(index, 1);
                                                            handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'start_msg'], newMsgs);
                                                        }}
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                                onClick={() => {
                                                    const newMsgs = [...config.act_config.fight_game_config.fight_config.msg_config.start_msg, ''];
                                                    handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'start_msg'], newMsgs);
                                                }}
                                            >
                                                添加消息
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">攻击消息</label>
                                        <div className="space-y-2">
                                            {config.act_config.fight_game_config.fight_config.msg_config.attack_msg.map((msg, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        value={msg}
                                                        onChange={(e) => {
                                                            const newMsgs = [...config.act_config.fight_game_config.fight_config.msg_config.attack_msg];
                                                            newMsgs[index] = e.target.value;
                                                            handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'attack_msg'], newMsgs);
                                                        }}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                    <button
                                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                                        onClick={() => {
                                                            const newMsgs = [...config.act_config.fight_game_config.fight_config.msg_config.attack_msg];
                                                            newMsgs.splice(index, 1);
                                                            handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'attack_msg'], newMsgs);
                                                        }}
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                                onClick={() => {
                                                    const newMsgs = [...config.act_config.fight_game_config.fight_config.msg_config.attack_msg, ''];
                                                    handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'attack_msg'], newMsgs);
                                                }}
                                            >
                                                添加消息
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">功夫列表</label>
                                        <div className="space-y-2">
                                            {config.act_config.fight_game_config.fight_config.msg_config.kungfu_list.map((kungfu, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        value={kungfu}
                                                        onChange={(e) => {
                                                            const newKungfus = [...config.act_config.fight_game_config.fight_config.msg_config.kungfu_list];
                                                            newKungfus[index] = e.target.value;
                                                            handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'kungfu_list'], newKungfus);
                                                        }}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                    <button
                                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                                        onClick={() => {
                                                            const newKungfus = [...config.act_config.fight_game_config.fight_config.msg_config.kungfu_list];
                                                            newKungfus.splice(index, 1);
                                                            handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'kungfu_list'], newKungfus);
                                                        }}
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                                onClick={() => {
                                                    const newKungfus = [...config.act_config.fight_game_config.fight_config.msg_config.kungfu_list, ''];
                                                    handleConfigChange(['act_config', 'fight_game_config', 'fight_config', 'msg_config', 'kungfu_list'], newKungfus);
                                                }}
                                            >
                                                添加功夫
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">奖励配置</h4>
                                
                                {renderGiftField('下注所需礼物', 
                                    ['act_config', 'fight_game_config', 'join_need_prize'], 
                                    config.act_config.fight_game_config.join_need_prize)}
                                
                                {renderGiftField('下注成功奖励', 
                                    ['act_config', 'fight_game_config', 'success_prize'], 
                                    config.act_config.fight_game_config.success_prize)}
                                
                                {renderGiftField('抽奖额外获得礼物', 
                                    ['act_config', 'fight_game_config', 'extra_gift'], 
                                    config.act_config.fight_game_config.extra_gift)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* API操作按钮和状态 */}
            <div className="mt-4 flex items-center justify-between">
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

            {/* JSON预览区域 */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">配置预览</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                    {JSON.stringify(midYearConfig, null, 2)}
                </pre>
            </div>
        </div>
    );
}