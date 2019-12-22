//賣方 input 的 DOM
let sellTaxNumber = document.querySelector('#sellTaxNumber');
let sellName = document.querySelector('#sellName');
let sellAdd = document.querySelector('#sellAdd');
let sellTel = document.querySelector('#sellTel');

//抓賣方 API 及 自動帶入賣方
var sellData;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.open("POST", "http://invoice.rocket-coding.com/InvAccounts/LoadCliInfo", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();

xhr.onload = function () {
    if (xhr.status !== 200) { return; }
    sellData = JSON.parse(this.responseText);

    showSellInfo();
}

function showSellInfo() {
    sellTaxNumber.value = sellData[0].UniformNumbers;
    sellName.value = sellData[0].CompName;
    sellAdd.value = sellData[0].CompAddress;
    sellTel.value = sellData[0].CompPhoneNumber;
}

// 顧客公司名稱的自動完成 及 顧客 input 的 DOM
let buyName = document.querySelector('#buyName');
let dataList = document.querySelector('#json-datalist')

let buyTaxNumber = document.querySelector('#buyTaxNumber');
let buyAdd = document.querySelector('#buyAdd');
let buyTel = document.querySelector('#buyTel');

let ClientId;


buyName.addEventListener('input', function (e) {
    if (this.value == '') {
        dataList.innerHTML = '';
        return;
    }

    let dataListOption = document.querySelectorAll('#json-datalist option')
    // console.log(dataList);
    if (dataListOption.length !== 0) {
        dataListOption.forEach(function (item) {
            if (item.value == buyName.value) {
                // console.log(item);
                let itemObj = JSON.parse(item.dataset.rawdata);
                // console.log(itemObj);
                buyTaxNumber.value = itemObj.UniformNumbers;
                buyAdd.value = itemObj.CompAddress;
                buyTel.value = itemObj.CompPhoneNumber;
                ClientId = itemObj.Id;
                console.log('顧客ID是' + ClientId);
                return;
            }
        })
    }

    let buyerSearchData = { 'term': this.value }

    var xhrBuyerData = new XMLHttpRequest(); // 透過 HTTP 跟對方打招呼
    xhrBuyerData.withCredentials = true;

    xhrBuyerData.open("POST", "http://invoice.rocket-coding.com/InvClientInfoes/AutoCliCn");
    xhrBuyerData.setRequestHeader("Content-Type", "application/json");
    xhrBuyerData.send(JSON.stringify(buyerSearchData));

    xhrBuyerData.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (this.status == 200) {
                // console.log(this.responseText);
                if (this.responseText !== '[]') {
                    var jsonOptions = JSON.parse(this.responseText);
                    dataList.innerHTML = '';
                    // console.log(dataList);
                    // console.log(jsonOptions)
                    jsonOptions.forEach(function (item) {
                        // Create a new <option> element.
                        var option = document.createElement('option');
                        // console.log(option);
                        // Set the value using the item in the JSON array.
                        option.value = item.CompName;
                        option.dataset.rawdata = JSON.stringify(item);
                        // Add the <option> element to the <datalist>.
                        dataList.appendChild(option);
                    })
                }
            }
        }
    })

})

//發票的 DOM
let invoicePeriod = document.querySelector('#invoicePeriod')
let invoicePeriodList = document.querySelector('#invoicePeriodList')
let invoiceNumber = document.querySelector('#invoiceNumber');
let invoiceNumberList = document.querySelector('#invoiceNumberList')
let invoiceDate = document.querySelector('#invoiceDate');
let str = ''
// let invoiceTime = document.querySelector('.invoiceTime'); 把 Time 拿掉

//抓發票字軌 API
let invoicePeriodData;

let invoicePeriodxhr = new XMLHttpRequest();
invoicePeriodxhr.withCredentials = true;

invoicePeriodxhr.open("POST", "http://invoice.rocket-coding.com/InvLetters/SelectInvLet", true);
invoicePeriodxhr.setRequestHeader("Content-Type", "application/json");
invoicePeriodxhr.send(null);

invoicePeriodxhr.onload = function () {
    if (invoicePeriodxhr.status !== 200) { return; }
    invoicePeriodData = JSON.parse(invoicePeriodxhr.responseText);
    // console.log(invoicePeriodData);


    for (var i = 0; i < invoicePeriodData.length; i++) {
        // console.log(invoicePeriodData[i]);
        str += `<option value="${invoicePeriodData[i].Letter}"></option>`
    }
    invoicePeriodList.innerHTML = str;
}

