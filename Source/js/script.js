let xhr = new XMLHttpRequest();
xhr.open('GET', 'json/users.json');
xhr.send();

let userName = document.getElementById('input-name');
let userNick = document.getElementById('input-nick');
let userNameActive = document.querySelector('.users__name--active')
let buttonAuth = document.querySelector('.form__button');
let authPage = document.querySelector('.main-auth');
let commentPage = document.querySelector('.container');
let usersAuthData;
let arrayActiveUsers = {
    activeUsers: []
};
let imgNameActive = document.querySelector('.users__img--active');
let userList = document.querySelector('.users__list');
let imgUsers = document.querySelector('.users__img');

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

    getActiveUsers();

    i = getNumber();
});

function getActiveUsers() {
    let cookies = getCookies();
    let userAuthorised = sessionStorage.getItem('active');
    let divNumActiveUsers = document.querySelector('.users__number');
    let NumActiveUsers = 0;

    for (key in cookies) {
        if (key !== userAuthorised && !key.includes('comment') && !key.includes('date') && !key.includes('msg') && !key.includes('undefined') && !key.includes('URL')) {
            let keyName = {
                name: `${key}`,
                url: cookies[`URL${key}`]
            };
            NumActiveUsers++;
            arrayActiveUsers.activeUsers.push(keyName);
        }
        if (key.includes(`${userAuthorised}`) && key.includes('URL') && key.includes('URL').length > 0) {
            let urlActive = cookies[`URL${userAuthorised}`];
            imgNameActive.src = urlActive;
        }
    }

    for (let i = 0; i < usersAuthData.length; i++) {
        if (usersAuthData[i].name === userAuthorised) {
            userNameActive.textContent = userAuthorised;
        }
    }
    divNumActiveUsers.textContent = `Кол-во активных кроме нас: ${NumActiveUsers}`;
    let template = document.getElementById('template');
    var templateSource = template.innerHTML;
    var rend = Handlebars.compile(templateSource);
    var templateHtml = rend(arrayActiveUsers);
    userList.innerHTML += templateHtml;
}



let buttonSend = document.querySelector('.button--send');

let wrapperMessage = document.querySelector('.wrapper-message');

function getNumber() {

    let cookiesAfterSend = getCookies();

    if (Number(cookiesAfterSend[`msgNumber${sessionStorage.getItem('active')}`] > 0)) {
        return Number(cookiesAfterSend[`msgNumber${sessionStorage.getItem('active')}`]) + 1;
    } else {
        return 1;
    }

}

let i = getNumber();

buttonSend.addEventListener('click', (e) => {
    e.preventDefault();

    let date = new Date((Date.now() + 86400e3));
    date = date.toUTCString();

    let inputMessage = document.querySelector('.message');

    document.cookie = `comment${i}${sessionStorage.getItem('active')}=${inputMessage.value}; expires=${date}`;
    document.cookie = `date${i}${sessionStorage.getItem('active')}=${date}`;
    document.cookie = `msgNumber${sessionStorage.getItem('active')}=${i}`;
    i++;
    inputMessage.value = '';
});

function render(data) {

    wrapperMessage.innerHTML = '';


    for (let y = 0; y < data.length; y++) {
        let div = document.createElement('div');
        let span = document.createElement('span');
        let span2 = document.createElement('span');
        let p = document.createElement('p');
        let img = document.createElement('img');
        img.className = 'uses__img--msg';
        span.textContent = data[y].name;
        span2.textContent = data[y].date;
        p.textContent = data[y].msg;
        img.src = data[y].url;
        div.appendChild(span);
        div.appendChild(span2);
        div.appendChild(p);
        div.appendChild(img);
        wrapperMessage.appendChild(div);
    }

}


function getComment(name, num) {
    let cookiesForComments = getCookies();

    for (key in cookiesForComments) {
        if (key.includes(`${num}`) && key.includes(`${name}`) && key.includes('comment')) {
            return cookiesForComments[`comment${num}${name}`];
        }
    }
}

function getUrl(name) {
    let cookiesForUrl = getCookies();

    for (key in cookiesForUrl) {
        if (key.includes(`${name}`) && key.includes('URL')) {
            return cookiesForUrl[`URL${name}`];
        }
    }
}

function getDataFromCookies() {

    let arrayMessage = {
        messageUsers: []
    };

    let cookie = getCookies();

    let z = 0;
    let userComment = '';


    for (key in cookie) {

        if (key.includes('msgNumber')) {
            z += Number(cookie[key]);
        }
    }

    for (let w = 1; w <= z; w++) {

        for (key in cookie) {
            if (key.includes('date') && key.includes(`${w}`)) {

                let keyParse = key.split(`date${w}`);
                let msg = getComment(keyParse[1], w);
                let url2 = getUrl(`${keyParse[1]}`);

                arrayMessage.messageUsers.push({
                    date: `${cookie[`date${w}${keyParse[1]}`]}`,
                    name: `${keyParse[1]}`,
                    msg: `${msg}`,
                    url: `${url2}`
                });
            }
        }
    }
    render(arrayMessage.messageUsers);
}

setInterval(() => {
    if (authPage.style.display === 'none') {
        getDataFromCookies();
    }
}, 3000);


let userImgActive;

setInterval(() => {
    if (authPage.style.display === 'none') {

        userImgActive = document.querySelector('.users__img--active');

        userImgActive.addEventListener('click', (e) => {
            popup.style.display = 'block';
        })
    }
}, 3000);


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

let dropIn = document.querySelector('.popup__input');
let url;

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    let reader = new FileReader()
    let file = e.dataTransfer.files;
    url = URL.createObjectURL(file[0]);

    if (file[0].size > 512000) {
        alert('Файл должен быть меньше 512кб')
    }

    dropIn.style.backgroundImage = `url(${url})`;
}

let popup = document.querySelector('.popup');
let popupClose = document.querySelector('.popup__close');
let popupSave = document.querySelector('.popup__img-save');

popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
})

popupSave.addEventListener('click', () => {

    if (url === undefined) {
        alert('Нечего сохранять');
    }

    document.cookie = `URL${sessionStorage.getItem('active')}=${url}`;
    userImgActive.src = url;

    popup.style.display = 'none';
})

dropIn.addEventListener('drop', drop);