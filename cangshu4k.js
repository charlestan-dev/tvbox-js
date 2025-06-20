import { load, _ } from 'assets://js/lib/cat.js';
import "assets://js/lib/crypto-js.js";

let host = 'https://qjappcms.cs4k.top/api.php';

const UA = 'okhttp/3.14.9';


const Key = "Z98KXaLtO2wC1Pte";

const IV = "Z98KXaLtO2wC1Pte";

// 初始化配置
async function init(cfg) {
    // 	console.log("==========================================");
    // 	console.log(cfg.ext);
    // 	console.log("==========================================");
    // 	cfg.skey = '最新';
    // 	cfg.stype = '2'; // 假设 2 表示电影分类
}

// 解密函数
function decryptFun(encrydata) {
    const data = encrydata;
    const mode = "CBC";               //mode ECB CBC CFB OFB CTR
    const pad = "Pkcs7";              //padding Pkcs7 Iso10126 NoPadding ZeroPadding
    const key = Key;       //key AES-16/24/32byte DES-8byte 3DES-8/16/24byte
    const keyType = "Utf8";           //Utf8 Base64 Hex
    const iv = IV;         //iv AES-16byte DES-8byte 3DES-8byte
    const ivType = "Utf8";            //Utf8 Base64 Hex
    const isBase64 = true;           //待解密数据编码 true: Base64, false: Hex

    const crypto_key = CryptoJS.enc[keyType].parse(key);

    let cfg = {};
    (mode !== "ECB") && (cfg.iv = CryptoJS.enc[ivType].parse(iv));
    cfg.mode = CryptoJS.mode[mode];
    cfg.padding = CryptoJS.pad[pad];

    const cryptoData = isBase64 ? data : CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(data));
    const decrypt = CryptoJS.AES.decrypt(cryptoData, crypto_key, cfg)
    const result = CryptoJS.enc.Utf8.stringify(decrypt);
    const parsedJson = JSON.parse(result);
    return parsedJson;
}

/**
 * AES 加密函数
 * @param {string} rawdata - 要加密的原始字符串数据
 * @returns {string} 加密后的数据（默认 Base64 编码）
 */
function encryptFun(rawdata) {
    const mode = "CBC";               // ECB / CBC / CFB / OFB / CTR
    const pad = "Pkcs7";              // Pkcs7 / Iso10126 / NoPadding / ZeroPadding
    const key = Key;                  // 密钥（AES-16/24/32字节）
    const keyType = "Utf8";           // Utf8 / Base64 / Hex
    const iv = IV;                    // 初始化向量（IV），长度与算法匹配
    const ivType = "Utf8";            // Utf8 / Base64 / Hex
    const isBase64 = true;            // 输出格式：true=Base64, false=Hex

    // 解析密钥和 IV
    const crypto_key = CryptoJS.enc[keyType].parse(key);
    const cfg = {
        mode: CryptoJS.mode[mode],
        padding: CryptoJS.pad[pad]
    };

    if (mode !== "ECB") {
        cfg.iv = CryptoJS.enc[ivType].parse(iv);
    }

    // 将原始数据转为 WordArray 并进行加密
    const dataWordArray = CryptoJS.enc.Utf8.parse(rawdata);
    const encrypted = CryptoJS.AES.encrypt(dataWordArray, crypto_key, cfg);

    // 根据输出格式返回结果
    const result = isBase64 ? encrypted.toString() : encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return result;
}

// 封装请求
async function request(baseUrl, apiPath, params = {}, method = 'get') {
    let url = '';
    if (apiPath === '') {
        url = `${baseUrl}`;
    } else {
        // 拼接完整的 URL
        url = `${baseUrl}/${apiPath}`;
    }

    // 根据 HTTP 方法处理参数
    let reqOptions = {
        method: method,
        headers: {
            'User-Agent': UA//,
            // 'Host': "v.itcxo.cn"
        }
    };

    if (method.toLowerCase() === 'get') {
        // GET 请求：将参数拼接到 URL 的查询字符串中
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        reqOptions.url = queryString ? `${url}?${queryString}` : url;
    } else if (method.toLowerCase() === 'post') {
        // POST 请求：将参数作为请求体数据发送
        reqOptions.body = JSON.stringify(params);
        reqOptions.headers['Content-Type'] = 'application/json'; // 设置 Content-Type
    }

    // 发起请求
    // console.log("====================== Request =====================");
    // console.log('URL:', reqOptions.url || url);
    // console.log('Params:', params);
    // console.log('Header:', reqOptions.headers);
    const res = await req(reqOptions.url || url, reqOptions);
    return JSON.parse(res.content);
}

// 首页分类
async function home() {
    const classes = [
        { type_id: '20', type_name: '4k专区' },
        { type_id: '21', type_name: 'HD专区' },
        { type_id: '23', type_name: '电影' },
        { type_id: '22', type_name: '电视剧' },
        { type_id: '24', type_name: '动漫' },
        { type_id: '25', type_name: '综艺' },
        { type_id: '26', type_name: '短剧' }
    ];
    return JSON.stringify({ class: classes });
}

// 首页推荐
async function homeVod() {
    // 	try {
    // 		//         let html = await request(`https://gctf.tfdh.top/api.php/provide/vod/?ac=detail&t=1&pg=1`);
    // 		// let res = JSON.parse(html);
    // 		// let videos = [];
    // 		// if (res.data && res.data.vodrows) {
    // 		//     videos = res.data.vodrows
    // 		//         .filter(item => item.isvip !== "1")  // 新增过滤条件
    // 		//         .map(item => ({
    // 		//             vod_id: item.vodid,
    // 		//             vod_name: item.title,
    // 		//             vod_pic: item.vod_pic,
    // 		//             vod_remarks: item.duration,
    // 		//             vod_content: item.intro,
    // 		//             vod_year: item.yearname
    // 		//         }));
    // 		// }

    // 		// return JSON.stringify({
    // 		//     list: videos,
    // 		// });
    // 	} catch (error) {
    // 		console.error('请求失败:', error);
    // 		return JSON.stringify({ error: '请求失败' });
    // 	}
}

