/**
 * 属性解析器
 * @Author Yiqun.Wang
 * @date 2017-08-10
 */
const ConstantPoolUtil = require('../ConstantPoolUtil')
const op = require('./op');
const AccessFlag = require('../AccessFlags');


/**
 * 简单属性拷贝
 * @param src
 * @param dest
 */
const plainMerge = function (src, dest) {
    for (var p in src) {
        dest[p] = src[p];
    }
}

const TypedAttributeReader = {


    readInnerClassInfo:function(stream){
        var info = {};
        info.innerClassInfoIndex = stream.read(2).readInt16BE();
        info.innerClassInfo = ConstantPoolUtil.findContentInPool(info.innerClassInfoIndex);
        info.outerClassInfoIndex = stream.read(2).readInt16BE();
        info.outerClassInfo = ConstantPoolUtil.findContentInPool(info.outerClassInfoIndex);
        info.innerNameIndex = stream.read(2).readInt16BE();
        info.innerName = ConstantPoolUtil.findContentInPool(info.innerNameIndex);
        info.accessFlags = stream.read(2).readInt16BE();
        info.accessFlagNames = AccessFlag.getFlagNames(info.accessFlags,AccessFlag.Type.INNER_CLASS);
        return info;
    },


    readInnerClasses:function(stream){
        var attr =  {};
        attr.numberOfClasses = stream.read(2).readInt16BE();
        attr.classes = []
        for(let i = 0; i <  attr.numberOfClasses; i ++){
            attr.classes.push(TypedAttributeReader.readInnerClassInfo(stream));
        }
        return attr;
    },

    readSourceFile: function (stream) {
        var attr = {};
        attr.sourceFileIndex = stream.read(2).readInt16BE();
        attr.sourceFile = ConstantPoolUtil.findContentInPool(attr.sourceFileIndex);
        return attr;
    },

    readCode: function (stream) {
        var attr = {};
        attr.maxStack = stream.read(2).readInt16BE();
        attr.maxLocals = stream.read(2).readInt16BE();
        attr.codeLength = stream.read(4).readInt32BE();
        attr.codes = [];
        attr.codeNames = [];
        // attr.code = stream.read(attr.codeLength).toString('hex');
        for (let i = 0; i < attr.codeLength; i++) {
            var code = stream.read(1).readUInt8();
            attr.codes.push(code)
            attr.codeNames.push(op.getOpName([code]));
        }
        attr.code = attr.codes.join();
        attr.exceptionTableLength = stream.read(2).readInt16BE();
        attr.exceptions = [];
        for (let i = 0; i < attr.exceptionTableLength; i++) {
            attr.exceptions.push(readException())
        }
        // codeAttribute 还存在attributes。。。
        attr.subAttributeLength = stream.read(2).readInt16BE();
        attr.subAttributes = [];
        for (let i = 0; i < attr.subAttributeLength; i++) {
            attr.subAttributes.push(commonRead(stream))
        }
        return attr;
    },

    readSignature:function(stream){
        var attr = {};
        attr.signatureIndex = stream.read(2).readInt16BE();
        attr.signature = ConstantPoolUtil.findContentInPool(attr.signatureIndex);
        return attr;
    },

    readDeprecated:function(stream){
        return  {}
    },

    readRuntimeVisibleAnnotations:function(stream){
        var attr = {}
        attr.annotationsNum = stream.read(2).readInt16BE();
        attr.annotations = [];
        for (let k = 0; k < attr.annotationsNum; k++) {

            var annotation = {}
            annotation.typeIndex = stream.read(2).readInt16BE();
            annotation.type = ConstantPoolUtil.findContentInPool(annotation.typeIndex);

            annotation.elementValuePairsNum = stream.read(2).readInt16BE();
            annotation.elementValuePairs = [];
            for (let l = 0; l < annotation.elementValuePairsNum; l++) {
                var elementValuePair = {}
                elementValuePair.elementNameIndex = stream.read(2).readInt16BE();
                elementValuePair.elementName = ConstantPoolUtil.findContentInPool(elementValuePair.elementNameIndex);

                // @todo 这里还需要处理，否则存在elementValuePairs时，会导致后续处理不正确
                // element_value的结构
                // element_value {
                //     u1 tag;
                //     union {
                //         u2   const_value_index;
                //         {
                //             u2   type_name_index;
                //             u2   const_name_index;
                //         } enum_const_value;
                //         u2   class_info_index;
                //         annotation annotation_value;
                //         {
                //             u2    num_values;
                //             element_value values[num_values];
                //         } array_value;
                //     } value;
                // }
                annotation.elementValuePairs.push(elementValuePair);
            }

            attr.annotations.push(annotation);

        }
        return attr;
    },
    readLineNumberTable:function(stream){
        var attr = {}
        attr.lineNumberTableLength = stream.read(2).readInt16BE();
        attr.entries = [];
        for (let i = 0; i < attr.lineNumberTableLength; i++) {
            var entry = {};
            entry.startPc = stream.read(2).readInt16BE();
            entry.lineNumber = stream.read(2).readInt16BE();
            attr.entries.push(entry);
        }
        return attr;
    }


}


/**
 * @todo
 * 暂时支持这些子类型
 * @type {[string,string,string,string,string,string,string]}
 */
const typedAttributes = ['SourceFile','LineNumberTable','Code','Signature','RuntimeVisibleAnnotations','Deprecated','InnerClasses']
/**
 * 通用属性解析，在解析之前并不知道具体是什么属性
 * @param stream
 * @returns {*}
 */
const commonRead = function (stream) {

    var attr = {};
    var buff = stream.read(2);
    attr.attributeNameIndex = buff.readInt16BE();
    attr.attributeName = ConstantPoolUtil.findContentInPool(attr.attributeNameIndex);
    attr.attributeLength = stream.read(4).readInt32BE();
    console.log(`attr.attributeName:${attr.attributeName}`)

    if(typedAttributes.indexOf(attr.attributeName) >= 0) {
        var typedAttr = TypedAttributeReader['read' + attr.attributeName](stream);
        plainMerge(attr, typedAttr);
        return typedAttr;
    }else{
        console.log(`未知属性:${attr.attributeName}`)
        if (attr.attributeLength > 0)
            attr.info = stream.read(attr.attributeLength).toString('utf8');
    }


}
module.exports = {
    read: commonRead
}