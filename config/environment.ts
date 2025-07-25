// 环境配置
export const ENV_CONFIG = {
    // 判断是否为生产环境
    isProduction: process.env.NODE_ENV === 'production',
    
    // 判断部署环境
    deployEnv: process.env.DEPLOY_ENV || 'test', // test | prod
    
    // API 基础配置
    api: {
        // 测试环境配置
        test: {
            baseUrl: process.env.API_BASE_URL || 'http://testactivity.meequ.cn',
            getConfig: '/index.php?r=gemstone/setting&password=!!!!&uid=100056&auth=1&actId=261',
            saveConfig: '/index.php?r=gemstone/save-config&password=!!!!&uid=100056&auth=1&actId=261',
            getMonitorData: '/index.php?r=gemstone/monitor-data&password=!!!!&uid=100056&auth=1&actId=261',
            getConfigByMidyear: '/index.php?r=act-common/get-config&password=!!!!&uid=100056&auth=1',
            reloadCache: '/index.php?r=act-common/reload-act&password=!!!!&uid=100056&auth=1',
            updateMaterialCache: '/index.php?r=act-common/set-cattle-gift&password=!!!!&uid=100056&auth=1',
            saveUniversalConfig: '/index.php?r=act-common/save-config&password=!!!!&uid=100056&auth=1',
        },
        // 生产环境配置
        production: {
            baseUrl: process.env.API_BASE_URL || 'http://proactivity.meequ.cn',
            getConfig: '/index.php?r=gemstone/setting&password=!!!!&uid=100056&auth=1&actId=261',
            saveConfig: '/index.php?r=gemstone/save-config&password=!!!!&uid=100056&auth=1&actId=261',
            getMonitorData: '/index.php?r=gemstone/monitor-data&password=!!!!&uid=100056&auth=1&actId=261',
            getConfigByMidyear: '/index.php?r=act-common/get-config&password=!!!!&uid=100056&auth=1',
            reloadCache: '/index.php?r=act-common/reload-act&password=!!!!&uid=100056&auth=1',
            updateMaterialCache: '/index.php?r=act-common/set-cattle-gift&password=!!!!&uid=100056&auth=1',
            saveUniversalConfig: '/index.php?r=act-common/save-config&password=!!!!&uid=100056&auth=1',
        }
    }
};

// 获取当前环境的API配置
export const getCurrentApiConfig = () => {
    const deployEnv = ENV_CONFIG.deployEnv;
    
    // 根据部署环境选择配置
    if (deployEnv === 'prod') {
        return ENV_CONFIG.api.production;
    } else {
        return ENV_CONFIG.api.test;
    }
};

// 构建完整的API URL
export const buildApiUrl = (endpoint: 'getConfig' | 'saveConfig' | 'getMonitorData' | 'getConfigByMidyear' | 'reloadCache' | 'updateMaterialCache' | 'saveUniversalConfig') => {
    const config = getCurrentApiConfig();
    return `${config.baseUrl}${config[endpoint]}`;
};

// 获取环境信息（用于调试）
export const getEnvironmentInfo = () => {
    return {
        nodeEnv: process.env.NODE_ENV,
        deployEnv: ENV_CONFIG.deployEnv,
        isProduction: ENV_CONFIG.isProduction,
        apiBaseUrl: getCurrentApiConfig().baseUrl,
        debugMode: process.env.DEBUG_MODE === 'true',
    };
};