import request from "./http";

// /login/cellphone
export function getLoginCellphone(params) {
    return request({
        url: "/login/cellphone",
        method: "get",
        params
    })
}