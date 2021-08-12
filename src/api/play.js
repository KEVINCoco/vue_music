import request from "./http";

// 通过id 获取歌曲url
// /song/url?id=1854142292
export function getSongUrl(params) {
    return request({
        url: "/song/url",
        method: "get",
        params
    })
}

// 通过id 获取歌曲url
// /song/detail?ids=1854142292
export function getSongDetail(params) {
    return request({
        url: "/song/detail",
        method: "get",
        params
    })
}

// 通过id 获取歌词
// http://localhost:3000/lyric?id=33894312
export function getLyric(params) {
    return request({
        url: "/lyric",
        method: "get",
        params
    })
}