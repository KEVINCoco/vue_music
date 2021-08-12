import request from "./http";

// /user/detail
export function getUserDetail(params) {
    return request({
        url: "/user/detail",
        method: "get",
        params
    })
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
// /user/subcount
export function getUserSubcount(params) {
    return request({
        url: "/user/subcount",
        method: "get",
        params
    })
}

// /user/playlist
// 获取用户歌单
export function getUserPlaylist(params) {
    return request({
        url: "/user/playlist",
        method: "get",
        params
    })
}