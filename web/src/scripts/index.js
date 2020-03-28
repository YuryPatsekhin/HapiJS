import '../styles/index.scss';
import { api } from './api';

const sumbitButtonHandler = () => {
    const name = document.getElementById('name').value ? document.getElementById('name').value.trim() : "";
    const country = document.getElementById('country').value ? document.getElementById('country').value.trim() : "";
    const age = document.getElementById('age').value ? document.getElementById('age').value.trim() : "";
    document.getElementById('name').value = '';
    document.getElementById('country').value = '';
    document.getElementById('age').value = '';
    const obj = {
        name,
        country,
        age,
    }
    api.submitForm(JSON.stringify(obj)).then(data => {
        if (data.message) {
            document.getElementById('message').innerHTML = `${data.message}`;
        }
    });
}

document.getElementById('sumbit').addEventListener('click', sumbitButtonHandler);

const loadButtonHandler = () => {

    document.getElementById('loadError').innerHTML = '';
    const list = document.getElementById('viewList');
    list.innerHTML = "";
    const name = document.getElementById('filterName').value ? document.getElementById('filterName').value.trim() : "";
    const country = document.getElementById('filterCountry').value ? document.getElementById('filterCountry').value.trim() : "";
    const age = document.getElementById('filterAge').value ? document.getElementById('filterAge').value.trim() : "";
    const url = `http://127.0.0.1:3000/load?name=${name}&country=${country}&age=${age}`
    api.getData(url).then(data => {
        console.log('data', data);
        if (data.message) {
            document.getElementById('loadError').innerHTML = `${data.message}`;
        } else {
            data.forEach(el => {
                const li = document.createElement('li');
                const text = `name: ${el.name} country: ${el.country}  age: ${el.age}`
                li.appendChild(document.createTextNode(text));
                list.appendChild(li);
            });
        };
    });
}

document.getElementById('load').addEventListener('click', loadButtonHandler);
