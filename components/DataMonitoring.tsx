'use client';

import { useState } from 'react';

interface DataItem {
    name: string;
    daily: number;
    total: number;
    people?: number;
    times?: number;
}

export default function DataMonitoring() {
    const [activeDataTab, setActiveDataTab] = useState('overview');

    // 模拟数据
    const boxData: DataItem[] = [
        { name: '光华宝箱', daily: 1250, total: 15600, people: 890, times: 1250 },
        { name: '月华宝箱', daily: 680, total: 8900, people: 520, times: 680 },
    ];

    const taskData: DataItem[] = [
        { name: '访问首充礼包页面', daily: 450, total: 5600, people: 450, times: 450 },
        { name: '访问师徒页面', daily: 320, total: 4200, people: 320, times: 320 },
        { name: '访问特惠礼包页面', daily: 280, total: 3800, people: 280, times: 280 },
        { name: '房间停留3分钟', daily: 180, total: 2400, people: 180, times: 180 },
    ];

    const entryData: DataItem[] = [
        { name: '首页入口', daily: 2800, total: 35000 },
        { name: '活动页入口', daily: 1900, total: 24000 },
        { name: '弹窗入口', daily: 1200, total: 15000 },
    ];

    const renderDataTable = (data: DataItem[], showPeopleAndTimes: boolean = false) => (
        <div className="overflow-x-auto" data-oid="xsag._7">
            <table className="w-full border-collapse border border-gray-300" data-oid="_4zuwj_">
                <thead data-oid="t:.ie8y">
                    <tr className="bg-gray-100" data-oid="rh1zetv">
                        <th
                            className="border border-gray-300 px-4 py-2 text-left"
                            data-oid="v.fwr7j"
                        >
                            项目
                        </th>
                        <th
                            className="border border-gray-300 px-4 py-2 text-center"
                            data-oid="9if28sy"
                        >
                            今日
                        </th>
                        <th
                            className="border border-gray-300 px-4 py-2 text-center"
                            data-oid="a9qertr"
                        >
                            总计
                        </th>
                        {showPeopleAndTimes && (
                            <>
                                <th
                                    className="border border-gray-300 px-4 py-2 text-center"
                                    data-oid="zt.bc28"
                                >
                                    人数
                                </th>
                                <th
                                    className="border border-gray-300 px-4 py-2 text-center"
                                    data-oid="t12q_ao"
                                >
                                    次数
                                </th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody data-oid="cmgiax0">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50" data-oid="zm7b3e:">
                            <td className="border border-gray-300 px-4 py-2" data-oid="8k:49t_">
                                {item.name}
                            </td>
                            <td
                                className="border border-gray-300 px-4 py-2 text-center"
                                data-oid=":hhjnhc"
                            >
                                {item.daily.toLocaleString()}
                            </td>
                            <td
                                className="border border-gray-300 px-4 py-2 text-center"
                                data-oid="vkdm66k"
                            >
                                {item.total.toLocaleString()}
                            </td>
                            {showPeopleAndTimes && (
                                <>
                                    <td
                                        className="border border-gray-300 px-4 py-2 text-center"
                                        data-oid="hlib--6"
                                    >
                                        {item.people?.toLocaleString()}
                                    </td>
                                    <td
                                        className="border border-gray-300 px-4 py-2 text-center"
                                        data-oid="e-jec25"
                                    >
                                        {item.times?.toLocaleString()}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderChart = (data: DataItem[], title: string) => (
        <div className="bg-white p-4 rounded-lg border" data-oid="wlkaloy">
            <h4 className="font-medium mb-4" data-oid="yo-9ilc">
                {title}
            </h4>
            <div className="space-y-2" data-oid="1z3s6e8">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center" data-oid="5fm4s.q">
                        <span className="w-32 text-sm" data-oid="iuxf413">
                            {item.name}
                        </span>
                        <div
                            className="flex-1 bg-gray-200 rounded-full h-4 mx-2"
                            data-oid="3ddl0tf"
                        >
                            <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{
                                    width: `${(item.daily / Math.max(...data.map((d) => d.daily))) * 100}%`,
                                }}
                                data-oid="q48tlwd"
                            ></div>
                        </div>
                        <span className="w-16 text-sm text-right" data-oid="pp8lc23">
                            {item.daily}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6" data-oid="uk1inib">
            <h3 className="text-lg font-medium mb-4" data-oid="nu_gjzt">
                数据监控
            </h3>

            {/* 数据监控子标签 */}
            <div className="flex space-x-4 border-b" data-oid="bii3yxu">
                <button
                    className={`px-4 py-2 border-b-2 ${
                        activeDataTab === 'overview'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent'
                    }`}
                    onClick={() => setActiveDataTab('overview')}
                    data-oid="bmq7abs"
                >
                    数据总览
                </button>
                <button
                    className={`px-4 py-2 border-b-2 ${
                        activeDataTab === 'charts'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent'
                    }`}
                    onClick={() => setActiveDataTab('charts')}
                    data-oid="l:-rvmo"
                >
                    图表分析
                </button>
                <button
                    className={`px-4 py-2 border-b-2 ${
                        activeDataTab === 'details'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent'
                    }`}
                    onClick={() => setActiveDataTab('details')}
                    data-oid="tzhxtz_"
                >
                    详细数据
                </button>
            </div>

            {/* 数据内容 */}
            {activeDataTab === 'overview' && (
                <div className="space-y-6" data-oid="-:vt3jj">
                    {/* 宝箱数据 */}
                    <div data-oid="kzt23ed">
                        <h4 className="font-medium mb-3" data-oid="4a6.qhw">
                            宝箱产出数据
                        </h4>
                        {renderDataTable(boxData, true)}
                    </div>

                    {/* 活动总产出 */}
                    <div className="grid grid-cols-3 gap-4" data-oid="b9n0jmm">
                        <div className="bg-blue-50 p-4 rounded-lg" data-oid="en44pq4">
                            <h5 className="font-medium text-blue-800" data-oid="5123.hc">
                                今日总产出
                            </h5>
                            <p className="text-2xl font-bold text-blue-600" data-oid="8_raao0">
                                1,930
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg" data-oid="1wb8rlq">
                            <h5 className="font-medium text-green-800" data-oid=".fd0uzb">
                                今日参与人数
                            </h5>
                            <p className="text-2xl font-bold text-green-600" data-oid="yxskt0_">
                                1,410
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg" data-oid="qamdbm9">
                            <h5 className="font-medium text-purple-800" data-oid="ki5net7">
                                已点亮宝石用户
                            </h5>
                            <p className="text-2xl font-bold text-purple-600" data-oid="c4quvhp">
                                856
                            </p>
                        </div>
                    </div>

                    {/* 其他关键数据 */}
                    <div className="grid grid-cols-2 gap-6" data-oid="d2qhh82">
                        <div className="bg-white p-4 rounded-lg border" data-oid="wpat.-7">
                            <h5 className="font-medium mb-3" data-oid="4r57_tv">
                                洗手池数据
                            </h5>
                            <div className="space-y-2" data-oid="nv1vloz">
                                <div className="flex justify-between" data-oid="pc0k0pn">
                                    <span data-oid="n7p2te4">PV:</span>
                                    <span className="font-medium" data-oid="29vaz43">
                                        2,450
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid="k1thg7p">
                                    <span data-oid="l90a7hk">UV:</span>
                                    <span className="font-medium" data-oid=":l4hse-">
                                        1,680
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border" data-oid="ygjwsdz">
                            <h5 className="font-medium mb-3" data-oid="xupn3x9">
                                寿星奖励
                            </h5>
                            <div className="space-y-2" data-oid="4pp.gg.">
                                <div className="flex justify-between" data-oid="eri9jqx">
                                    <span data-oid="97-qlu9">领取人数:</span>
                                    <span className="font-medium" data-oid="xv01p8o">
                                        234
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid="uogut-9">
                                    <span data-oid="e3dv28s">领取次数:</span>
                                    <span className="font-medium" data-oid="lwcm0d7">
                                        456
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeDataTab === 'charts' && (
                <div className="space-y-6" data-oid="2aof:10">
                    <div className="grid grid-cols-2 gap-6" data-oid="po5v4b0">
                        {renderChart(boxData, '宝箱产出对比')}
                        {renderChart(taskData, '任务完成情况')}
                    </div>
                    <div className="grid grid-cols-1 gap-6" data-oid="1342kf-">
                        {renderChart(entryData, '入口访问量')}
                    </div>
                </div>
            )}

            {activeDataTab === 'details' && (
                <div className="space-y-6" data-oid="h15lukx">
                    {/* 任务完成数据 */}
                    <div data-oid="0:h4.45">
                        <h4 className="font-medium mb-3" data-oid="v5v4281">
                            任务完成数据
                        </h4>
                        {renderDataTable(taskData, true)}
                    </div>

                    {/* 入口PV/UV数据 */}
                    <div data-oid=".60_a:v">
                        <h4 className="font-medium mb-3" data-oid="v2qk96w">
                            入口访问数据
                        </h4>
                        {renderDataTable(entryData)}
                    </div>

                    {/* 道具数据 */}
                    <div data-oid="24zkazq">
                        <h4 className="font-medium mb-3" data-oid="oxprecc">
                            道具产出与使用
                        </h4>
                        <div className="overflow-x-auto" data-oid="jjednkl">
                            <table
                                className="w-full border-collapse border border-gray-300"
                                data-oid="w_4zgtl"
                            >
                                <thead data-oid="oc6kazm">
                                    <tr className="bg-gray-100" data-oid="j_n44f5">
                                        <th
                                            className="border border-gray-300 px-4 py-2 text-left"
                                            data-oid="2nhttvd"
                                        >
                                            道具类型
                                        </th>
                                        <th
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="od4zfx2"
                                        >
                                            产出数量
                                        </th>
                                        <th
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="8dkd17g"
                                        >
                                            已使用数量
                                        </th>
                                        <th
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="5pzq179"
                                        >
                                            剩余数量
                                        </th>
                                    </tr>
                                </thead>
                                <tbody data-oid="suztae7">
                                    <tr className="hover:bg-gray-50" data-oid="m:-hh83">
                                        <td
                                            className="border border-gray-300 px-4 py-2"
                                            data-oid="09b:hdu"
                                        >
                                            光华宝箱
                                        </td>
                                        <td
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="uuad7g3"
                                        >
                                            15,600
                                        </td>
                                        <td
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="j.h3bcj"
                                        >
                                            12,400
                                        </td>
                                        <td
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="k-dz9qo"
                                        >
                                            3,200
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50" data-oid="-64a_27">
                                        <td
                                            className="border border-gray-300 px-4 py-2"
                                            data-oid="c139-r1"
                                        >
                                            月华宝箱
                                        </td>
                                        <td
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="9krh8t8"
                                        >
                                            8,900
                                        </td>
                                        <td
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="w.dr1tv"
                                        >
                                            7,200
                                        </td>
                                        <td
                                            className="border border-gray-300 px-4 py-2 text-center"
                                            data-oid="bva_o-v"
                                        >
                                            1,700
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 特别活动数据 */}
                    <div className="bg-white p-4 rounded-lg border" data-oid="0s:5rxg">
                        <h4 className="font-medium mb-3" data-oid="ejpr1yd">
                            你最特别报名数据
                        </h4>
                        <div className="text-center" data-oid="xu:3s:e">
                            <span className="text-3xl font-bold text-orange-600" data-oid="yq.ee2h">
                                1,234
                            </span>
                            <p className="text-gray-600 mt-2" data-oid="67ulnmo">
                                累计报名人数
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