// 分类页
async function category(tid, pg, filter, extend) {

    let url = "qijiappapi.index/typeFilterVodList";
    const res = await request(host, url, {
        area: "全部",
        year: "全部",
        type_id: tid,
        page: pg,
        sort: "最新",
        lang: "全部",
        class: "全部"
        //...extend // 扩展参数（如筛选条件）
    }, "POST");
    let encrydata = res.data;
    let result = decryptFun(encrydata);
    let data = result.recommend_list;
    // 转换为目标格式
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: 99999999, // 总页数，默认为 1
        limit: 35, // 每页条数，默认为 20
        total: 99999999, // 总数据量，默认为 0
        list: (data || []).map(i => ({
            vod_id: i.vod_id, // 视频 ID
            vod_name: i.vod_name, // 视频名称
            vod_pic: i.vod_pic, // 视频封面图
            vod_year: i.vod_year, // 年份
            vod_remarks: i.vod_remarks // 视频备注信息
        }))
    });
}

// 详情页
async function detail(id) {
    let url = "qijiappapi.index/vodDetail2";
    const result = await request(host, url,
        {
            vod_id: id,
        }, "POST");
    let encrydata = result.data;
    let res = decryptFun(encrydata);
    //获取详情数据
    let vod = res.vod;
    //获取播放列表
    let vod_play_list = res.vod_play_list;
    // 提取播放器信息显示名称
    const vod_play_from = extractPlayerInfoShow(vod_play_list);

    // 转换为目标播放格式
    const vod_play_url = extractUrlsFormat(vod_play_list);

    return JSON.stringify({
        list: [{
            vod_id: vod.vod_id,
            vod_name: vod.vod_name,
            vod_content: vod.vod_content,
            vod_remarks: vod.vod_remarks,
            vod_sub: vod.vod_sub,
            vod_play_from: vod_play_from,
            vod_play_url: vod_play_url
        }]
    });
}

// 播放解析
async function play(flag, id, flags) {
    const parts = id.split("。");
    let play_url='';
    
    console.log(parts.length);
    if (parts.length>1&&parts[3]!=0) {
        const token2=parts[1];
        const parse=parts[2];
        const parse_type=parts[3];
        let playurl=encryptFun(parts[0]);
        let url="qijiappapi.index/vodParse"
    const result = await request(host, url, 
    {
        parse_api:parse,
        url:playurl,
        player_parse_type:parse_type,
        token:token2
    }, "POST");
    let encrydata = result.data;
    let res = decryptFun(encrydata);
     play_url = JSON.parse(res.json).url;
    }else   {
        play_url=parts[0]
    }
    return JSON.stringify({
        parse: 0, 
        jx: 0,
        url: play_url
    });
}

// 搜索
async function search(wd, quick) {
    let url = "qijiappapi.index/searchList"
    const res = await request(host, url,
        {
            "keywords": wd,
            "type_id": 0,
            "page": 1
        }, "POST");

    let result = decryptFun(res.data);
    let contents = result.search_list
    return JSON.stringify({
        list: (contents || []).map(i => ({
            vod_id: i.vod_id, // 视频 ID
            vod_name: i.vod_name, // 视频名称
            vod_pic: i.vod_pic, // 视频封面图
            vod_year: i.vod_year, // 年份
            vod_remarks: i.vod_remarks // 视频备注信息
        }))
    });
}

// 提取播放器信息展示
function extractPlayerInfoShow(data) {
    const playList = data;

    if (!Array.isArray(playList)) {
        return '';
    }

    const shows = playList
        .filter(item => item.player_info && item.player_info.show)
        .map(item => item.player_info.show);

    return shows.join('$$$');
}

// 提取播放链接格式化
function extractUrlsFormat(data) {
    const playList = data;

    // 安全获取 parse 字段，防止 playList[0] 或 player_info 不存在
    const parse = (playList?.[0]?.player_info?.parse || '').trim();
     // 安全获取 parse_type 字段，防止 playList[0] 或 player_info 不存在
    const parse_type = (playList?.[0]?.player_info?.parse_type || '').trim();

    if (!Array.isArray(playList)) return '';

    const result = playList
        .filter(item => Array.isArray(item.urls))
        .map(urlsGroup => {
            return urlsGroup.urls
                .filter(urlObj => urlObj.name && urlObj.url) // 先确保 name 和 url 存在
                .map(urlObj => {
                    const hasToken = urlObj.token?.toString().trim();
                    const hasParse = parse;
                    const hasParse_type=parse_type
                    if (hasToken || hasParse||hasParse_type) {
                        // 如果 token 或 parse 存在，才加上后面的部分
                        return `${urlObj.name}$${urlObj.url}。${hasToken || ''}。${hasParse || ''}。${hasParse_type || ''}`;
                    } else {
                        // 否则只保留基础部分
                        return `${urlObj.name}$${urlObj.url}`;
                    }
                })
                .join('#');
        })
        .filter(groupStr => groupStr) // 去除空字符串
        .join('$$$');

    return result;
}


export function __jsEvalReturn() {
    return { init, home, homeVod, category, detail, play, search };
}