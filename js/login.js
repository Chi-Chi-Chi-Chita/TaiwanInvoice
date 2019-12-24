var data = {};

//對 form 的 submit 監聽
let form = document.querySelector('#login')

form.addEventListener('submit', function (e) {
    e.preventDefault();
    var formEl = this.elements;
    var memberAccount = formEl.memberAccount.value;
    var memberPwd = formEl.memberPwd.value;

    data = {
        "Password": memberPwd,
        "UniformNumbers": memberAccount,
    }
    // console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'true') {
                    window.location = 'invoiceAdd.html'
                } else {
                    alert('認証失敗')
                }
            } else {
                alert('伺服器QQ')
            }
        }
    });

    xhr.open("POST", "https://invoice.rocket-coding.com/InvAccounts/Login");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));

    // 機器人開始
    robotData = robotValue;

    var robotxhr = new XMLHttpRequest();
    robotxhr.withCredentials = true;

    robotxhr.addEventListener("readystatechange", function () {

        //readayState 是我這裡(xhr)做了什麼
        if (this.readyState === 4) {
            // console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'false') { return; }
            }
        }
    });

    robotxhr.open("POST", "invoice.rocket-coding.com/InvAccounts/IsRobot");//寫地址
    robotxhr.setRequestHeader("Content-Type", "application/json");
    robotxhr.withCredentials = true;

    robotxhr.send(robotData);
    // 機器人結束


})


