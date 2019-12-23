let date = new Date();
let myYear = date.getFullYear();//取得今天的年
let myMonth = date.getMonth();//取得今年的月，月從 0 開始算

let yearAddInput = document.querySelector('#yearAdd');
let yearAddDatalist = document.querySelector('#yearDatalist');
let yearOption = document.createElement('option');
yearOption.value = myYear + '年';
yearAddDatalist.appendChild(yearOption);

if (myMonth >= 11) {
    let yearOptionTwo = document.createElement('option');
    yearOptionTwo.value = (myYear + 1) + '年';
    yearAddDatalist.appendChild(yearOptionTwo);
}

// 對表單 submit 做監聽
let data = {};
let form = document.querySelector('#periodAddForm');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let formEl = this.elements;
    let year = (formEl.yearAdd.value).split("年");
    // console.log(year);
    let period = formEl.period.value;
    let periodNum
    if (period == '1月-2月') {
        periodNum = 0;
    } else if (period == '3月-4月') {
        periodNum = 1;
    } else if (period == '5月-6月') {
        periodNum = 2;
    } else if (period == '7月-8月') {
        periodNum = 3;
    } else if (period == '9月-10月') {
        periodNum = 4;
    } else if (period == '11月-12月') {
        periodNum = 5;
    }
    let letter = formEl.letter.value;
    let startNum = formEl.startNum.value;
    let endNum = formEl.endNum.value;

    data = {
        "Year": year[0],
        "Period": periodNum,
        "Letter": letter,
        "StartNum": startNum,
        "EndNum": endNum
    }
    // console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'true') {
                    alert('發票字軌建檔成功');
                    window.location = 'periodAdd.html'
                } else {
                    alert('建檔失敗');
                }
            } else {
                alert('伺服器QQ');
            }
        }
    });

    xhr.open("POST", "https://invoice.rocket-coding.com/InvLetters/CreadeInvLet");
    xhr.setRequestHeader("Content-Type", "application/json");



    xhr.send(JSON.stringify(data));

})