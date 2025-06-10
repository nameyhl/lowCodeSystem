import request from "@/utils/requset";

// 新增职位
export function addPosition(data) {
    return request({
        url: "/position/addPosition",
        method: "post",
        data,
    });
}
