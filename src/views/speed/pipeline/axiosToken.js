let getData1O = {};
// 已处理的设备
let eqDone = [];
// 处理中的设备
let eqDoing = [];
// 未处理的设备
let eqNodo = [];
let dealed = [
    { data: '09/03', name: '水质仪', eqState: '离线', urgent: '中', man: '王五', state: '完成' },
    { data: '09/03', name: '水质仪', eqState: '离线', urgent: '中', man: '王五', state: '完成' },
    { data: '09/03', name: '水质仪', eqState: '离线', urgent: '中', man: '王五', state: '完成' },
    { data: '09/03', name: '水质仪', eqState: '离线', urgent: '中', man: '王五', state: '完成' },
    { data: '09/03', name: '水质仪', eqState: '离线', urgent: '中', man: '王五', state: '完成' },
    { data: '09/03', name: '水质仪', eqState: '离线', urgent: '中', man: '王五', state: '完成' },];
let dealIng = [
    { data: '01/13', name: '流量计', eqState: '在线', urgent: '高', man: '王五', state: '处理中' },
    { data: '01/13', name: '流量计', eqState: '在线', urgent: '高', man: '王五', state: '处理中' },
    { data: '01/13', name: '流量计', eqState: '在线', urgent: '高', man: '王五', state: '处理中' },
    { data: '01/13', name: '流量计', eqState: '在线', urgent: '高', man: '王五', state: '处理中' },
    { data: '01/13', name: '流量计', eqState: '在线', urgent: '高', man: '王五', state: '处理中' },];
let noDeal = [
    { data: '10/20', name: '液位计', eqState: '在线', urgent: '低', man: '张山', state: '未处理' },
    { data: '10/20', name: '液位计', eqState: '在线', urgent: '低', man: '张山', state: '未处理' },
    { data: '10/20', name: '液位计', eqState: '在线', urgent: '低', man: '张山', state: '未处理' },
    { data: '10/20', name: '液位计', eqState: '在线', urgent: '低', man: '张山', state: '未处理' },
    { data: '10/20', name: '液位计', eqState: '在线', urgent: '低', man: '张山', state: '未处理' },
    { data: '10/20', name: '液位计', eqState: '在线', urgent: '低', man: '张山', state: '未处理' },
    { data: '10/20', name: '液位计', eqState: '在线', urgent: '低', man: '张山', state: '未处理' },];
function getData1(newData) {
    eqDone = [];
    eqNodo = [];
    for (let i = 0; i < newData.length; i++) {
        // 日期
        getData1O.data = newData[i].time.substring(5, 7) + "/" + newData[i].time.substring(8, 10);
        // 设备名称
        getData1O.name = newData[i].deviceName;
        // 设备状态
        if (newData[i].deviceStatus == 4) {
            getData1O.eqState = '在线';
        } else {
            getData1O.eqState = '离线';
        }
        // 紧急度
        if (newData[i].alarmLevel >= 3) {
            getData1O.urgent = '高';
        } else if (newData[i].alarmLevel == 2) {
            getData1O.urgent = '中';
        } else if (newData[i].alarmLevel == 1) {
            getData1O.urgent = '低';
        }
        // 处理人
        getData1O.man = '张三';
        // 状态
        if (newData[i].handleStatus == 1) {
            getData1O.state = '未处理';
            eqNodo.push(getData1O);
        } else if (newData[i].handleStatus == 2) {
            getData1O.state = '完成';
            eqDone.push(getData1O);
        }
        getData1O = {};
    }
    if (eqDone.length == 0) {
        eqDone = dealed;
    }
    if (eqNodo.length == 0) {
        eqNodo = noDeal;
    }
    if (eqDoing.length == 0) {
        eqDoing = dealIng;
    }
    return { eqDone, eqDoing, eqNodo }
}
export default getData1;