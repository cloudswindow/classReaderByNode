/**
 * 字段解析器
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
const AttributeReader = require('./attribute/AttributeReader');
const AccessFlag = require('./AccessFlags');
const ConstantPoolUtil = require('./ConstantPoolUtil');

module.exports = {
    read: function (stream) {
        var field = {}
        field.accessFlags = stream.read(2).readInt16BE()
        field.accessFlagNames = AccessFlag.getFlagNames(field.accessFlags,AccessFlag.Type.FIELD);
        field.nameIndex = stream.read(2).readInt16BE();
        field.name = ConstantPoolUtil.findContentInPool(field.nameIndex);
        field.descriptorIndex = stream.read(2).readInt16BE();
        field.descriptor = ConstantPoolUtil.findContentInPool(field.descriptorIndex);
        field.attributesCount = stream.read(2).readInt16BE();
        field.attributes = [];
        for(let j = 0; j < field.attributesCount; j++){
            field.attributes.push(AttributeReader.read(stream))
        }
        return field;
    }
}