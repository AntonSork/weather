
const STORAGE_KEY = 'list of city';
const API_KEY = 'ade7b2b40a4d71fc21c8c0b9dfd931e9';
const API_URL = `https://api.openweathermap.org/data/2.5/weather/?appid=${API_KEY}{params}&units=metric`;
const CITY_INPUT = document.getElementById('city');
const CITY_LIST_ELEMENT = document.getElementById('listOfCity');
let cityList = [];

initApp();

function getWeatherByCity(city) {
    const url = API_URL.replace('{params}', `&q=${city}`);
    callApi(url);
}

function getWeatherByLocation(location) {
    const url = API_URL.replace('{params}', `&lat=${location.latitude}&lon=${location.longitude}`);
    callApi(url);
}

async function callApi(url) {
    return await fetch(url).then(addCity).catch(errorHandling);
}

function getByLocation() {
    navigator.geolocation.getCurrentPosition(
        position => getWeatherByLocation(position.coords),
        error => errorHandling(error)
    );
}

function getByCity() {
    getWeatherByCity(CITY_INPUT.value);
    CITY_INPUT.value = null;
}

function addCity(response) {
    response.json().then(response => {
        if(response.cod !== 200) {
            errorHandling(response.message);
            return;
        }
        if(cityList.some(savedCity => savedCity === response.name)) {
            document.getElementById(response.id) && document.getElementById(response.id).remove();
        } else {
            updateStorageList(response.name);
        }
        addCityToDomList(response);
    });
}

function updateStorageList(city) {
    if (!city) return;
    cityList.push(city);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cityList));
}

function errorHandling(error) {
    const message = error && error.message ? error.message : error;
    alert(message || 'Something went wrong');
}

function addCityToDomList(response) {
    if (!response) return;
    const li = document.createElement('li');
    li.id = response.id;
    li.innerText = `${response.name} ${response.main.temp} C`;
    li.classList.add('list-item');
    CITY_LIST_ELEMENT.appendChild(li);
}

function initApp() {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.forEach(city => getWeatherByCity(city));
}

function clearList() {
    cityList = [];
    CITY_LIST_ELEMENT.innerHTML = null;
    localStorage.clear();
}

CITY_INPUT.addEventListener('keypress', event => event.which === 13 && getByCity());
