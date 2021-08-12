import request from "./http";

// /top/artists?offset=0&limit=30
export function getTopArtist() {
    return request({
        url: "/top/artists",
        method: "get",
        params: {
            limit: 10
        }
    })
}

// /artist/list?type=1&area=96&initial=b
export function getArtistLists(params) {
    return request({
        url: "/artist/list",
        method: "get",
        params
    })
}

// /artist/top/song?id=6452
export function getArtistTop(params) {
    return request({
        url: "/artist/top/song",
        method: "get",
        params
    })
}

// /artists
// 获取歌手单曲
export function getArtists(params) {
    return request({
        url: "/artists",
        method: "get",
        params
    })
}