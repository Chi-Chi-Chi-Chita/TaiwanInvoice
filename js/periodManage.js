//產生下拉選單
let date = new Date();
let myYear = date.getFullYear();//取得今年的年
let lastYear = myYear - 1
let nextYear = myYear + 1
let myMonth = date.getMonth();//取得今年的月，月從0開始算


// let startYear = document.querySelector('#invoiceStartYear');
let startYearList = document.querySelector('#invoiceStartYearList');
let startYearOption = document.createElement('option');
let startLastYearOption = document.createElement('option');
let stertNextYearOption = document.createElement('option');
// let endYear = document.querySelector('#invoiceEndYear');
let endYearList = document.querySelector('#invoiceEndYearList');
let endYearOption = document.createElement('option');
let endLastYearOption = document.createElement('option');
let endNextYearOption = document.createElement('option')

startLastYearOption.value = lastYear + '年';
startYearList.appendChild(startLastYearOption);
startYearOption.value = myYear + '年';
startYearList.appendChild(startYearOption);

endLastYearOption.value = lastYear + '年';
endYearList.appendChild(endLastYearOption);
endYearOption.value = myYear + '年';
endYearList.appendChild(endYearOption);


if (myMonth >= 11) {
    stertNextYearOption.value = nextYear + '年';
    startYearList.appendChild(stertNextYearOption);
    endNextYearOption.value = nextYear + '年';
    endYearList.appendChild(endNextYearOption);
}


//對 form 做監聽
let data = {};

//對表單的 submit 做監聽
let form = document.querySelector('#periodManageForm');

form.addEventListener('submit', function (e) {
    // console.log('yeaaa')
    e.preventDefault();
    let formEl = this.elements;
    let startYear = (formEl.invoiceStartYear.value).split('年');
    let endYear = (formEl.invoiceEndYear.value).split('年');
    let startPeriod = formEl.invoiceStartPeriod.value;
    let endPeriod = formEl.invoiceEndPeriod.value;
    let startPeriodNum;
    let endPeriodNum;
    if (startPeriod == '1月-2月') {
        startPeriodNum = 0;
    } else if (startPeriod == '3月-4月') {
        startPeriodNum = 1;
    } else if (startPeriod == '5月-6月') {
        startPeriodNum = 2;
    } else if (startPeriod == '7月-8月') {
        startPeriodNum = 3;
    } else if (startPeriod == '9月-10月') {
        startPeriodNum = 4;
    } else if (startPeriod == '11月-12月') {
        startPeriodNum = 5;
    }

    if (endPeriod == '1月-2月') {
        endPeriodNum = 0;
    } else if (endPeriod == '3月-4月') {
        endPeriodNum = 1;
    } else if (endPeriod == '5月-6月') {
        endPeriodNum = 2;
    } else if (endPeriod == '7月-8月') {
        endPeriodNum = 3;
    } else if (endPeriod == '9月-10月') {
        endPeriodNum = 4;
    } else if (endPeriod == '11月-12月') {
        endPeriodNum = 5;
    }

    data = {
        "StartYear": startYear[0],
        "StartPeriod": startPeriodNum,
        "EndYear": endYear[0],
        "EndPeriod": endPeriodNum,
        "Page": 1
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", "http://invoice.rocket-coding.com/InvLetters/SearchInvLet");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));


    xhr.onload = function () {
        if (xhr.status !== 200) { return; }
        let searchResult = JSON.parse(xhr.responseText);

        showResult(searchResult);
    }

});

function showResult(searchResult) {
    console.log(searchResult);
    let table = document.querySelector('#periodResultTable');

    let tableContent =
        `<thead>
            <tr>
                <th scope="col" class="text-center">年份</th>
                <th scope="col" class="text-center">期別</th>
                <th scope="col" class="text-center">起迄號碼</th>
                <th width="15%" class="text-center">空白發票明細</th>
            </tr>
        </thead>`

    if (searchResult.length > 0) {
        tableContent += "<tbody>"
        for (var i = 0; i < searchResult.length; i++) {
            let dateAll = searchResult[i].Year;
            let date = dateAll + '年';

            let periodAll = searchResult[i].Period;
            let period;
            if (periodAll == 0) {
                period = "1月-2月";
            } else if (periodAll == 1) {
                period = "3月-4月";
            } else if (periodAll == 2) {
                period = "5月-6月";
            } else if (periodAll == 3) {
                period = "7月-8月";
            } else if (periodAll == 4) {
                period = "9月-10月";
            } else if (periodAll == 5) {
                period = "11月-12月";
            }

            tableContent +=
                `<tr>
                    <td  class="text-center">${date}</td>
                    <td  class="text-center">${period}</td>
                    <td  class="text-center">${searchResult[i].Letter}${searchResult[i].StartNum} ~ ${searchResult[i].Letter}${searchResult[i].EndNum}</td>
                    <td  class="text-center"><button type="submit" class="btn-small btn-info" onclick="location.href='invoiceList.html?id=${searchResult[i].Id}'">查詢</button></td>
                </tr>`
        }
        tableContent += "</tbody>"

    } else {
        tableContent +=
            `<tbody><tr><td colspan="4" style="color:red" class="text-center">查無資料</td></tr></tbody>`
    }
    table.innerHTML = tableContent;
}