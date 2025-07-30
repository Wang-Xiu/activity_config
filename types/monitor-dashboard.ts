// 监控仪表盘数据类型定义

// 活动基础信息
export interface ActivityInfo {
    act_id: string;
    name: string;
    start_date: string;
    end_date: string;
    duration_days: number;
}

// 入口分解数据（可选）
export interface EntranceBreakdown {
    [key: string]: {
        pv: number;
        uv: number;
    };
}

// 每日PV/UV数据
export interface DailyPVUVData {
    date: string;
    pv: number;
    uv: number;
    entrance_breakdown?: EntranceBreakdown | null; // 可选字段，可为空
}

// PV/UV数据区域
export interface PVUVData {
    total: {
        total_pv: number;
        total_uv: number;
    };
    daily_data: DailyPVUVData[];
}

// 奖池每日数据
export interface PoolDailyData {
    date: string;
    input: number; // 投入（消耗）
    output: number; // 产出
    input_output_ratio: number; // 投入产出比
    participants: number; // 参与人数
    times: number; // 参与次数
}

// 奖池信息
export interface PoolInfo {
    pool_id: string;
    pool_name: string;
    daily_data: PoolDailyData[];
}

// 每日总计数据
export interface DailyTotalData {
    date: string;
    total_input: number;
    total_output: number;
    total_ratio: number;
}

// 奖池数据区域
export interface PoolData {
    pools: PoolInfo[];
    total_daily: DailyTotalData[];
}

// 额外指标
export interface AdditionalMetric {
    metric_name: string;
    metric_value: number;
    metric_unit: string;
}

// 活动总体汇总数据
export interface SummaryData {
    period_total: {
        total_consumption: number; // 活动期间总消耗
        total_production: number; // 活动期间总产出
        overall_ratio: number; // 总体投入产出比
        total_participants: number; // 总参与人数
        total_participation_times: number; // 总参与次数
        avg_daily_participants: number; // 日均参与人数
        avg_daily_times: number; // 日均参与次数
    };
    additional_metrics: AdditionalMetric[];
}

// 完整的监控仪表盘数据
export interface MonitorDashboardData {
    activity_info: ActivityInfo;
    pv_uv_data: PVUVData;
    pool_data: PoolData;
    summary_data: SummaryData;
}

// API响应类型
export interface MonitorDashboardResponse {
    code: number;
    msg: string;
    data: MonitorDashboardData;
}

// API请求参数
export interface MonitorDataRequest {
    act_id: string;
    date_range?: string; // 可选，格式：'2024-01-01,2024-01-07'
}

// 图表数据类型
export interface ChartDataPoint {
    name: string;
    value: number;
    [key: string]: any;
}

// 表格行数据类型
export interface TableRowData {
    key: string;
    [key: string]: any;
}