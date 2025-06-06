'use client';

import { useState, useEffect } from 'react';

export default function Page() {
    const [jsonData, setJsonData] = useState({
        basicConfig: {
            activityTime: {
                startDate: '2025/03/24',
                startTime: '00:04',
                endDate: '2025/03/28',
                endTime: '12:04',
            },
            currentTime: -1,
            switches: {
                sendSwitch: true,
                mailSwitch: true,
            },
        },
        dataConfig: {
            notifications: ['8000719'],
            tableData: [
                { id: 1, name: '配置项1', value: '值1', status: 'active' },
                { id: 2, name: '配置项2', value: '值2', status: 'inactive' },
            ],
        },
    });

    const [newNotification, setNewNotification] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [apiStatus, setApiStatus] = useState('');

    // 模拟API请求
    const fetchData = async () => {
        setApiStatus('正在获取数据...');
        try {
            // 模拟API调用
            setTimeout(() => {
                setApiStatus('数据获取成功');
                setTimeout(() => setApiStatus(''), 2000);
            }, 1000);
        } catch (error) {
            setApiStatus('获取数据失败');
        }
    };

    const submitData = async () => {
        setApiStatus('正在提交数据...');
        try {
            // 模拟API提交
            setTimeout(() => {
                setApiStatus('数据提交成功');
                setTimeout(() => setApiStatus(''), 2000);
            }, 1000);
        } catch (error) {
            setApiStatus('提交数据失败');
        }
    };

    const updateJsonField = (path, value) => {
        const newData = { ...jsonData };
        const keys = path.split('.');
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        setJsonData(newData);
    };

    const addNotification = () => {
        if (newNotification.trim()) {
            const newNotifications = [...jsonData.dataConfig.notifications, newNotification];
            updateJsonField('dataConfig.notifications', newNotifications);
            setNewNotification('');
        }
    };

    const removeNotification = (index) => {
        const newNotifications = jsonData.dataConfig.notifications.filter((_, i) => i !== index);
        updateJsonField('dataConfig.notifications', newNotifications);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex" data-oid="ck__995">
            {/* 侧边栏 */}
            <div className="w-48 bg-gray-800 text-white" data-oid="nvub4jl">
                <div className="p-4" data-oid="jqm:fep">
                    <div className="flex items-center mb-8" data-oid="a-h4x6s">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2" data-oid="tr7oj-u"></div>
                        <span className="text-sm" data-oid="j47-b:q">
                            配置管理
                        </span>
                    </div>

                    <nav className="space-y-2" data-oid=".q8aq1a">
                        <div
                            className="flex items-center p-2 bg-gray-700 rounded"
                            data-oid="e7b2m9k"
                        >
                            <div
                                className="w-4 h-4 bg-blue-500 rounded-sm mr-2"
                                data-oid="m.pcbt9"
                            ></div>
                            <span className="text-sm" data-oid="96l8zu2">
                                活动列表
                            </span>
                        </div>
                        <div
                            className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
                            data-oid="13wunj2"
                        >
                            <div
                                className="w-4 h-4 bg-green-500 rounded-sm mr-2"
                                data-oid="lrfq6kw"
                            ></div>
                            <span className="text-sm" data-oid="0f4q48y">
                                数据统计
                            </span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 p-6" data-oid=":ei-9t4">
                <div className="bg-white rounded-lg shadow-sm" data-oid="-ub5gff">
                    {/* 头部 */}
                    <div className="border-b border-gray-200 p-6" data-oid="gaa-6:1">
                        <h1 className="text-2xl font-medium text-gray-800 mb-2" data-oid="fnq6hob">
                            25年愚人节配置
                        </h1>
                        <div className="text-sm text-gray-500" data-oid="dx_xphm">
                            操作员：Wang-Xiu 当前时间：2025-03-19 08:21:37
                        </div>
                    </div>

                    <div className="p-6 space-y-8" data-oid="s10iugi">
                        {/* 基础配置 */}
                        <div data-oid="tgs3w_8">
                            <h2
                                className="text-lg font-medium mb-4 bg-gray-50 p-3 rounded"
                                data-oid="q4xz2hm"
                            >
                                基础配置
                            </h2>

                            {/* 活动时间 */}
                            <div className="mb-6" data-oid="lkcs8bg">
                                <label
                                    className="block text-sm font-medium mb-3"
                                    data-oid="oub4m_e"
                                >
                                    活动时间
                                </label>
                                <div className="flex items-center space-x-4" data-oid="l5r5xqs">
                                    <input
                                        type="date"
                                        value={jsonData.basicConfig.activityTime.startDate.replace(
                                            /\//g,
                                            '-',
                                        )}
                                        onChange={(e) =>
                                            updateJsonField(
                                                'basicConfig.activityTime.startDate',
                                                e.target.value.replace(/-/g, '/'),
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2"
                                        data-oid="cd7y74m"
                                    />

                                    <input
                                        type="time"
                                        value={jsonData.basicConfig.activityTime.startTime}
                                        onChange={(e) =>
                                            updateJsonField(
                                                'basicConfig.activityTime.startTime',
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2"
                                        data-oid="wqqx0jc"
                                    />

                                    <span className="text-gray-500" data-oid=":6nwl09">
                                        至
                                    </span>
                                    <input
                                        type="date"
                                        value={jsonData.basicConfig.activityTime.endDate.replace(
                                            /\//g,
                                            '-',
                                        )}
                                        onChange={(e) =>
                                            updateJsonField(
                                                'basicConfig.activityTime.endDate',
                                                e.target.value.replace(/-/g, '/'),
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2"
                                        data-oid="tonmmar"
                                    />

                                    <input
                                        type="time"
                                        value={jsonData.basicConfig.activityTime.endTime}
                                        onChange={(e) =>
                                            updateJsonField(
                                                'basicConfig.activityTime.endTime',
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2"
                                        data-oid="f0lsomi"
                                    />

                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        data-oid="t_i-dnx"
                                    >
                                        保存活动时间
                                    </button>
                                </div>
                            </div>

                            {/* 当前时间 */}
                            <div className="mb-6" data-oid="gxxjh2e">
                                <label
                                    className="block text-sm font-medium mb-3"
                                    data-oid="ick14wy"
                                >
                                    当前时间
                                </label>
                                <div className="flex items-center space-x-4" data-oid="s0wbbyx">
                                    <input
                                        type="number"
                                        value={jsonData.basicConfig.currentTime}
                                        onChange={(e) =>
                                            updateJsonField(
                                                'basicConfig.currentTime',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2 w-32"
                                        data-oid="kjous30"
                                    />

                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        data-oid="zz_bmy9"
                                    >
                                        保存当前时间
                                    </button>
                                </div>
                            </div>

                            {/* 功能开关配置 */}
                            <div className="mb-6" data-oid="nhp.4tb">
                                <label
                                    className="block text-sm font-medium mb-3"
                                    data-oid="c2mt7mv"
                                >
                                    功能开关配置
                                </label>
                                <div className="space-y-3" data-oid=".0u_c1x">
                                    <label className="flex items-center" data-oid="1w_scx_">
                                        <input
                                            type="checkbox"
                                            checked={jsonData.basicConfig.switches.sendSwitch}
                                            onChange={(e) =>
                                                updateJsonField(
                                                    'basicConfig.switches.sendSwitch',
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-5 h-5 text-blue-600 rounded mr-3"
                                            data-oid="160_.4d"
                                        />

                                        <span data-oid="59w-986">发送开关</span>
                                    </label>
                                    <label className="flex items-center" data-oid="h6kxc--">
                                        <input
                                            type="checkbox"
                                            checked={jsonData.basicConfig.switches.mailSwitch}
                                            onChange={(e) =>
                                                updateJsonField(
                                                    'basicConfig.switches.mailSwitch',
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-5 h-5 text-blue-600 rounded mr-3"
                                            data-oid="-82gnsh"
                                        />

                                        <span data-oid="qbeny:7">发邮件开关</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 数据配置 */}
                        <div data-oid="0i8:w9w">
                            <h2
                                className="text-lg font-medium mb-4 bg-gray-50 p-3 rounded"
                                data-oid="w99fi4q"
                            >
                                数据配置
                            </h2>

                            {/* 推中后发通知 */}
                            <div className="mb-6" data-oid="jhqvwnp">
                                <label
                                    className="block text-sm font-medium mb-3"
                                    data-oid="8s06z-3"
                                >
                                    推中后发通知
                                </label>
                                <div className="space-y-2" data-oid="2hr_7nw">
                                    {jsonData.dataConfig.notifications.map(
                                        (notification, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                                data-oid="-rnu2ue"
                                            >
                                                <input
                                                    type="text"
                                                    value={notification}
                                                    onChange={(e) => {
                                                        const newNotifications = [
                                                            ...jsonData.dataConfig.notifications,
                                                        ];

                                                        newNotifications[index] = e.target.value;
                                                        updateJsonField(
                                                            'dataConfig.notifications',
                                                            newNotifications,
                                                        );
                                                    }}
                                                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                                                    data-oid="f_2iffv"
                                                />

                                                <button
                                                    onClick={() => removeNotification(index)}
                                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                                    data-oid="qsop98n"
                                                >
                                                    -
                                                </button>
                                            </div>
                                        ),
                                    )}
                                    <div className="flex items-center space-x-2" data-oid="uf74h9o">
                                        <input
                                            type="text"
                                            value={newNotification}
                                            onChange={(e) => setNewNotification(e.target.value)}
                                            placeholder="添加新通知"
                                            className="border border-gray-300 rounded px-3 py-2 flex-1"
                                            data-oid="w_y57ps"
                                        />

                                        <button
                                            onClick={addNotification}
                                            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                                            data-oid="k_4o26-"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 数据表格 */}
                            <div className="mb-6" data-oid="u6v314g">
                                <label
                                    className="block text-sm font-medium mb-3"
                                    data-oid="xg0phk-"
                                >
                                    配置数据表
                                </label>
                                <div
                                    className="border border-gray-300 rounded overflow-hidden"
                                    data-oid="yhx-tu6"
                                >
                                    <table className="w-full" data-oid="etd_wc4">
                                        <thead className="bg-gray-50" data-oid="7zucrg8">
                                            <tr data-oid="1jzjk.q">
                                                <th
                                                    className="px-4 py-2 text-left"
                                                    data-oid="zg_hzcp"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedRows(
                                                                    jsonData.dataConfig.tableData.map(
                                                                        (row) => row.id,
                                                                    ),
                                                                );
                                                            } else {
                                                                setSelectedRows([]);
                                                            }
                                                        }}
                                                        className="w-4 h-4"
                                                        data-oid="w.i7ock"
                                                    />
                                                </th>
                                                <th
                                                    className="px-4 py-2 text-left"
                                                    data-oid="viixr5b"
                                                >
                                                    ID
                                                </th>
                                                <th
                                                    className="px-4 py-2 text-left"
                                                    data-oid="ks6tg4j"
                                                >
                                                    名称
                                                </th>
                                                <th
                                                    className="px-4 py-2 text-left"
                                                    data-oid="8hfr6a6"
                                                >
                                                    值
                                                </th>
                                                <th
                                                    className="px-4 py-2 text-left"
                                                    data-oid="09.x:xf"
                                                >
                                                    状态
                                                </th>
                                                <th
                                                    className="px-4 py-2 text-left"
                                                    data-oid="4919237"
                                                >
                                                    操作
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody data-oid="crp_o-k">
                                            {jsonData.dataConfig.tableData.map((row, index) => (
                                                <tr
                                                    key={row.id}
                                                    className="border-t"
                                                    data-oid="_ti17li"
                                                >
                                                    <td className="px-4 py-2" data-oid="bg7k2r1">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRows.includes(row.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedRows([
                                                                        ...selectedRows,
                                                                        row.id,
                                                                    ]);
                                                                } else {
                                                                    setSelectedRows(
                                                                        selectedRows.filter(
                                                                            (id) => id !== row.id,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                            data-oid="v5.7t9d"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2" data-oid="y15gu_1">
                                                        {row.id}
                                                    </td>
                                                    <td className="px-4 py-2" data-oid="i1324ty">
                                                        <input
                                                            type="text"
                                                            value={row.name}
                                                            onChange={(e) => {
                                                                const newTableData = [
                                                                    ...jsonData.dataConfig
                                                                        .tableData,
                                                                ];

                                                                newTableData[index].name =
                                                                    e.target.value;
                                                                updateJsonField(
                                                                    'dataConfig.tableData',
                                                                    newTableData,
                                                                );
                                                            }}
                                                            className="border border-gray-300 rounded px-2 py-1 w-full"
                                                            data-oid="jn8pqbp"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2" data-oid="d40qi8s">
                                                        <input
                                                            type="text"
                                                            value={row.value}
                                                            onChange={(e) => {
                                                                const newTableData = [
                                                                    ...jsonData.dataConfig
                                                                        .tableData,
                                                                ];

                                                                newTableData[index].value =
                                                                    e.target.value;
                                                                updateJsonField(
                                                                    'dataConfig.tableData',
                                                                    newTableData,
                                                                );
                                                            }}
                                                            className="border border-gray-300 rounded px-2 py-1 w-full"
                                                            data-oid="ywo3_.v"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2" data-oid="fabywtw">
                                                        <select
                                                            value={row.status}
                                                            onChange={(e) => {
                                                                const newTableData = [
                                                                    ...jsonData.dataConfig
                                                                        .tableData,
                                                                ];

                                                                newTableData[index].status =
                                                                    e.target.value;
                                                                updateJsonField(
                                                                    'dataConfig.tableData',
                                                                    newTableData,
                                                                );
                                                            }}
                                                            className="border border-gray-300 rounded px-2 py-1"
                                                            data-oid="corf391"
                                                        >
                                                            <option
                                                                value="active"
                                                                data-oid="lg0d.6m"
                                                            >
                                                                激活
                                                            </option>
                                                            <option
                                                                value="inactive"
                                                                data-oid="v2ze_pu"
                                                            >
                                                                未激活
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-2" data-oid="9lrxha.">
                                                        <button
                                                            onClick={() => {
                                                                const newTableData =
                                                                    jsonData.dataConfig.tableData.filter(
                                                                        (_, i) => i !== index,
                                                                    );
                                                                updateJsonField(
                                                                    'dataConfig.tableData',
                                                                    newTableData,
                                                                );
                                                            }}
                                                            className="text-red-500 hover:text-red-700"
                                                            data-oid="_nhyvt-"
                                                        >
                                                            删除
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* API操作和状态 */}
                        <div
                            className="flex items-center justify-between pt-6 border-t"
                            data-oid="::20-4d"
                        >
                            <div className="flex space-x-4" data-oid="l45p-ko">
                                <button
                                    onClick={fetchData}
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                    data-oid="de3t39j"
                                >
                                    获取数据
                                </button>
                                <button
                                    onClick={submitData}
                                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                                    data-oid="uz7:yvk"
                                >
                                    提交数据
                                </button>
                            </div>
                            {apiStatus && (
                                <div
                                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded"
                                    data-oid="bsu:t2q"
                                >
                                    {apiStatus}
                                </div>
                            )}
                        </div>

                        {/* JSON预览 */}
                        <div className="mt-8" data-oid=".4ep7us">
                            <h3 className="text-lg font-medium mb-4" data-oid="mq1ji_z">
                                JSON数据预览
                            </h3>
                            <pre
                                className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64"
                                data-oid="rw-5qb9"
                            >
                                {JSON.stringify(jsonData, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
