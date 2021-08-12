import request from "./http";

// 获取热搜
export function getSearchHot() {
    return request({
        url: "/search/hot",
        method: "get"
    })
}

// /search/suggest
// 获取搜索建议
export function getSearchSuggest(params) {
    return request({
        url: "/search/suggest",
        method: "get",
        params
    })
}