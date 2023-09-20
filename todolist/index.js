let form = document.querySelector('#mainForm');
let input = document.querySelector('#input');
let ul = document.querySelector('#list');
let even = document.querySelector('input[name="even"]');
let odd = document.querySelector('input[name="odd"]');
let dfTask = document.querySelector('input[name="delFirstTask"]');
let dlTaks = document.querySelector('input[name="delLastTask"]');

let tasks = JSON.parse(localStorage.getItem('data')) || [];


//Изменение текста кнопки чётных элементов активных задач
function changeNameEven() {
    if (localStorage.getItem('even') == 'true') {

        even.value = 'Отменить выбор'
    } else {
        even.value = 'Чётные элементы';
    }
}
changeNameEven();

//Изменение текста кнопки НЕчётных элементов активных задач
function changeNameOdd() {
    if (localStorage.getItem('odd') == 'true') {

        odd.value = 'Отменить выбор'
    } else {
        odd.value = 'НЕчётные элементы';
    }
}
changeNameOdd();


form.addEventListener('submit', addTask);
even.addEventListener('click', evenTasks);
even.addEventListener('click', changeNameEven);
odd.addEventListener('click', oddTasks);
odd.addEventListener('click', changeNameOdd);
dfTask.addEventListener('click', delFirstTask);
dlTaks.addEventListener('click', delLastTask);

window.addEventListener('DOMContentLoaded', classActive);



//Если нет задач
function noTasks(elem) {
    if (elem.length == 0) {
        let x = document.createElement('li');
        x.classList.add('noTasks');
        x.innerHTML = '<span>Список задач пуст</span>';
        ul.append(x);
    }
}

//Добавление задачи
function addTask(e) {
    e.preventDefault();
    if (e.target.input.value) {
        tasks.unshift({
            text: change1(e.target.input.value),
            style: null,
            evenStyle: null,
            oddStyle: null,
            valueButton: 'Выполнить',
        });
    } else {
        alert('Введите задачу');
        if (localStorage.getItem('even') === 'true') {
            highlightEvenTasks();
        }
        if (localStorage.getItem('odd') === 'true') {
            highlightOddTasks();
        }
    }

    addLS();
    showTasks(tasks, ul);
    if (localStorage.getItem('even') === 'true') {
        highlightEvenTasks();
    }
    if (localStorage.getItem('odd') === 'true') {
        highlightOddTasks();
    }

    this.reset();

}

//экранирование в тексте задачи
function change1(elem) {
    if (elem.includes('<')) {
        return elem.replaceAll('<', '&lt');
    } else {
        return elem;
    }
}


//Отображение задач
function showTasks(tasks, ul) {

    ul.innerHTML = tasks.map((e, i) => {
        return `<li id=${i} class='${e.evenStyle} ${e.style} ${e.oddStyle}'>
                    <span>${e.text}</span>
                    <div>
                    <button class='complited'>${e.valueButton}</button>
                    <button class='deleteTask'>Удалить</button>
                    </div></li>`;
    }).join('');

    let li = document.querySelectorAll('li');
    li.forEach(e => e.addEventListener('click', eventsForButtons));
    noTasks(tasks);
}

//Событие для кнопок задачи (перемещение элемента в конец списка)
function eventsForButtons(e) {
    if (e.target.tagName == 'BUTTON' && e.target.classList.contains('complited')) {
        e.target.parentElement.previousElementSibling.classList.toggle('complitedText');
        if (tasks[e.target.parentElement.parentElement.id].style !== 'complitedText') {
            tasks[e.target.parentElement.parentElement.id].style = 'complitedText';
            tasks[e.target.parentElement.parentElement.id].valueButton = 'Вернуть';
            let task = tasks.splice(e.target.parentElement.parentElement.id, 1);
            tasks.push(task[0]);

            addLS();
            showTasks(tasks, ul);
            tasks.forEach(e => e.evenStyle = null);
            if (localStorage.getItem('even') === 'true') {
                highlightEvenTasks();
            }

            tasks.forEach(e => e.oddStyle = null);
            if (localStorage.getItem('odd') === 'true') {
                highlightOddTasks();
            }
            e.target.innerHTML = 'Oleg';
        } else {
            tasks[e.target.parentElement.parentElement.id].style = null;
            tasks[e.target.parentElement.parentElement.id].valueButton = 'Выполнить';
            let task = tasks.splice(e.target.parentElement.parentElement.id, 1);
            tasks.unshift(task[0]);
            addLS();
            showTasks(tasks, ul);
            tasks.forEach(e => e.evenStyle = null);
            if (localStorage.getItem('even') === 'true') {
                highlightEvenTasks();
            }
            tasks.forEach(e => e.oddStyle = null);
            if (localStorage.getItem('odd') === 'true') {
                highlightOddTasks();
            }
        };

    } else if (e.target.tagName == 'BUTTON' && e.target.classList.contains('deleteTask')) {

        tasks.splice(e.target.parentElement.parentElement.id, 1);

        addLS();
        showTasks(tasks, ul);

        tasks.forEach(e => e.evenStyle = null);
        if (localStorage.getItem('even') === 'true') {
            highlightEvenTasks();
        }
        tasks.forEach(e => e.oddStyle = null);
        if (localStorage.getItem('odd') === 'true') {
            highlightOddTasks();
        }

    }

}

