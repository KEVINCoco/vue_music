import request from "./http";

export function getTopList() {
    return request({
        url: "/toplist",
        method: "get"
    })
}

// http://127.0.0.1:3000/playlist/detail?id=19723756
export function getPlaylistDetail(params) {
    return request({
        url: "/playlist/detail",
        method: "get",
        params
    })
}