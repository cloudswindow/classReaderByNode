/**
 * 常量池获取utf8名称的工具模块
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
let _inited = false;
let _constantPool = null;

/**
 * 从常量池索引获取内容，可能需要多层次获取，用递归
 * @param index
 * @returns {*}
 */
const findContentInPool = function (index) {

    if (index < 1 || index > _constantPool.length + 1) {
        return ' =========  ERROR INDEX < 1 ========='
    }

    var constant = _constantPool[index - 1];
    if (null === constant) {

    }

    if (constant.type !== 'CONSTANT_Utf8') {

        var content = '';
        for (var name in constant) {
            if (name === 'index') {
                content += findContentInPool(constant.index)
            } else if (name.indexOf('Index') >= 0) {
                let index = constant[name];
                content += ' : ' + findContentInPool(index)
            }
        }
        return content;
    } else {
        return constant.value;
    }
}

module.exports = {
    init: function (constantPool) {
        _constantPool = constantPool;
        _inited = true;
    },
    findContentInPool : findContentInPool

}