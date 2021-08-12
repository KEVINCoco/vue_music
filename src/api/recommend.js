import request from "./http";

// 获取轮播图数据
export function getBanner() {
    return request({
        url: "/banner?type=2",
        method: "get"
    })
}

// 获取推荐歌单
export function getPersonalized() {
    return request({
        url: "/personalized?limit=6",
        method: "get"
    })
}

// /recommend/resource
// 获取每日推荐
export function getRecommendResource(params) {
    return request({
        url: "/recommend/resource",
        method: "get",
        params
    })
}