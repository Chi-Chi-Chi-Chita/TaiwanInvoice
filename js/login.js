var data = "Password=qq123&UniformNumbers=29186700";

let form = document.querySelector('#login')
form.addEventListener('submit', function (e) {
    e.preventDefault();
    var formEl = this.elements;
    var memberAccount = formEl.memberAccount.value;
    var memberPwd = formEl.memberPwd.value;

    data = `Password=${memberPwd}&UniformNumbers=${memberAccount}`
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'true') {
                    window.location = 'invoiceAdd.html'
                } else {
                    alert('認証失敗')
                }
            } else {
                alert('夾啦誒夾㕸')
            }
        }
    });

    xhr.open("POST", "http://invoice.rocket-coding.com/InvAccounts/GetLogin");
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.send(data);
})


