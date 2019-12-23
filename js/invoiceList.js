//抓 QueryString 資料
let qs = location.search;
// console.log(qs);
let urlParmas = new URLSearchParams(location.search);
if (urlParmas.has('id')) {
    let id = urlParmas.get('id');
    // console.log(id);
    var data = { "ID": id };

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onload = function () {
        if (xhr.status !== 200) { return; }
        let searchResult = JSON.parse(xhr.responseText);

        showResult(searchResult);

    }

    xhr.open("POST", "https://invoice.rocket-coding.com/InvTables/Pdf");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
}

function showResult(idContent) {
    let table = document.querySelector('#invoiceListTable');
    let tableContent =
        `<thead>
            <tr>
                <th scope="col" class="text-center">總機構</th>
                <th scope="col" class="text-center">發票類別</th>
                <th scope="col" class="text-center">發票字軌</th>
                <th scope="col" class="text-center">起始編號</th>
                <th scope="col" class="text-center">終止編號</th>
            </tr>
        </thead>`

    if (idContent.length > 0) {
        tableContent += "<tbody>"
        for (var i = 0; i < idContent.length; i++) {
            tableContent +=
                `<tr>
                    <td class="text-center">${idContent[i].UniformNumbers}</td >
                    <td class="text-center">一般稅額</td>
                    <td class="text-center">${idContent[i].Letter}</td>
                    <td class="text-center">${idContent[i].Low}</td>
                    <td class="text-center">${idContent[i].High}</td>
                </tr > `
        }
        tableContent += "</tbody>"
    } else {
        tableContent +=
            `<tbody><tr><td colspan="5" style="color:red" class="text-center">查無資料</td></tr></tbody>`
    }
    table.innerHTML = tableContent;
}

