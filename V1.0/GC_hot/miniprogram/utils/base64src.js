const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

function base64src(base64data, cb) {
    // const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    // if (!format) {
    //     return (new Error('ERROR_BASE64SRC_PARSE'));
    // }
    const filePath = `cloud://kkworkspace-4sdw7.6b6b-kkworkspace-4sdw7-1300292448/mode/${new Date().getTime()}.png`;
    console.log(filePath)
    const buffer = wx.base64ToArrayBuffer(base64data);
    fsm.writeFile({
        filePath,
        data: buffer,
        encoding: 'binary',
        success() {
            cb(filePath);
        },
        fail() {
            return (new Error('ERROR_BASE64SRC_WRITE'));
        },
    });
};

module.exports = base64src