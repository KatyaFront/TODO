// создаём массив с готовыми делами
let arrCases = [
    {name: 'Купить хлеб', done: true},
    {name: 'Починить машину', done: false},
    {name: 'Сходить на тренировку', done: false},
];

(function() {
    // создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        // стили заданы в bootstrap
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-secondary');
        button.setAttribute('disabled', 'true');
        button.textContent = 'Добавить дело';

        // делаем кнопку отправки формы активной при введении текста в поле для ввода
        input.addEventListener('input', function() {            
            if (input.value.length > 0) {
                button.removeAttribute('disabled');               
                button.classList.remove('btn-secondary');
                button.classList.add('btn-primary');  
            }  else {
                button.setAttribute('disabled', 'true');               
                button.classList.add('btn-secondary');
                button.classList.remove('btn-primary');  
            }
        });

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    // создаём и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // создаём функцию, которая создаст дом-элемент с делом. В него нам нужно поместить название дела, кнопку для завершения дела и кнопку для удаления дела
    function createTodoItem(name, done = false) {
        let item = document.createElement('li');
        // кнопки помещаем в контейнер для стилизации\
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой чатси с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');        
       
        item.textContent = name;

        if (done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp(container, title = 'Список дел', arr) {
        // вызываем вышенаписанные функции, присваивая их в переменные
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        // размещаем результат выполнения функций внутри контейнера
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // отрисовкa списка текущих задач
        // todoList.innerHTML = '';

        // отрисовкa списка текущих задач из массива
        for (let i = 0; i < arr.length; i++) {
            let todoCurrentItem = createTodoItem(arr[i].name);

            // добавляем обработчики на кнопки
            todoCurrentItem.doneButton.addEventListener('click', function() {
                todoCurrentItem.item.classList.toggle('list-group-item-success');                
            });
            todoCurrentItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) { // функция confirm встроена в браузер и вернет true, в случае, если человек нажмет ДА на диалоге выбора
                    todoCurrentItem.item.remove();
                }
            });

            // Меняем вид элемента с задачей, если в массиве уже заложено, что она Сделана
            if (arr[i].done === true) {
                todoCurrentItem.item.classList.toggle('list-group-item-success');
            }
            
            // создаём и добавляем в список новое дело с названием из массива        
            todoList.append(todoCurrentItem.item);
        }
        
        // проверяем, есть ли данные в localStorage
        let storedData = localStorage.getItem('todoList');
        let todoListData = storedData ? JSON.parse(storedData) : arr;

        // функция для обновления данных в localStorage
        function updatelocalStorage(data) {
            localStorage.setItem('todoList', JSON.stringify(data));            
        }

        // Регистрируем событие submit у формы, это событие свойственно только элементу формы. Браузер создаёт событие submit на форме по нажатию на enter или на кнопку создания дела, т.е. можно, либо нажать кнопку отправки формы, либо нажать enter, и дело добавится и в том и в другом случае
        todoItemForm.form.addEventListener('submit', function(e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера. В данном случае, мы не хотим, чтобы страница перезагружалась при отправке формы, если не написать эту строчку, страница будет перезагружаться при отправке формы - это стандартное поведение
            e.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {                
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);

            // добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');                
            });

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) { // функция confirm встроена в браузер и вернет true, в случае, если человек нажмет ДА на диалоге выбора
                    todoItem.item.remove();                    
                }
            });

            // создаём и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            // добавляем новое дело к текущим данным и обновляем localStorage
            todoListData.push({ name: todoItemForm.input.value, done: false });
            updatelocalStorage(todoListData);

            // обнуляем значение в поле, чтобы не пришлось стирать его вречную
            todoItemForm.input.value = '';            

            // делаем кнопку отправки формы неактивной после отправки формы и очищения поля для ввода
            todoItemForm.button.setAttribute('disabled', 'true'); 
            todoItemForm.button.classList.remove('btn-primary');
            todoItemForm.button.classList.add('btn-secondary');            
        });        

        // обнуляем список
        todoList.innerHTML = '';
        
        // восстанавливаем список дел при загрузке
        todoListData.forEach(function(itemData) {
            let todoCurrentItem = createTodoItem(itemData.name, itemData.done);
            // создаем и добавляем в список новое дело
            todoList.append(todoCurrentItem.item);    
            
            // обновляем список дел при изменении состояния дела (готово или нет) и сохраняем в localStorage
            todoCurrentItem.doneButton.addEventListener('click', function() {
                todoCurrentItem.item.classList.toggle('list-group-item-success');
                // находим элемент в данных и обновляем его статус
                let index = todoListData.findIndex(item => item.name === itemData.name); // todoItemForm.input.value
                if (index !== -1) {
                    todoListData[index].done = !todoListData[index].done;
                    updatelocalStorage(todoListData);
                }
            });

            // обновляем список дел при удалении дела и сохраняем в localStorage
            todoCurrentItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    todoCurrentItem.item.remove();

                    // удаляем элемент из данных и обновляем localStorage
                    let index = todoListData.findIndex(item => item.name === itemData.name); // todoItemForm.input.value
                    if (index !== -1) {
                        todoListData.splice(index, 1);
                        updatelocalStorage(todoListData);
                    }
                }
            });
        });        
    }

    // присваиваем функцию createTodoApp в глобальную область видимости
    window.createTodoApp = createTodoApp;    
})();