//判斷發票字軌的內容再去抓發票號碼
let invoicePeriodSelected = {};

invoicePeriod.addEventListener('change', function (e) {
    // console.log(this.value);

    invoiceNumberList.innerHTML = '';
    invoiceNumber.value = '';
    e.preventDefault();

    if (this.value == '') {
        invoicePeriod.innerHTML = '';
        return;
    }

    invoicePeriodSelected = {
        "Letter": invoicePeriod.value
    }

    var invoiceNumxhr = new XMLHttpRequest();
    invoiceNumxhr.withCredentials = true;

    invoiceNumxhr.addEventListener("readystatechange", function () {
        // console.log(this.readyState);
        if (this.readyState === 4) {
            // console.log(this.responseText);
            if (this.status == 200) {
                let invoiceNum = JSON.parse(this.responseText);
                // console.log(invoiceNum[1]);
                invoiceNum.forEach(function (item) {
                    var invoiceNumOption = document.createElement('option');
                    invoiceNumOption.value = item;
                    invoiceNumberList.appendChild(invoiceNumOption);
                })
            }
        }
    });

    invoiceNumxhr.open("POST", "http://invoice.rocket-coding.com/InvTables/SelectInvNm");
    invoiceNumxhr.setRequestHeader("Content-Type", "application/json");
    invoiceNumxhr.send(JSON.stringify(invoicePeriodSelected));
})

//塞 max 跟 min 在發票日期
invoiceNumber.addEventListener('change', function (e) {
    let invoiceData = {};
    invoiceData = {
        "Letter": invoicePeriod.value,
        "Num": invoiceNumber.value
    }
    // console.log(invoiceData);

    var invoiceDatexhr = new XMLHttpRequest();
    invoiceDatexhr.withCredentials = true;

    invoiceDatexhr.onload = function () {
        if (invoiceDatexhr.status !== 200) { return; }
        let searchResult = JSON.parse(invoiceDatexhr.responseText);
        console.log(searchResult);
        searchResultMin = searchResult[0].split('T');
        searchResultMax = searchResult[1].split('T');
        invoiceDate.min = searchResultMin[0];
        invoiceDate.max = searchResultMax[0];
    }

    invoiceDatexhr.open("POST", "http://invoice.rocket-coding.com/InvTables/SelectInvDt");
    invoiceDatexhr.setRequestHeader("Content-Type", "application/json");

    invoiceDatexhr.send(JSON.stringify(invoiceData));

})


/*大家的輸入*/
let itemName = document.querySelector('.itemName');
let taxExcluded = document.querySelector('#taxExcluded');
let taxPrice = document.querySelector('#taxPrice');
let taxIncluded = document.querySelector('#taxIncluded');

let submitAry = [];
/*發票的新增及刪除功能*/
let btn = document.querySelector('.btnAdd');
btn.addEventListener('click', addTbody);

function addTbody() {
    let tr = document.createElement("tr");
    tr.id = "tr_" + new Date().getTime();
    tr.innerHTML = `
    <td><input type="text" class="form-control itemName" placeholder="品名" aria-label="Username" aria-describedby="basic-addon1"></td>
    <td><input type="text" class="form-control amount" placeholder="數量" aria-label="Username" aria-describedby="basic-addon1"></td>
    <td><input type="text" class="form-control unitPrice" aria-label="Username" aria-describedby="basic-addon1"></td>
    <td class="subtotal"></td>
    <td><button type="button" class="btn btn-danger" id="btnCal">刪除</button></td>`
    document.getElementById('invoiceform').appendChild(tr);
    let delBtnAll = document.querySelectorAll('#btnCal');
    delBtnAll.forEach(function (item, i, arry) {
        // console.log(item); //現在元素
        // console.log(i); //現在元素的位置
        // console.log(arry); //完整的陣列
        item.addEventListener('click', del);
    })

    bindCount(tr.id);
}

function del(e) {
    e.target.parentNode.parentNode.remove(); //Btn 往上一層是 td，再往上一層才是 tr
    // console.log(e.target.parentNode.parentNode);
    // let trDel = document.getElementById(`${trId}`);
    // console.log(trDel);

    // document.getElementById('invoiceform').removeChild(trDel)
}

/*發票金額的計算*/
bindCount('firstTr');

function bindCount(idName) {
    let trAmount = document.querySelector(`#${idName} input.amount`);
    trAmount.addEventListener('keyup', count.bind(this, idName));

    let trPrice = document.querySelector(`#${idName} input.unitPrice`)
    trPrice.addEventListener('keyup', count.bind(this, idName));
}

