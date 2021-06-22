import XLSX from 'xlsx'


function readWorkbook(workbook) {
    let result = [];
    workbook.SheetNames.forEach(sheetName => {
        let worksheet = workbook.Sheets[sheetName];
        let json = XLSX.utils.sheet_to_json(worksheet);
        result.push(json)
    })
    return result
}

export function loadRemoteFile(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                try {
                    var data = new Uint8Array(xhr.response);
                    var workbook = XLSX.read(data, { type: 'array' });
                    resolve(readWorkbook(workbook));
                }
                catch (err) {
                    console.log(err);

                }

            } else {
                reject(new Error(e.statusText))
            }
        };
        xhr.send();
    })
}