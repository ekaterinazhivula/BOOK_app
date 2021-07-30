class Book {
    constructor(name, author, id, pageNumber) {
        this.name = name;
        this.author = author;
        this.id = id;
        this.pageNumber = pageNumber;
    }
    getInfo() {
        return `${this.name}, ${this.author}, ${this.pageNumber}`;
    }
}

class TravelBook extends Book {
    constructor (name, author, id, pageNumber, coverType) {
        super(name, author, id, pageNumber);
        this.coverType = coverType;
    }
}
class Comics extends Book {
    constructor (name, author, id, pageNumber, issueNumber) {
        super(name, author, id, pageNumber);
        this.issueNumber = issueNumber;
    }
}

let books = localStorage.getItem("books") != null 
    ? JSON.parse(localStorage.getItem("books"), reviver) : new Map();
let lastId = localStorage.getItem("lastId") != null ? localStorage.getItem("lastId") : 0;

initTable();

document.querySelector('#travel_book_form').addEventListener('submit', (e) => {
    e.preventDefault();
    let id = generateId();
    let book = new TravelBook(e.target[0].value, e.target[1].value, id, e.target[2].value, e.target[3].value);
    books.set(id, book);
    addTableRow(book, document.querySelector('#table-body'));
    localStorage.setItem("books", JSON.stringify(books, replacer));
    for(let i=0; i<4; i++) {
        e.target[i].value ='';
    }
});

document.querySelector('#comics_book_form').addEventListener('submit', (e) => {
    e.preventDefault();
    let id = generateId();
    let book = new Comics(e.target[0].value, e.target[1].value, id, e.target[2].value, e.target[3].value);
    books.set(id, book);
    addTableRow(book, document.querySelector('#table-body'));
    localStorage.setItem("books", JSON.stringify(books, replacer));
    for(let i=0; i<4; i++) {
        e.target[i].value ='';
    }    
});

function generateId() {
    ++lastId;
    localStorage.setItem("lastId", lastId);
    return lastId;
}

function initTable () {
    let tableBody = document.querySelector('#table-body');
    for(let [id, book] of books.entries()) {
        addTableRow(book, tableBody);
    }
}

function addTableRow (book, tableBody) {
    let row = document.createElement('tr');
    let nameCol = document.createElement('td');
    nameCol.textContent = book.name;
    let authorCol = document.createElement('td');
    authorCol.textContent = book.author;
    let actionCol = document.createElement('td');
    let btnDelete = document.createElement('input');
    btnDelete.setAttribute('type', 'button');
    btnDelete.setAttribute('value', 'Удалить');
    btnDelete.classList.add('btn');
    btnDelete.onclick = () => {
        books.delete(book.id);
        tableBody.removeChild(row);
        localStorage.setItem("books", JSON.stringify(books, replacer));
    };
    let btnInfo = document.createElement('input');
    btnInfo.setAttribute('type', 'button');
    btnInfo.setAttribute('value', 'Подробнее');
    btnInfo.classList.add('btn');
    btnInfo.onclick = () => {
        alert(book.getInfo());
    };
    actionCol.appendChild(btnDelete);
    actionCol.appendChild(btnInfo);
    row.appendChild(nameCol);
    row.appendChild(authorCol);
    row.appendChild(actionCol);
    tableBody.appendChild(row);
}

function replacer(key, value) {
    if(value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
}