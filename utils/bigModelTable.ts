/**
 * 表格粘贴须在某一行内同时出现：售价、id、类型、数量、礼物名字（或礼物名）、礼物价值、权重
 * 表头可为「类型(gift_type)」等形式（制表符、全角括号已规范化比对；id 列为英文列名）
 */

/** 用于「是否缺列」提示文案 */
export const BIGMODEL_TABLE_HEADER_LABELS = '售价、id、类型、数量、礼物名字、礼物价值、权重';

const BASE_HEADER_KEYS = ['售价', '类型', '数量', '礼物价值', '权重'] as const;

/** 表头行须含独立的 id 列名（英文 id / ID），避免与 gift_id 等词误匹配 */
function rowHasIdColumnHeader(hayNorm: string): boolean {
    return /\bid\b/i.test(hayNorm);
}

export const BIGMODEL_SYSTEM_PROMPT =
    '你是活动运营辅助助手。用户粘贴的表格来自运营侧排期表，列通常包含：售价、id、类型(gift_type)、数量、礼物名字、礼物价值、权重；可能含制表符、空售价继承、汇总百分比行。输出 JSON 时 gift_id 必须与表格「id」列逐行一致（字符串）；gift_num 必须与表格「数量」列逐行一致（字符串），禁止写死为 "1" 除非该行数量确为 1。';

/** 无自定义说明时附加的默认任务描述（与业务示例结构一致） */
export const BIGMODEL_DEFAULT_TABLE_TASK = `请根据上表生成活动「覆盖物料」用的 JSON 配置。

【如何读表】
- 「售价」列有数字的行：新开一个奖池/价位档；紧随其下「售价」为空的行仍属于同一奖池（继承上一档售价）。
- 「id」列：每行礼物对应的标识；输出对象中的 gift_id 必须与该行「id」列文本完全一致（转为字符串，如 "123"、"114"），禁止根据礼物名字改写或猜测。
- 「类型」或「类型(gift_type)」列：对应输出字段 gift_type（字符串）。
- 「数量」列：对应输出字段 gift_num（字符串），必须与该行单元格内容一致（如 1、24），不得忽略或统一改写。
- 「礼物名字」列：礼物名称，仅作核对与 remark 等辅助信息，不用于生成 gift_id。
- 「礼物价值」：定价参考。
- 「权重」列：如 32.6% → real_probability 为 "32.6"（去掉百分号，与示例小数位一致）。跳过明显为汇总/合计的行（如整段 100.00% 合计）。

【输出结构】
- 根对象：键为 "1"、"2"、"3"… 字符串，按表格中价池从上到下的顺序编号。
- 每个价池内：键为 "1"、"2"、"3"… 字符串，对应该池内每条礼物（按表格顺序，不含汇总行）。
- 每个礼物对象字段（全部为字符串）：gift_id, gift_type, gift_num, is_piaoping, is_sliver, is_import, tag, real_probability, remark。其中 gift_num 仅来自该行「数量」列。
- remark 格式：奖池{外层序号}-{该价池售价数字}，例如 奖池1-500、奖池2-3000、奖池3-9999。
- is_piaoping、is_sliver、is_import、tag 按礼物价值与概率档位做合理分层（可参考同类配置：高价值/低概率可 is_piaoping 为 "1"、tag 递减等），与表内数据自洽。

仅输出一个合法 JSON 对象，不要 Markdown 代码围栏，不要前言后语。`;

export function normalizeBigModelTableCell(s: string): string {
    return s.replace(/（/g, '(').replace(/）/g, ')').replace(/\t/g, ' ');
}

export type BigModelTableValidationError = {
    code: 'PARAM_ILLEGAL';
    message: string;
};

function rowHasGiftNameColumn(row: string, hayNorm: string): boolean {
    return hayNorm.includes('礼物名字') || hayNorm.includes('礼物名');
}

function rowHasAllBaseHeaders(row: string, hayNorm: string): boolean {
    for (const key of BASE_HEADER_KEYS) {
        const needle = normalizeBigModelTableCell(key);
        if (!hayNorm.includes(needle) && !row.includes(key)) {
            return false;
        }
    }
    return true;
}

export function validateBigModelTableHeaders(tableText: string): BigModelTableValidationError | null {
    if (tableText.trim() === '') {
        return {
            code: 'PARAM_ILLEGAL',
            message: '表格不规范：提交内容为空，请粘贴完整表格。',
        };
    }

    const lines = tableText.split(/\r\n|\r|\n/);

    const rowHasHeader = (row: string): boolean => {
        const hayNorm = normalizeBigModelTableCell(row);
        return (
            rowHasIdColumnHeader(hayNorm) &&
            rowHasGiftNameColumn(row, hayNorm) &&
            rowHasAllBaseHeaders(row, hayNorm)
        );
    };

    const maxScan = 30;
    let seen = 0;
    for (const line of lines) {
        const row = line.trim();
        if (row === '') {
            continue;
        }
        seen += 1;
        if (seen > maxScan) {
            break;
        }
        if (rowHasHeader(row)) {
            return null;
        }
    }

    const missingCols: string[] = [];
    for (const key of BASE_HEADER_KEYS) {
        const needle = normalizeBigModelTableCell(key);
        let foundAnywhere = false;
        for (const line of lines) {
            const row = line.trim();
            if (row === '') {
                continue;
            }
            const hayNorm = normalizeBigModelTableCell(row);
            if (hayNorm.includes(needle) || row.includes(key)) {
                foundAnywhere = true;
                break;
            }
        }
        if (!foundAnywhere) {
            missingCols.push(key);
        }
    }

    let giftNameFound = false;
    for (const line of lines) {
        const row = line.trim();
        if (row === '') {
            continue;
        }
        const hayNorm = normalizeBigModelTableCell(row);
        if (rowHasGiftNameColumn(row, hayNorm)) {
            giftNameFound = true;
            break;
        }
    }
    if (!giftNameFound) {
        missingCols.push('礼物名字');
    }

    let idHeaderFound = false;
    for (const line of lines) {
        const row = line.trim();
        if (row === '') {
            continue;
        }
        const hayNorm = normalizeBigModelTableCell(row);
        if (rowHasIdColumnHeader(hayNorm)) {
            idHeaderFound = true;
            break;
        }
    }
    if (!idHeaderFound) {
        missingCols.push('id');
    }

    if (missingCols.length > 0) {
        return {
            code: 'PARAM_ILLEGAL',
            message: `表格不规范：缺少必填列「${missingCols.join('」「')}」。请确认表头行同时包含「${BIGMODEL_TABLE_HEADER_LABELS}」（「类型」可与 gift_type 同列，如 类型(gift_type)；id 为英文列名）。`,
        };
    }

    return {
        code: 'PARAM_ILLEGAL',
        message: `表格不规范：必填列「${BIGMODEL_TABLE_HEADER_LABELS}」须出现在同一表头行内；请完整复制表头行后再提交。`,
    };
}

export function buildBigModelUserContent(tableText: string, userInstruction: string | null | undefined): string {
    const instruction = (userInstruction ?? '').trim();
    if (instruction !== '') {
        return `${instruction}\n\n${tableText}`;
    }
    return `${BIGMODEL_DEFAULT_TABLE_TASK}\n\n${tableText}`;
}
