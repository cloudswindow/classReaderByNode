/**
 * 异常解析器
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
const ConstantPoolUtil = require('./ConstantPoolUtil');

module.exports = {
    read:function(stream){
        var exception = {};
        exception.startPc = stream.read(2).readInt16BE();
        exception.endPc = stream.read(2).readInt16BE();
        exception.handlerPc = stream.read(2).readInt16BE();
        exception.catchType = stream.read(2).readInt16BE();
        exception.catchTypeName = ConstantPoolUtil.findContentInPool(exception.catchType);
        return exception;
    }
}