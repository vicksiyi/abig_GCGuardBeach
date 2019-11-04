/**
 * 生成随机数
 * @param {*} minNum 最小值
 * @param {*} maxNum 最大值
 */
const randomNumOneToOne = (minNum, maxNum) => {
    let Range = maxNum - minNum;
    let Rand = Math.random();
    return (minNum + Math.round(Rand * Range));
}

module.exports = {
    randomNumOneToOne: randomNumOneToOne
}