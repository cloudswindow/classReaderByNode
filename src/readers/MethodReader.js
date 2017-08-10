/**
 * 方法解析器
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
const AttributeReader = require('./attribute/AttributeReader');
const AccessFlag = require('./AccessFlags');
const ConstantPoolUtil = require('./ConstantPoolUtil')

module.exports = {
    read:function(stream){
        var method = {};
        method.accessFlags = stream.read(2).readInt16BE();
        method.accessFlagNames = AccessFlag.getFlagNames(method.accessFlags,AccessFlag.Type.METHOD);
        method.nameIndex = stream.read(2).readInt16BE();
        method.name = ConstantPoolUtil.findContentInPool(method.nameIndex);
        method.descriptorIndex = stream.read(2).readInt16BE();
        method.descriptor = ConstantPoolUtil.findContentInPool(method.descriptorIndex);
        method.attributesCount = stream.read(2).readInt16BE();
        method.attributes = [];
        for(let j = 0 ; j < method.attributesCount;j++){
            method.attributes.push(AttributeReader.read(stream));
        }
        return method;
    }
}