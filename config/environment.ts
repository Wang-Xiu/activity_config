// 环境配置
export const ENV_CONFIG = {
    // 判断是否为生产环境
    isProduction: process.env.NODE_ENV === 'production',
    
    // 判断部署环境
    deployEnv: process.env.DEPLOY_ENV || 'test', // test | prod
    
    // 判断是否为构建时（避免构建时调用外部API）
    isBuildTime: process.env.BUILD_TIME === 'true' || process.env.NEXT_PHASE === 'phase-production-build',
    
    // API 基础配置
    api: {
        // 测试环境配置
        test: {
            baseUrl: process.env.API_BASE_URL || 'http://testmqgitfrontend.meequ.cn',
            getConfig: '/index.php?r=activity/gemstone/setting&uid=100056&auth=1&actId=261&debug=1',
            saveConfig: '/index.php?r=activity/gemstone/save-config&uid=100056&auth=1&actId=261&debug=1',
            getMonitorData: '/index.php?r=activity/gemstone/monitor-data&uid=100056&auth=1&actId=261&debug=1',
            getUniversalMonitorData: '/index.php?r=activity/act-common/monitor-data&uid=100056&auth=1&debug=1',
            getConfigByMidyear: '/index.php?r=activity/act-common/get-config&uid=100056&auth=1&debug=1',
            reloadCache: '/index.php?r=activity/act-common/reload-act&uid=100056&auth=1&debug=1',
            updateMaterialCache: '/index.php?r=activity/act-common/set-cattle-gift&uid=100056&auth=1&debug=1',
            saveUniversalConfig: '/index.php?r=activity/act-common/save-config&uid=100056&auth=1&debug=1',
            delRedisData: '/index.php?r=activity/act-common/del-redis-data&uid=100056&auth=1&debug=1',
            // 认证相关接口
            login: '/index.php?r=activity/act-common/login&debug=1&uid=100056&auth=1',
            verifyToken: '/index.php?r=activity/act-common/verify&debug=1&uid=100056&auth=1',
            // 字段名映射配置接口
            getExtConfigName: '/index.php?r=activity/act-common/get-ext-config-name&debug=1&uid=100056&auth=1',
        },
        // 生产环境配置
        production: {
            baseUrl: process.env.API_BASE_URL || 'https://mqfrontend.mizhuanbao.cn',
            getConfig: '/index.php?r=activity/gemstone/setting&uid=100056&auth=1&actId=261&debug=1',
            saveConfig: '/index.php?r=activity/gemstone/save-config&uid=100056&auth=1&actId=261&debug=1',
            getMonitorData: '/index.php?r=activity/gemstone/monitor-data&uid=100056&auth=1&actId=261&debug=1',
            getUniversalMonitorData: '/index.php?r=activity/act-common/monitor-data&uid=100056&auth=1&debug=1',
            getConfigByMidyear: '/index.php?r=activity/act-common/get-config&uid=100056&auth=1&debug=1',
            reloadCache: '/index.php?r=activity/act-common/reload-act&uid=100056&auth=1&debug=1',
            updateMaterialCache: '/index.php?r=activity/act-common/set-cattle-gift&uid=100056&auth=1&debug=1',
            saveUniversalConfig: '/index.php?r=activity/act-common/save-config&uid=100056&auth=1&debug=1',
            delRedisData: '/index.php?r=activity/act-common/del-redis-data&uid=100056&auth=1&debug=1',
            // 认证相关接口
            login: '/index.php?r=activity/act-common/login&debug=1&uid=100056&auth=1',
            verifyToken: '/index.php?r=activity/act-common/verify&debug=1&uid=100056&auth=1',
            // 字段名映射配置接口
            getExtConfigName: '/index.php?r=activity/act-common/get-ext-config-name&debug=1&uid=100056&auth=1',
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
export const buildApiUrl = (endpoint: 'getConfig' | 'saveConfig' | 'getMonitorData' | 'getUniversalMonitorData' | 'getConfigByMidyear' | 'reloadCache' | 'updateMaterialCache' | 'saveUniversalConfig' | 'delRedisData' | 'login' | 'verifyToken' | 'getExtConfigName') => {
    const config = getCurrentApiConfig();
    return `${config.baseUrl}${config[endpoint]}`;
};

// 获取环境信息（用于调试）
export const getEnvironmentInfo = () => {
    return {
        nodeEnv: process.env.NODE_ENV,
        deployEnv: ENV_CONFIG.deployEnv,
        isProduction: ENV_CONFIG.isProduction,
        isBuildTime: ENV_CONFIG.isBuildTime,
        apiBaseUrl: getCurrentApiConfig().baseUrl,
        debugMode: process.env.DEBUG_MODE === 'true',
    };
};