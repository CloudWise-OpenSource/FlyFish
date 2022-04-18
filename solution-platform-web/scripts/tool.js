/**
 * Created by chencheng on 17-10-12.
 */
const os = require('os');
/**
 * 获取本机ip地址
 * @return {*}
 */
exports.getLocalIP = () => {
    let interfaces = os.networkInterfaces();
    const interfacesValues = Object.values(interfaces);
    for (let i = 0; i < interfacesValues.length; i++){
        let iface = interfacesValues[i];
        for (let j = 0; j < iface.length; j++) {
            let alias = iface[j];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }

    return null;
};


