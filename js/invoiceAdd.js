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

// 顧客公司名稱的自動完成
let buyName = document.querySelector('#buyName');
let dataList = document.querySelector('#json-datalist')

let buyTaxNumber = document.querySelector('#buyTaxNumber');
let buyAdd = document.querySelector('#buyAdd');
let buyTel = document.querySelector('#buyTel');


buyName.addEventListener('input', function (e) {
    if (this.value == '') {
        dataList.innerHTML = '';
        return;
    }

    let dataListOption = document.querySelectorAll('#json-datalist option')
    console.log(dataList);
    if (dataListOption.length !== 0) {
        dataListOption.forEach(function (item) {
            if (item.value == buyName.value) {
                console.log(item);
                let itemObj = JSON.parse(item.dataset.rawdata);
                console.log(itemObj);
                buyTaxNumber.value = itemObj.UniformNumbers;
                buyAdd.value = itemObj.CompAddress;
                buyTel.value = itemObj.CompPhoneNumber;
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



/*大家的輸入*/
let invoicePeriod = document.querySelector('#invoicePeriod')
let invoiceNumber = document.querySelector('#invoiceNumber');
let invoiceDate = document.querySelector('.invoiceDate');
let invoiceTime = document.querySelector('.invoiceTime');
let taxExcluded = document.querySelector('#taxExcluded');
let taxPrice = document.querySelector('#taxPrice');
let taxIncluded = document.querySelector('#taxIncluded');
let itemName = document.querySelector('.itemName');

/*發票的新增及刪除功能*/
let btn = document.querySelector('.btnAdd');
btn.addEventListener('click', addTbody);

function addTbody() {
    let tr = document.createElement("tr");
    tr.id = "tr_" + new Date().getTime();
    tr.innerHTML = `
    <td><input type="text" class="form-control itemName" placeholder="品名" aria-label="Username"
            aria-describedby="basic-addon1"></td>
    <td><input type="text" class="form-control amount" aria-label="Username"
            aria-describedby="basic-addon1"></td>
    <td><input type="text" class="form-control unitPrice"
            aria-label="Username" aria-describedby="basic-addon1"></td>
    <td class="subtotal"></td>
    <td><button type="button" class="btn btn-danger btnCal">刪除</button></td>`
    document.getElementById('invoiceform').appendChild(tr);
    let delBtnAll = document.querySelectorAll('.btnCal');
    delBtnAll.forEach(function (item, i, arry) {
        // console.log(item); //現在元素
        // console.log(i); //現在元素的位置
        // console.log(arry); //完整的陣列
        item.addEventListener('click', del);
    })

    bindCount(tr.id);
}

function del(e) {
    let trId = e.target.parentNode.parentNode.id;
    let trDel = document.getElementById(`${trId}`);
    console.log(trDel);

    document.getElementById('invoiceform').removeChild(trDel)
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
    console.log(subCount);
    let subtotal = document.querySelector(`#${id} td.subtotal`);
    let subtotalAry = document.querySelectorAll('td.subtotal');


    if (isNaN(subCount)) { subCount = ''; }
    subtotal.innerHTML = subCount;

    let total = 0;
    for (let i = 0; i < subtotalAry.length; i++) {
        let temp = parseInt(subtotalAry[i].innerHTML);
        if (!isNaN(temp)) {
            total += temp;
            console.log(temp);
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
M,${invoiceNumber.value},${dateAry[0]}/${dateAry[1]}/${dateAry[2]} ${invoiceTime.value}:00,07,${buyTaxNumber.value},${buyName.value},${buyAdd.value},1,5,${taxExcluded.textContent},${taxPrice.textContent},${taxIncluded.textContent},1
`
    console.log(contentString);

    let invoiceformAry = document.querySelectorAll('#invoiceform tr');
    for (i = 0; i < invoiceformAry.length; i++) {
        console.log(invoiceformAry[i].id);
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
    }


    return contentString;
};

/*CSV Btn 功能*/
let outputBtn = document.querySelector('.output');
outputBtn.addEventListener('click', createCsvFile);
function createCsvFile() {
    var fileName = `${invoiceNumber.value}.csv`;//匯出的檔名
    var data = invoiceContent();
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
