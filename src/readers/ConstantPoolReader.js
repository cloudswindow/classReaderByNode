/**
 * 常量池解析
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
const cpInfo = {
    "1" : "CONSTANT_Utf8",
    "3" : "CONSTANT_Integer",
    "4" : "CONSTANT_Float",
    "5" : "CONSTANT_Long",
    "6" : "CONSTANT_Double",
    "7" : "CONSTANT_Class",
    "8" : "CONSTANT_String",
    "9" : "CONSTANT_Fieldref",
    "10" : "CONSTANT_Methodref",
    "11" : "CONSTANT_InterfaceMethodref",
    "12" : "CONSTANT_NameAndType",
    "15" : "CONSTANT_MethodHandle",
    "16" : "CONSTANT_MethodType",
    "18" : "CONSTANT_InvokeDynamic"
}


module.exports = {
    read: function (stream) {
        let tag = stream.read(1).readInt8();
        var constant = {
            type: cpInfo[tag]
        }
        switch (tag) {
            case 1: //UTF8
                constant.len = stream.read(2).readInt16BE();
                constant.value = stream.read(constant.len).toString();
                break;
            case 3: // Integer u4
                constant.value = stream.read(4).readInt32BE();
                break;
            case 4: // Float u4
                constant.value = stream.read(4).readFloatBE();
                break;
            case 5: // Long u8
                constant.value = stream.read(8).toString('hex');
                break;
            case 6: // Double u8
                constant.value = stream.read(8).toString('hex');
                break;
            case 7: // class
                constant.index = stream.read(2).readInt16BE();
                break;
            case 8: // string 注意，string也是使用索引指向内容
                constant.index = stream.read(2).readInt16BE();
                break;
            case 9: // Fieldref
                constant.classInfoIndex = stream.read(2).readInt16BE();
                constant.nameTypeInfoIndex = stream.read(2).readInt16BE();
                break;
            case 10: // Methodref
                constant.classInfoIndex = stream.read(2).readInt16BE();
                constant.nameTypeInfoIndex = stream.read(2).readInt16BE();
                break;
            case 11:// CONSTANT_InrerfaceMethodref
                constant.classInfoIndex = stream.read(2).readInt16BE();
                constant.nameTypeInfoIndex = stream.read(2).readInt16BE();
                break;
            case 12: //CONSTANT_NameAndType
                constant.classInfoIndex = stream.read(2).readInt16BE();
                constant.nameTypeInfoIndex = stream.read(2).readInt16BE();
                break;
            default:
                console.error("unKnown tag:" + tag)
                ;

        }

      return constant;
    }
}