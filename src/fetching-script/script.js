const https = require('https');
const http = require('http')
const { apiEndPoint, storageServiceEndPoint, fetchFileEvery } = require('./constants')
const { Util } = require('./utils')

/** Connect to remote service and retrieve JSON */
const fetchJSON = () => {
    return new Promise((resolve, reject) => {
        https.get(apiEndPoint, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    if (data) resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

/** Parse JSON and fetch contents of each URL */
const processJSON = async (json) => {
    for (const item of json) {
        try {
            let flattenItem = Util.flattenObject(item)
            let key = Object.keys(flattenItem)[0]
            let url = flattenItem[key]
            https.get(url, (res) => {
                let binary = '';
                res.on('data', (chunk) => {
                    binary += chunk;
                });
                res.on('end', () => {
                    saveFile(url, binary);
                });
            }).on('error', (err) => {
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
};

/**  Save file to custom web service  */
const saveFile = async (url, binary) => {
    /** Extract file name from URL */
    const fileName = url.split('/').pop();
    let isFileAlreadyExist = await doesFileExist(fileName)
    if (isFileAlreadyExist) {
        console.warn(`File ${fileName} already exists. Aborting saving`);
        return
    }

    let postedFile = { url: url, name: fileName, content: binary }
    let option = {
        path: '/file',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        const req = http.request(storageServiceEndPoint, option, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                return reject(new Error(`HTTP status code ${res.statusCode}`))
            }

            const body = []
            res.on('data', (chunk) => body.push(chunk))
            res.on('end', () => {
                console.log(`File ${fileName} stored Successfully`)
                const resString = Buffer.concat(body).toString()
                resolve(resString)
            })
        })

        req.on('error', (err) => {
            reject(err)
        })

        req.on('timeout', () => {
            req.destroy()
            reject(new Error('Request time out'))
        })

        req.write(JSON.stringify(postedFile))
        req.end()
    }
    )
};

/** returns true if the passed name is already stored */
doesFileExist = (fileName) => {
    return new Promise((resolve, reject) => {
        http.get(`${storageServiceEndPoint}/file/findByName/${fileName}`, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    if (data) {
                        let fileData = JSON.parse(data).data
                        resolve(fileData ? true : false);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    })
}

/** Retrieve JSON and process it every 5 minutes */
setInterval(async () => {
    const json = await fetchJSON();
    processJSON(json);
}, fetchFileEvery);
