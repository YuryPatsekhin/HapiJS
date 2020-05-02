import '../styles/index.scss';
import { api } from './api';

const SUCCESS_STATUS_CODE = 200;

let сurrentDisplayFilter = {
    name: '',
    country: '',
    age: '',
};

const editButtonHandler = (el) => {
    const editSection = document.querySelector('.editSection');
    editSection.style.display = 'block';
    document.querySelector('.editingName').value = el.name;
    document.querySelector('.editingCountry').value = el.country;
    document.querySelector('.editingAge').value = el.age;
    const saveButton = document.createElement('button');
    saveButton.innerHTML = "save";
    saveButton.classList.add('save');
    saveButton.addEventListener('click', (e) => saveButtonHandler(e, el._id));
    editSection.appendChild(saveButton);
    const closeButton = document.createElement('button');
    closeButton.innerHTML = "close";
    closeButton.classList.add('close');
    closeButton.addEventListener('click', closeButtonHandler);
    editSection.appendChild(closeButton);
};

const deleteButtonHandler = (el) => {
    api.deleteElement(JSON.stringify(el._id)).then(data => {
        if (data.status !== SUCCESS_STATUS_CODE) {
            alert(data.message);
        } else {
            showElementsByFilter();
        }
    });
}

const saveButtonHandler = (e, _id) => {
    const editSection = e.target.parentElement;
    const name = editSection.querySelector('.editingName').value ? editSection.querySelector('.editingName').value.trim() : "";
    const country = editSection.querySelector('.editingCountry').value ? editSection.querySelector('.editingCountry').value.trim() : "";
    const age = editSection.querySelector('.editingAge').value ? editSection.querySelector('.editingAge').value.trim() : "";
    const obj = {
        name,
        country,
        age,
        _id,
    };
    api.editElement(JSON.stringify(obj)).then(answer => {
        if (answer.status !== SUCCESS_STATUS_CODE) {
            answer.json().then(result => {
                editSection.querySelector('.message').innerHTML = `${result.message}`;

            })
        } else {
            document.querySelector('.editSection').style.display = 'none';
            document.querySelector('.close').remove();
            document.querySelector('.save').remove();
            editSection.querySelector('.message').innerHTML = ``;
            showElementsByFilter();
        };
    });
};

const closeButtonHandler = () => {
    const editSection = document.querySelector('.editSection');
    editSection.style.display = 'none';
    document.querySelector('.close').remove();
    document.querySelector('.save').remove();
    editSection.querySelector('.message').innerHTML = ``;
};

const sumbitButtonHandler = () => {
    const name = document.querySelector('.name').value ? document.querySelector('.name').value.trim() : "";
    const country = document.querySelector('.country').value ? document.querySelector('.country').value.trim() : "";
    const age = document.querySelector('.age').value ? document.querySelector('.age').value.trim() : "";
    document.querySelector('.name').value = '';
    document.querySelector('.country').value = '';
    document.querySelector('.age').value = '';
    const obj = {
        name,
        country,
        age,
    };
    api.submitForm(JSON.stringify(obj)).then(data => {
        if (data.message) {
            document.querySelector('.message').innerHTML = `${data.message}`;
        };
        showElementsByFilter();
    });
};

const addDeleteButton = (li, el) => {
    const button = document.createElement('button');
    button.innerHTML = 'delete';
    button.addEventListener('click', () => deleteButtonHandler(el));
    li.appendChild(button);
};

const addEditButton = (li, el) => {
    const button = document.createElement('button');
    button.innerHTML = 'edit';
    button.addEventListener('click', () => editButtonHandler(el));
    li.appendChild(button);
};

const addElementToList = (list, el) => {
    const li = document.createElement('li');
    const text = `name: ${el.name} country: ${el.country}  age: ${el.age}`;
    li.appendChild(document.createTextNode(text));
    addEditButton(li, el)
    addDeleteButton(li, el);
    list.appendChild(li);
};

const showElementsByFilter = () => {
    const url = `http://127.0.0.1:3000/load?name=${сurrentDisplayFilter.name}&country=${сurrentDisplayFilter.country}&age=${сurrentDisplayFilter.age}`;
    const list = document.querySelector('.viewList');
    list.innerHTML = "";
    api.getData(url).then(data => {
        if (data.message) {
            document.querySelector('.loadError').innerHTML = `${data.message}`;
        } else {
            data.forEach(el => {
                addElementToList(list, el);
            });
        };
    });
};

const loadButtonHandler = () => {
    document.querySelector('.loadError').innerHTML = '';
    сurrentDisplayFilter.name = document.querySelector('.filterName').value ? document.querySelector('.filterName').value.trim() : "";
    сurrentDisplayFilter.country = document.querySelector('.filterCountry').value ? document.querySelector('.filterCountry').value.trim() : "";
    сurrentDisplayFilter.age = document.querySelector('.filterAge').value ? document.querySelector('.filterAge').value.trim() : "";
    showElementsByFilter();
};

document.querySelector('.sumbit').addEventListener('click', sumbitButtonHandler);
document.querySelector('.load').addEventListener('click', loadButtonHandler);
