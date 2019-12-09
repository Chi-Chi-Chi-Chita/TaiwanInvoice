var data = "CompName=%E4%B9%9D%E5%AE%AE%E6%A0%BC&UniformNumbers=12345678&Password=pizza&MngrEmail=markwuintw%40gmail.com&MngrPhoneNumber=0928021359&CompAddress=%E9%AB%98%E5%B8%82%E9%BC%93%E5%B1%B1%E5%8D%80%E4%B8%AD%E8%8F%AF%E4%B8%80%E8%B7%AF952%E8%99%9F&CompPhoneNumber=075542324&verif=0&MngrName=%E5%8D%80%E5%8D%80%E5%8D%80%E5%A1%94";


// 對表單做監聽
let form = document.querySelector('#creatNewMember');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    var formEl = this.elements;
    var compName = formEl.compName.value;
    var uniformNumbers = formEl.uniformNumbers.value;
    var compAddress = formEl.compAddress.value;
    var compPhoneNumber = formEl.compPhoneNumber.value;
    var mngrName = formEl.mngrName.value;
    var mngrPhoneNumber = formEl.mngrPhoneNumber.value;
    var pwd = formEl.pwd.value;
    var email = formEl.mngrEmail.value;

    data = `CompName=${compName}&UniformNumbers=${uniformNumbers}&Password=${pwd}&MngrEmail=${email}&MngrPhoneNumber=${mngrPhoneNumber}&CompAddress=${compAddress}&CompPhoneNumber=${compPhoneNumber}&verif=0&MngrName=${mngrName}`

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {

        //readayState 是我這裡(xhr)做了什麼
        if (this.readyState === 4) {
            // console.log(this.responseText);
            if (this.status == 200) {
                if (this.responseText == 'true') {
                    window.location = 'registerdone.html'
                } else {
                    alert("ooooooooops")
                }
            } else {
                alert('夾啦誒夾啦')//伺服器打回來的狀況
            }
        }
    });

    xhr.open("POST", "http://invoice.rocket-coding.com/invAccounts/GetRegister");//寫地址
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.withCredentials = true;

    xhr.send(data);

})







