import request from "@/utils/requset";

export function addDepartment(data){
    return request({
        url:"/department/addDepartment",
        method:"post",
        data
    })
}

export function getDepartmentList(){
    return request({
        url:"/department/getDepartment",
        method:"get"
    })
}

export function updateDepartment(data){
    return request({
        url:"/department/updateDepartment",
        method:"post",
        data
    })
}

export function deleteDepartment(id){
    return request({
        url:"/department/deleteDepartment",
        method:"delete",
        params: id
    })
}
