var data = {};


// 對表單的 submit 做監聽
let form = document.querySelector('#buyerAdd')

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let formEl = this.elements;
    let buyerCompanyName = formEl.buyerCompanyName.value;
    let buyerUniformNum = formEl.buyerUniformNum.value;
    let buyerCompanyAdd = formEl.buyerCompanyAdd.value;
    let buyerCompanyTel = formEl.buyerCompanyTel.value;
    let buyerContactName = formEl.buyerContactName.value;
    let buyerContactMobile = formEl.buyerContactMobile.value;
    let buyerContactEmail = formEl.buyerContactEmail.value;

    data = {
        "UniformNumbers": buyerUniformNum,
        "CompName": buyerCompanyName,
        "CompAddress": buyerCompanyAdd,
        "CompPhoneNumber": buyerCompanyTel,
        "ContactName": buyerContactName,
        "ContactPhone": buyerContactMobile,
        "ContactEmail": buyerContactEmail,
    }
    console.log(data);

    var xhr = new XMLHttpRequest();

    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'true') {
                    alert('買受人建檔成功')
                    window.location = 'buyerAdd.html'

                } else {
                    alert('opppppse')
                }
            } else {
                alert('伺服器QQ')
            }
        }
    })

    xhr.open("POST", "http://invoice.rocket-coding.com/InvClientInfoes/CreadeClient");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));

})


