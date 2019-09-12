export class TreeHelper {
    public constructor() {

    }

    // 循环遍历树结构，找到对应的key，value的节点数组
    // 树结构要求 node = [{...,children:{...}},...]
    public static THFindMatchValue = (() => {
        let resultArr = new Array();
        let getTickMenuId = function (obj, key, val) {
            if (undefined == obj || null == obj || !(obj instanceof Object)) {
                return;
            }
            if (obj[key] == val) {
                resultArr.push(obj);
            }
            if (null != obj.children && obj.children instanceof Array) {
                for (let child of obj.children) {
                    getTickMenuId(child, key, val);
                }
            }
        };
        return (arr, key: string, val) => {
            resultArr = new Array();
            if (arr.length > 0) {
                for (let rootMenu of arr) {
                    getTickMenuId(rootMenu, key, val);
                }
            }
            return resultArr;
        };
    })();

    // 将数组通过parengId 匹配成树结构
    public static THArrayToTree(arr: Array<any>) {
        let map = {};
        arr.forEach(function (item) {
            // 删除所有 children,以防止多次调用
            delete item.children;
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            // map是有索引的
            map[item.id] = item;
        });
        let node = [];
        arr.forEach(function (item) {
            // 以当前遍历项，的pid,去map对象中找到索引的id
            let parent = map[item.parentId];
            // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 arr结果集中，作为顶级
                node.push(item);
            }
        });
        return node;
    }



}
