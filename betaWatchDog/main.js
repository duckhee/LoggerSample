/**
 //TODO
 * 현재 폴더의 경로가 숫자일 경우 열번 실행 및 실행 에러 발생 
 * 파일 수나 용량이 커질 시에 메모리 부족으로 종료되는 현상 처리 방법 강구
 * 
 * 
 */
const Init = require('./_Init/init');


Init();

/** Program Exit Do Event */
process.on('beforeExit', () => {
    console.log("Error : " + process.stderr);
    console.log("Running time : ", process.uptime());
});

process.on("exit", () => {
    console.log("Program Down : ", process.memoryUsage());
});

process.on("SIGINT", () => {
    //console.log("Error : ");
    console.log("Program Down : ", process.memoryUsage());
    process.exit();
});