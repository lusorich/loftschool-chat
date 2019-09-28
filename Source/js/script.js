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
let ola = document.querySelector('.users__list');

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
		if (key !== userAuthorised) {
			let keyName = {name: `${key}`};
			arrayActiveUsers.activeUsers.push(keyName);
		}
	}

	let template = document.getElementById('template');
	var templateSource = template.innerHTML;
    var rend = Handlebars.compile(templateSource);
    var templateHtml = rend(arrayActiveUsers);
    ola.innerHTML += templateHtml;

	console.log(arrayActiveUsers);
})

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