function count(id) {
    let amount = parseInt(document.querySelector(`#${id} input.amount`).value);
    let unitPrice = parseInt(document.querySelector(`#${id} input.unitPrice`).value);

    let subCount = amount * unitPrice;
    // console.log(subCount);
    let subtotal = document.querySelector(`#${id} td.subtotal`);
    let subtotalAry = document.querySelectorAll('td.subtotal');


    if (isNaN(subCount)) { subCount = ''; }
    subtotal.innerHTML = subCount;

    let total = 0;
    for (let i = 0; i < subtotalAry.length; i++) {
        let temp = parseInt(subtotalAry[i].innerHTML);
        if (!isNaN(temp)) {
            total += temp;
            // console.log(temp);
        };
    }
    taxPrice.innerHTML = (total * 0.05).toFixed(0);

    taxExcluded.innerHTML = total;

    taxIncluded.innerHTML = (total * 1.05).toFixed(0);
}

/*內容組成字串*/
function invoiceContent() {
    /*處理日期用字串切割*/
    var dateSplit = invoiceDate.value;
    var dateAry = new Array();
    dateAry = dateSplit.split("-");

    /*組字串*/
    var contentString =
        `H,${sellTaxNumber.value},${sellName.value},${sellAdd.value},${sellTel.value}
M,${invoicePeriod.value}${invoiceNumber.value},${dateAry[0]}/${dateAry[1]}/${dateAry[2]} 10:00:00,07,${buyTaxNumber.value},${buyName.value},${buyAdd.value},1,5,${taxExcluded.textContent},${taxPrice.textContent},${taxIncluded.textContent},1
`
    // console.log(contentString);

    let invoiceformAry = document.querySelectorAll('#invoiceform tr');
    for (i = 0; i < invoiceformAry.length; i++) {
        // console.log(invoiceformAry[i].id);
        let thisId = invoiceformAry[i].id;
        let thisitemName = document.querySelector(`#${thisId} input.itemName`).value;
        let thisAmount = document.querySelector(`#${thisId} input.amount`).value;
        let thisUnitPrice = document.querySelector(`#${thisId} input.unitPrice`).value;
        let thisSubtotal = document.querySelector(`#${thisId} td.subtotal`).textContent;

        console.log(thisitemName);
        console.log(thisAmount);
        console.log(thisUnitPrice);
        console.log(thisSubtotal);
        console.log(invoiceformAry[i]);

        contentString += `D,${thisitemName},${thisAmount},${thisUnitPrice},${thisSubtotal},\n`
        console.log(contentString);

        submitAry.push({ "Item": thisitemName, "Count": thisAmount, "Price": thisSubtotal })
        console.log(submitAry);
    }


    return contentString;
};

/*CSV Btn 功能*/
let outputBtn = document.querySelector('.output');
outputBtn.addEventListener('click', createCsvFile);
function createCsvFile() {
    let formAry = document.querySelectorAll('form');
    console.log(formAry);
    let passForm = true;
    formAry.forEach(function (item) {
        if (!item.checkValidity()) {
            alert("全部欄位都必需輸入完成");
            passForm = false;
        }
    });
    if (!passForm) { return; }
    // console.log(passForm);
    // return;
    var fileName = `${invoicePeriod.value}${invoiceNumber.value}.csv`;//匯出的檔名
    var data = invoiceContent();
    submitXHR();
    var blob = new Blob([data], {
        type: "application/octet-stream"
    });
    var href = URL.createObjectURL(blob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();
}
/*把資料傳回後端*/
function submitXHR() {
    var submitData = {}

    submitData = {
        "ClientId": ClientId,
        "Letter": invoicePeriod.value,
        "Num": invoiceNumber.value,
        "InvDate": invoiceDate.value + " 10:00:00.977",
        "Total": taxIncluded.textContent,
        "Service": submitAry,
    }

    console.log(JSON.stringify(submitData));

    var submitXhr = new XMLHttpRequest();
    submitXhr.withCredentials = true;

    submitXhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'true') {
                    alert('發票開立資料己存檔 及 CSV檔案匯出成功')
                    window.location = 'invoiceAdd.html'
                } else {
                    alert('建檔失敗');
                }
            } else {
                alert('伺服器QQ')
            }
        }
    });

    submitXhr.open("POST", "http://invoice.rocket-coding.com/InvTables/FinishInv");
    submitXhr.setRequestHeader("Content-Type", "application/json");

    submitXhr.send(JSON.stringify(submitData));

}
