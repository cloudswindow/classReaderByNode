/**
 * class 类文件解析
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
const ConstantPoolReader = require('./ConstantPoolReader');
const AccessFlag = require('./AccessFlags');
const ConstantPoolUtil = require('./ConstantPoolUtil');
const FieldReader = require('./FieldReader');
const MethodReader = require('./MethodReader');
const AttributeReader = require('./attribute/AttributeReader');


module.exports = {
    read: function (stream) {
        var clazz = {}
        // 1.0 解析魔数--------------------------------------------------------------------------------------------------
        clazz.magic = stream.read(4).toString('hex');

        // 2.0 解析小版本------------------------------------------------------------------------------------------------
        clazz.minorVersion = stream.read(2).readInt16BE();//16bit 整数大端序

        // 3.0 解析主版本------------------------------------------------------------------------------------------------
        clazz.majorVersion = stream.read(2).readInt16BE();//16bit 整数大端序

        // 4.1 获取常量池大小---------------------------------------------------------------------------------------------
        clazz.constantPoolCount = stream.read(2).readInt16BE();
        clazz.constantPool = [];
        // 4.2 解析常量池的每个常量
        for (let i = 0; i < clazz.constantPoolCount - 1; i++) {
            clazz.constantPool.push(ConstantPoolReader.read(stream))
        }

        // 初始化常量池的数据
        ConstantPoolUtil.init(clazz.constantPool);
        //  4.3 解析常量池中引用常量的值
        for (let i = 0; i < clazz.constantPoolCount - 1; i++) {
            let constant = clazz.constantPool[i];
            for (var name in constant) {
                if (name === 'index') {
                    constant._value = ConstantPoolUtil.findContentInPool(constant.index);
                } else if (name.indexOf('Index') >= 0) {
                    constant['_' + name.substring(0, name.indexOf('Index')) + 'Value'] = ConstantPoolUtil.findContentInPool(constant[name])
                }
            }
        }


        // 5.1 访问标志，为各种访问标志类型的累加值，使用 AccessFlag.getFlag 通过遍历与运算得到所有标志---------------------------
        clazz.accessFlags = stream.read(2).readInt16BE()
        // 5.2 解析访问标志的名称
        clazz.accessFlagNames = AccessFlag.getFlagNames(clazz.accessFlags,AccessFlag.Type.CLASS);

        // 6.0 thisClass -----------------------------------------------------------------------------------------------
        clazz.thisClass = stream.read(2).readInt16BE();
        // 6.1 获取名字
        clazz.thisClassName = ConstantPoolUtil.findContentInPool(clazz.thisClass)

        //7.0 supperClass ----------------------------------------------------------------------------------------------
        clazz.supperClass = stream.read(2).readInt16BE();
        // 7.1 获取名称
        clazz.supperClassName = ConstantPoolUtil.findContentInPool(clazz.supperClass)


        // 8.1 解析接口 -------------------------------------------------------------------------------------------------
        clazz.interfacesCount = stream.read(2).readInt16BE();
        clazz.interfaces = []
        for (let i = 0; i < clazz.interfacesCount; i++) {
            clazz.interfaces.push(stream.read(2).readInt16BE())
        }

        // 9.0解析字段---------------------------------------------------------------------------------------------------
        // field 表结构
        clazz.fieldsCount = stream.read(2).readInt16BE();
        clazz.fields = [];
        for(let i = 0; i < clazz.fieldsCount;i++){
            clazz.fields.push(FieldReader.read(stream));
        }

        // 10.0解析方法
        clazz.methodsCount = stream.read(2).readInt16BE();
        clazz.methods = [];
        for(let i = 0 ; i < clazz.methodsCount; i++){
            clazz.methods.push(MethodReader.read(stream));
        }

        // 11.0 属性解析
        clazz.attributesCount = stream.read(2).readInt16BE();
        clazz.attributes = [];
        for(let i = 0 ; i < clazz.attributesCount; i++){
            clazz.attributes.push(AttributeReader.read(stream))
        }

        stream.close();

        return clazz;
    }
}