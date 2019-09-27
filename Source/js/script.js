let xhr = new XMLHttpRequest();
xhr.open('GET', 'json/users.json');
xhr.send();

let userName = document.getElementById('input-name');
let userNick = document.getElementById('input-nick');
let button = document.querySelector('.form__button');
let usersAuthData;

xhr.onload = () => {
    let responseJson = xhr.response;
    let responseParse = JSON.parse(responseJson);
    usersAuthData = responseParse.users;
}


button.addEventListener('click', (e) => {
    e.preventDefault();

    for (let i = 0; i < usersAuthData.length; i++) {
        if (usersAuthData[i].name === userName.value && usersAuthData[i].nick === userNick.value) {
            document.cookie = `${usersAuthData[i].name}=active`;
            console.log(document.location);
            document.location.replace('/comment.html');
        } 
    }
})

if (window.performance) {

  if (performance.navigation.type == 1) {
    document.location.replace('index.html');
  }
}
//window.onload = () => {
//	document.location.replace('auth.html');
//}
