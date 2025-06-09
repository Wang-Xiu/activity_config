// 环境配置
export const ENV_CONFIG = {
    // 判断是否为生产环境
    isProd: process.env.NODE_ENV === 'production',

    // API基础URL
    API_BASE_URL: {
        test: 'https://testmqgitfrontend.meequ.cn/index.php',
        prod: 'https://prodmqgitfrontend.meequ.cn/index.php', // 请替换为实际的生产环境URL
    },

    // 通用参数
    COMMON_PARAMS: {
        debug: 1,
        password: '!!!!',
        uid: 100056,
        auth: 1,
        actId: 261,
    },
};

// 获取当前环境的API URL
export const getApiUrl = (endpoint: string): string => {
    const baseUrl = ENV_CONFIG.isProd ? ENV_CONFIG.API_BASE_URL.prod : ENV_CONFIG.API_BASE_URL.test;
    const params = new URLSearchParams({
        r: endpoint,
        debug: ENV_CONFIG.COMMON_PARAMS.debug.toString(),
        password: ENV_CONFIG.COMMON_PARAMS.password,
        uid: ENV_CONFIG.COMMON_PARAMS.uid.toString(),
        auth: ENV_CONFIG.COMMON_PARAMS.auth.toString(),
        actId: ENV_CONFIG.COMMON_PARAMS.actId.toString(),
    });
    return `${baseUrl}?${params.toString()}`;
};

// API端点
export const API_ENDPOINTS = {
    GET_CONFIG: 'activity/gemstone/setting',
    SAVE_CONFIG: 'activity/gemstone/save-config',
};
