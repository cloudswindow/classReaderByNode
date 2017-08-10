const fs = require('fs')
const ClassReader = require('./readers/ClassReader');

let classFile = '../testClassFile/Tester.class';
const fsStream = fs.createReadStream(classFile)
let loaded = false;

//  读取文件已hex格式输出
let buffer = fs.readFileSync(classFile)
fs.writeFileSync('../out/hex.txt',buffer.toString('hex'));

fsStream.on('readable', () => {
    if(!loaded){
        var result = ClassReader.read(fsStream);
        console.log(JSON.stringify(result));
        loaded = true;
        fs.writeFileSync('../out/result.json',JSON.stringify(result))
    }
});



