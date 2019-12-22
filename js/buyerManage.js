let data = {}
// 對表單的 submit 做監聽
let form = document.querySelector('#buyerManageForm');

form.addEventListener('submit', function (e) {
    // console.log('yaaa');
    e.preventDefault();
    let formEl = this.elements;
    let keypoint = formEl.keypoint.value;

    data = {
        "term": keypoint,
        "Page": 1
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", "http://invoice.rocket-coding.com/InvClientInfoes/SearchCliInfo");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));

    xhr.onload = function () {
        if (xhr.status !== 200) { return; }
        let searchResult = JSON.parse(xhr.responseText);
        // console.log(searchResult);

        showResult(searchResult);
    }

});

function showResult(searchContent) {
    let table = document.querySelector('#buyerManageTable');
    let tableContent =
        `<thead>
            <tr>
                <th width="30%" class="text-center">統一編號</th>
                <th scope="col" class="text-center">公司名稱</th>
            </tr>
        </thead>`
    if (searchContent.length > 0) {
        tableContent += "<tbody>"
        for (var i = 0; i < searchContent.length; i++) {
            tableContent +=
                `<tbody id="invoiceform">
                    <tr>
                        <td>${searchContent[i].UniformNumbers}</td>
                        <td>${searchContent[i].CompName}</td>
                    </tr>
                </tbody >`
        }
        tableContent += "</tbody>"
    } else {
        tableContent +=
            `<tbody><tr><td colspan="2" style="color:red;"  class="text-center">查無資料</td></tr></tbody>`
    }
    table.innerHTML = tableContent;
}