// 环境配置
export const ENV_CONFIG = {
    // 判断是否为生产环境
    isProduction: process.env.NODE_ENV === 'production',
    
    // API 基础配置
    api: {
        // 测试环境配置
        test: {
            baseUrl: 'https://testmqgitfrontend.meequ.cn',
            getConfig: '/index.php?r=activity/gemstone/setting&debug=1&password=!!!!&uid=100056&auth=1&actId=261&newH=1',
            saveConfig: '/index.php?r=activity/gemstone/save-config&debug=1&password=!!!!&uid=100056&auth=1&actId=261',
            getMonitorData: '/index.php?r=activity/gemstone/monitor-data&debug=1&password=!!!!&uid=100056&auth=1&actId=261'
        },
        // 生产环境配置
        production: {
            baseUrl: 'https://mqgitfrontend.meequ.cn',
            getConfig: '/index.php?r=activity/gemstone/setting&password=!!!!&uid=100056&auth=1&actId=261',
            saveConfig: '/index.php?r=activity/gemstone/save-config&password=!!!!&uid=100056&auth=1&actId=261',
            getMonitorData: '/index.php?r=activity/gemstone/monitor-data&password=!!!!&uid=100056&auth=1&actId=261'
        }
    }
};

// 获取当前环境的API配置
export const getCurrentApiConfig = () => {
    return ENV_CONFIG.isProduction ? ENV_CONFIG.api.production : ENV_CONFIG.api.test;
};

// 构建完整的API URL
export const buildApiUrl = (endpoint: 'getConfig' | 'saveConfig' | 'getMonitorData') => {
    const config = getCurrentApiConfig();
    return `${config.baseUrl}${config[endpoint]}`;
};