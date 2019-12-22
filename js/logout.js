var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        console.log(this.responseText);
        window.location = 'login.html'
    }
});

xhr.open("POST", "http://invoice.rocket-coding.com/InvAccounts/SignOut");
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.send(data);