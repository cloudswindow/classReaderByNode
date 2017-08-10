/**
 * 访问标志解析
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
// 常量
const ACC_PUBLIC = 1;
const ACC_PRIVATE = 2;
const ACC_PROTECTED = 4;
const ACC_STATIC = 8;
const ACC_FINAL = 16;
const ACC_SUPER = 32;
const ACC_SYNCHRONIZED = 32;
const ACC_VOLATILE = 64;
const ACC_BRIDGE = 64;
const ACC_TRANSIENT = 128;
const ACC_VARARGS = 128;
const ACC_NATIVE = 256;
const ACC_INTERFACE = 512;
const ACC_ABSTRACT = 1024;
const ACC_STRICT = 2048;
const ACC_SYNTHETIC = 4096;
const ACC_ANNOTATION = 8192;
const ACC_ENUM = 16384;
const ACC_MANDATED = 32768;
const classModifiers = [1, 16, 1024];
const classFlags = [1, 16, 32, 512, 1024, 4096, 8192, 16384];
const innerClassModifiers = [1, 2, 4, 8, 16, 1024];
const innerClassFlags = [1, 2, 4, 8, 16, 32, 512, 1024, 4096, 8192, 16384];
const fieldModifiers = [1, 2, 4, 8, 16, 64, 128];
const fieldFlags = [1, 2, 4, 8, 16, 64, 128, 4096, 16384];
const methodModifiers = [1, 2, 4, 8, 16, 32, 256, 1024, 2048];
const methodFlags = [1, 2, 4, 8, 16, 32, 64, 128, 256, 1024, 2048, 4096];



const Type = {
    CLASS : 1,
    FIELD:2,
    METHOD:3,
    INNER_CLASS:4
}

const FlagsMap = {
    [Type.CLASS + ''] : classFlags,
    [Type.FIELD + ''] : fieldFlags,
    [Type.METHOD + ''] : methodFlags,
    [Type.INNER_CLASS + ''] : innerClassFlags
}

/**
 * 获取flag对应的flag名字
 * @param flags 从字节码文件中解析到的flags和（各flag|的结果）
 * @param kind 类型，AccessFlag模块的Type中的一个分类
 * @returns {string}
 */
let getFlagNames = function(flags,kind){
    var flagNames = [];
    let typedFlags = FlagsMap[kind + ''];
    for(let i = 0 ; i < typedFlags[i];i++){
        var flag = typedFlags[i];
        if((flags & flag) === flag){
            flagNames.push(flagToName(flag,kind))
        }
    }
    return flagNames.join(",");
}


/**
 * 将一个flag转换为名字
 * @param flag  flag
 * @param kind 类型，AccessFlag模块的Type中的一个分类
 * @returns {*}
 */
let flagToName = function(flag,kind){
    switch(flag) {
        case 1:
            return "ACC_PUBLIC";
        case 2:
            return "ACC_PRIVATE";
        case 4:
            return "ACC_PROTECTED";
        case 8:
            return "ACC_STATIC";
        case 16:
            return "ACC_FINAL";
        case 32:
            return kind === Type.CLASS ? "ACC_SUPER" : "ACC_SYNCHRONIZED";
        case 64:
            return kind === Type.FIELD ? "ACC_VOLATILE" : "ACC_BRIDGE";
        case 128:
            return kind === Type.FIELD ? "ACC_TRANSIENT" : "ACC_VARARGS";
        case 256:
            return "ACC_NATIVE";
        case 512:
            return "ACC_INTERFACE";
        case 1024:
            return "ACC_ABSTRACT";
        case 2048:
            return "ACC_STRICT";
        case 4096:
            return "ACC_SYNTHETIC";
        case 8192:
            return "ACC_ANNOTATION";
        case 16384:
            return "ACC_ENUM";
        case 32768:
            return "ACC_MANDATED";
        default:
            return null;
    }
}

module.exports = {
    Type : Type,
    getFlagNames:getFlagNames
}