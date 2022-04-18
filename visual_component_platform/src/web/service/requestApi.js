const Client = require('node-client-sdk');

module.exports = class extends think.Service{
    constructor(){
        super();

        this.client = new Client({
            isEncrypt: false,
            domain: think.config('thirdApiDomain', undefined, 'web')
        });
    }
}


