import request from "./http";
// http://127.0.0.1:3000/toplist

// 获取mv视频
export function getMvExclusive(params) {
    return request({
        url: "/mv/exclusive/rcmd",
        method: "get",
        params
    })
}

// 获取mv视频url
export function getMvUrl(params) {
    return request({
        url: "/mv/url",
        method: "get",
        params
    })
}

// /mv/detail/info
// 获取mv点赞评论转发数据
export function getMvDetailInfo(params) {
    return request({
        url: "/mv/detail/info",
        method: "get",
        params
    })
}

// /resource/like
// 资源点赞
export function getResourceLike(params) {
    return request({
        url: "/resource/like",
        method: "get",
        params
    })
}