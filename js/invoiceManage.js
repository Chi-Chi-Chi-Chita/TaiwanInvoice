let data = {};
let searchResult;
//對表單的 submit 做監聽
let form = document.querySelector('#invoiceManageForm');

form.addEventListener('submit', function (e) {
    // console.log('yeaaa')
    e.preventDefault();
    let formEl = this.elements;
    let invoiceStartTime = formEl.invoiceStartTime.value;
    let invoiceEndTime = formEl.invoiceEndTime.value;
    let invoiceKeyPoint = formEl.invoiceKeyPoint.value

    data = {
        "Term": invoiceKeyPoint,
        "StarTime": invoiceStartTime,
        "Endtime": invoiceEndTime,
        "Page": 1,
    }
    console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", "http://invoice.rocket-coding.com/InvTables/SearchInvInfo");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));

    xhr.onload = function () {
        if (xhr.status !== 200) { return; }
        searchResult = JSON.parse(xhr.responseText);
        // console.log(searchResult);

        showResult(searchResult);
    }
});

function showResult() {
    // console.log(searchResult.length);
    // console.log(searchResult[0].InvDate);



    let table = document.querySelector('#resultTable')
    let tableContent =
        `    <thead>
        <tr>
            <th scope="col" class="text-center">開立日期</th>
            <th scope="col" class="text-center">發票號碼</th>
            <th scope="col" class="text-center">買受人</th>
            <th width="col" scope="col" class="text-center">金額</th>
        </tr>
    </thead>`


    if (searchResult.length > 0) {
        tableContent += "<tbody>"
        for (var i = 0; i < searchResult.length; i++) {
            var dateAll = searchResult[i].InvDate;
            var dateSplit = dateAll.split("T");
            console.log(dateSplit);

            tableContent +=
                `<tr>
            <td class="text-center">${dateSplit[0]}</td>
            <td class="text-center">${searchResult[i].InvNum}</td>
            <td class="text-center">${searchResult[i].Client}</td>
            <td class="text-right">${searchResult[i].Money}</td>
        </tr>`
        }
        tableContent += "</tbody>"

    } else {
        tableContent +=
            `<tbody><tr><td colspan="4" style="color:red;"  class="text-center">查無資料</td></tr></tbody>`
    }
    table.innerHTML = tableContent;

}



