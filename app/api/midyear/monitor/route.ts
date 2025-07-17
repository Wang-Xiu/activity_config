import { NextRequest, NextResponse } from 'next/server';
import { MonitorData } from '../../../../types/monitor';

// 模拟的监控数据
const mockMonitorData: MonitorData = {
  status: 'active',
  startTime: '2025-07-15 00:00:00',
  endTime: '2025-07-20 23:59:59',
  metrics: {
    userCount: 12345,
    giftCount: 5678,
    revenueTotal: 98765.43,
  },
  logs: [
    {
      time: '2025-07-17 10:15:23',
      level: 'info',
      message: '年中活动配置更新',
    },
    {
      time: '2025-07-17 09:30:45',
      level: 'warning',
      message: '礼物发放速率异常',
    },
    {
      time: '2025-07-17 08:45:12',
      level: 'error',
      message: '榜单数据同步失败',
    },
  ],
  charts: {
    hourlyUsers: [
      { hour: '00:00', count: 234 },
      { hour: '01:00', count: 123 },
      { hour: '02:00', count: 87 },
      { hour: '03:00', count: 65 },
      { hour: '04:00', count: 43 },
      { hour: '05:00', count: 32 },
      { hour: '06:00', count: 54 },
      { hour: '07:00', count: 87 },
      { hour: '08:00', count: 143 },
      { hour: '09:00', count: 232 },
      { hour: '10:00', count: 321 },
      { hour: '11:00', count: 456 },
      { hour: '12:00', count: 567 },
      { hour: '13:00', count: 678 },
      { hour: '14:00', count: 789 },
      { hour: '15:00', count: 890 },
      { hour: '16:00', count: 987 },
      { hour: '17:00', count: 876 },
      { hour: '18:00', count: 765 },
      { hour: '19:00', count: 654 },
      { hour: '20:00', count: 543 },
      { hour: '21:00', count: 432 },
      { hour: '22:00', count: 321 },
      { hour: '23:00', count: 210 },
    ],
    dailyRevenue: [
      { date: '2025-07-15', amount: 12345.67 },
      { date: '2025-07-16', amount: 23456.78 },
      { date: '2025-07-17', amount: 34567.89 },
    ],
  },
};

// GET 请求处理函数
export async function GET(request: NextRequest) {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    code: 0,
    message: 'success',
    data: mockMonitorData
  });
}