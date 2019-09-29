let xhr = new XMLHttpRequest();
xhr.open('GET', 'json/users.json');
xhr.send();

let userName = document.getElementById('input-name');
let userNick = document.getElementById('input-nick');
let userNameActive = document.querySelector('.users__name--active')
let userImgActive = document.querySelector('.users__img--active');
let buttonAuth = document.querySelector('.form__button');
let authPage = document.querySelector('.main-auth');
let commentPage = document.querySelector('.container');
let usersAuthData;
let arrayActiveUsers = {
	activeUsers: []
};
let userList = document.querySelector('.users__list');

xhr.onload = () => {
    let responseJson = xhr.response;
    let responseParse = JSON.parse(responseJson);
    usersAuthData = responseParse.users;
}

buttonAuth.addEventListener('click', (e) => {
    e.preventDefault();

    for (let i = 0; i < usersAuthData.length; i++) {
        if (usersAuthData[i].name === userName.value && usersAuthData[i].nick === userNick.value) {
        	sessionStorage.setItem('active', userName.value);
            authPage.style.display = 'none';
            commentPage.style.display = 'flex';
            document.cookie = `${usersAuthData[i].name}=active`;
        } 
    }

    let userAuthorised = sessionStorage.getItem('active');

    for (let i = 0; i < usersAuthData.length; i++) {
    	if (usersAuthData[i].name === userAuthorised) {
    		userNameActive.textContent = userAuthorised;
    	}
    }

    let cookies = getCookies();

	for (key in cookies) {
		if (key !== userAuthorised && !key.includes('comment')) {
			let keyName = {name: `${key}`};
			arrayActiveUsers.activeUsers.push(keyName);
		}
	}

	let template = document.getElementById('template');
	var templateSource = template.innerHTML;
    var rend = Handlebars.compile(templateSource);
    var templateHtml = rend(arrayActiveUsers);
    userList.innerHTML += templateHtml;
});

let buttonSend = document.querySelector('.button--send');

let cookiesAfterSend = getCookies();
let i;

if (Number(cookiesAfterSend[`msgNumber${sessionStorage.getItem('active')}`] > 0)) {
	i = Number(cookiesAfterSend[`msgNumber${sessionStorage.getItem('active')}`]);
} else {
	i = 0;
}

console.log(i);
console.log(cookiesAfterSend[`msgNumber${sessionStorage.getItem('active')}`]);

let wrapperMessage = document.querySelector('.wrapper-message');

buttonSend.addEventListener('click', (e) => {
	e.preventDefault();
	i++;

	let inputMessage = document.querySelector('.message');
	document.cookie = `comment${i}${sessionStorage.getItem('active')}=${inputMessage.value}`;
	document.cookie = `msgNumber${sessionStorage.getItem('active')}=${i}`;

	for (key in cookiesAfterSend) {
		if (key.includes('comment') && key.includes(`${sessionStorage.getItem('active')}`) && key.includes(`${i}`)) {
			let div = document.createElement('div');
			div.textContent = 'Hola';
			wrapperMessage.appendChild(div);
		}
	}

});



let delete_cookie = function(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

if (window.performance) {

  if (performance.navigation.type == 1) {
    delete_cookie(sessionStorage.getItem('active'));
    sessionStorage.clear();
    commentPage.style.display = 'none';
    authPage.style.display = 'flex';
  }
}

function getCookies() {

    let cookies;

    cookies = document.cookie.split('; ').reduce((prev, current) => {

        let [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});

    cookies;

    return cookies;
}