import Vue from 'vue'
import VueRouter from 'vue-router'
import recommend from "../views/recommend.vue"

Vue.use(VueRouter)

let beforeEnter = (to, from, next) => {
    let token = window.localStorage.getItem("token");
    if (!token) {
        next("/login");
        return;
    } else {
        next();
    }
}

const routes = [{
    path: "/",
    redirect: "/recommend"
}, {
    path: "/recommend",
    name: "recommend",
    meta: {
        headerNav: true
    },
    component: recommend,
    beforeEnter
}, {
    path: "/recommend/recommendlist",
    name: "recommendlist",
    component: () =>
        import ("../components/recommend/recommendlist.vue")
}, {
    path: "/single",
    name: "single",
    meta: {
        headerNav: true
    },
    component: () =>
        import ("../views/single.vue")
}, {
    path: "/single/singlelist",
    name: "singlelist",
    component: () =>
        import ("../components/single/singlelist.vue")
}, {
    path: "/rank",
    name: "rank",
    meta: {
        headerNav: true
    },
    component: () =>
        import ("../views/rank.vue")
}, {
    path: "/rank/ranklist",
    name: "ranklist",
    component: () =>
        import ("../components/rank/ranklist.vue")
}, {
    path: "/video",
    name: "video",
    meta: {
        headerNav: true
    },
    component: () =>
        import ("../views/video.vue")
}, {
    path: "/search/search",
    name: "search",
    component: () =>
        import ("../components/search/search.vue")
}, {
    path: "/login",
    name: "login",
    component: () =>
        import ("../components/base/login.vue")
}, {
    path: "/userInfo",
    name: "userInfo",
    component: () =>
        import ("../views/userInfo.vue"),
    beforeEnter
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router