//Добавление в localStorage параметров задач
function addLS() {
    localStorage.setItem('data', JSON.stringify(tasks));

}

//Выделение чётных элементов невыполненых задач
function evenTasks() {
    let button = document.querySelector('input[name="even"]');
    if (!button.classList.contains('active')) {
        button.classList.add('active');
        localStorage.setItem('even', true);
    } else {
        button.classList.remove('active');
        localStorage.setItem('even', false);
    }
    highlightEvenTasks()
}

//Выделение чётных элементов невыполненых задач
function highlightEvenTasks() {
    tasks.forEach((e, i) => {
        if ((i + 1) % 2 == 0 && e.evenStyle !== 'even' && e.style !== 'complitedText') {
            e.evenStyle = 'even';
        } else {
            e.evenStyle = null;
        }
    })
    addLS();
    showTasks(tasks, ul);
}

//Добавление класса кнопке чётных элементов после перезагрузки страцы, если кнопка была нажата
function classActive() {
    let evenTasksButton = document.querySelector('input[name="even"]');
    if (localStorage.getItem('even') === 'true') {
        evenTasksButton.classList.add('active');
    }
    let oddTasksButton = document.querySelector('input[name="odd"]');
    if (localStorage.getItem('odd') === 'true') {
        oddTasksButton.classList.add('active');
    }
}


//Выделение НЕчётных элементов невыполненых задач
function oddTasks() {
    let button = document.querySelector('input[name="odd"]');
    if (!button.classList.contains('active')) {
        button.classList.add('active');
        localStorage.setItem('odd', true);
    } else {
        button.classList.remove('active');
        localStorage.setItem('odd', false);
    }
    highlightOddTasks()
}
//Выделение НЕчётных элементов невыполненых задач
function highlightOddTasks() {
    tasks.forEach((e, i) => {
        if ((i + 1) % 2 !== 0 && e.oddStyle !== 'odd' && e.style !== 'complitedText') {
            e.oddStyle = 'odd';
        } else {
            e.oddStyle = null;
        }
    });
    addLS();
    showTasks(tasks, ul);
}

//Удаление первой задачи
function delFirstTask() {
    let index = 0;
    let x = activeTasks(tasks);
    if (x.length) {
        tasks.splice(index, 1);
        addLS();
        showTasks(tasks, ul);
    }
    if (localStorage.getItem('even') === 'true') {
        highlightEvenTasks();
    }
    if (localStorage.getItem('odd') === 'true') {
        highlightOddTasks();
    }

}

//Удаление последней активной задачи
function delLastTask() {
    let index = 0;
    let x = activeTasks(tasks);
    index = x.length - 1;
    if (x.length) {
        tasks.splice(index, 1);
        addLS();
        showTasks(tasks, ul);
    }
    if (localStorage.getItem('even') === 'true') {
        tasks.forEach(e => e.evenStyle = null);
        highlightEvenTasks();
    }
    if (localStorage.getItem('odd') === 'true') {
        tasks.forEach(e => e.oddStyle = null);
        highlightOddTasks();
    }

}

//выборка активных (невыполненых) задач
function activeTasks(elem) {
    return tasks.filter((e) => {
        return e.style !== 'complitedText';
    });
}

//Отображение задач после перезагрузки страницы
showTasks(tasks, ul);
