var data = {};
let uniformNumbersValueData = {}

//檢查統編
let uniformNumbersInput = document.querySelector('#uniformNumbers');

uniformNumbersInput.addEventListener('keyup', function (e) {
    e.preventDefault();
    let uniformNumbersValue = uniformNumbersInput.value
    // console.log(uniformNumbersValue.length);
    uniformNumbersValueData = { "UniformNumbers": uniformNumbersValue }

    let info = document.querySelector('#info')
    let createBtn = document.querySelector('#createBtn')

    if (uniformNumbersValue.length == 8) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                // console.log(this.responseText);
                if (this.status == 200) {
                    if (this.responseText == 'true') {
                        // console.log('這個統編註冊過了')
                        info.textContent = "這個統編註冊過了"
                        createBtn.disabled = true;
                    } else {
                        info.textContent = ''
                        // console.log("沒有註冊過")
                        createBtn.disabled = false;
                    }
                } else {
                    alert('唉呦喂呀伺服器哭哭')//伺服器打回來的狀況
                }
            }
        });

        xhr.open("POST", "https://invoice.rocket-coding.com/InvAccounts/CheckAcUn");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(uniformNumbersValueData));
    } else {
        // console.log('請輸入8個字元')
        info.textContent = '請輸入8個字元的統編'
        createBtn.disabled = true;
    }
})

// 對表單的 submit 做監聽
let form = document.querySelector('#creatNewMember');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let formEl = this.elements;
    let compName = formEl.compName.value;
    let uniformNumbers = formEl.uniformNumbers.value;
    let compAddress = formEl.compAddress.value;
    let compPhoneNumber = formEl.compPhoneNumber.value;
    let mngrName = formEl.mngrName.value;
    let mngrPhoneNumber = formEl.mngrPhoneNumber.value;
    let pwd = formEl.pwd.value;
    let email = formEl.mngrEmail.value;

    data = {
        "CompName": compName,
        "UniformNumbers": uniformNumbers,
        "Password": pwd,
        "MngrName": mngrName,
        "MngrEmail": email,
        "MngrPhoneNumber": mngrPhoneNumber,
        "CompAddress": compAddress,
        "CompPhoneNumber": compPhoneNumber,
    }
    // console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {

        //readayState 是我這裡(xhr)做了什麼
        if (this.readyState === 4) {
            // console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'true') {
                    window.location = 'registerdone.html'
                } else {
                    alert("建檔失敗")
                }
            } else {
                alert('伺服器QQ')//伺服器打回來的狀況
            }
        }
    });

    xhr.open("POST", "https://invoice.rocket-coding.com/invAccounts/CreadeAcInfo");//寫地址
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;

    xhr.send(JSON.stringify(data));

})

// 對顯示密碼做處理
var pwdInput = document.querySelector('#pwd')
var showPwd = document.querySelector('#showPwd')

showPwd.addEventListener('change', function (e) {
    var target = e.target || e.srcElement;
    try {
        if (target.checked) {
            pwdInput.type = 'text';
        } else {
            pwdInput.type = 'password';
        }
    } catch (error) {
        alert('無法顯示密碼');
    }
});






