/** act-common/get-act-info 返回 data */
export interface ActInfoData {
    id: string;
    activity_type: string;
    activity_name: string;
    activity_remark: string;
    activity_alias: string;
    start_time: string;
    end_time: string;
    cur_time: string;
    create_time: string;
    status: string;
    activity_url: string;
    operator: string;
    update_time: string;
    version: string;
}

export interface ActInfoBackendResponse {
    code: number;
    msg: string;
    data: ActInfoData;
    success?: boolean;
}
