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
            }  
            // }  else {
            //     button.setAttribute('disabled', 'true');               
            //     button.classList.add('btn-secondary');
            //     button.classList.remove('btn-primary');  
            // }
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
    function createTodoItemElement(todoItem, { onDone, onDelete }) {
        const doneClass = 'list-group-item-success';
        let item = document.createElement('li');
        // кнопки помещаем в контейнер для стилизации
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой чатси с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');        
        if (todoItem.done) {
            item.classList.add(doneClass);
        }    
        item.textContent = todoItem.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // добавляем обработчики на кнопки
        doneButton.addEventListener('click', function() {
            onDone({ todoItem, element: item });
            item.classList.toggle(doneClass, todoItem.done); // еслит мы в toggle передаем второй параметр, то класс будет переключаться в зависимости от значения этого булевого параметра, т.е., если параметр равен true, то класс точно применится и наоборот
        });
        deleteButton.addEventListener('click', function() {
            onDelete({ todoItem, element: item });            
        });

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);
        
        return item;
    }

    async function createTodoApp(container, title, owner) {
        // вызываем вышенаписанные функции, присваивая их в переменные
        const todoAppTitle = createAppTitle(title);
        const todoItemForm = createTodoItemForm();
        const todoList = createTodoList();
        const handlers = {
            onDone({ todoItem }) {
                todoItem.done = !todoItem.done;
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ done: todoItem.done }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            },
            onDelete({ todoItem, element }) {
                if (!confirm('Вы уверены?')) {
                    return
                }
                element.remove();
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'DELETE',                    
                });
            },
        };      

        // размещаем результат выполнения функций внутри контейнера
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        
        // Отправляем серверу запрос на список всех дел
        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        todoItemList.forEach(todoItem => {
            const todoItemElement = createTodoItemElement(todoItem, handlers);
            todoList.append(todoItemElement);            
        });

        // Регистрируем событие submit у формы, это событие свойственно только элементу формы. Браузер создаёт событие submit на форме по нажатию на enter или на кнопку создания дела, т.е. можно, либо нажать кнопку отправки формы, либо нажать enter, и дело добавится и в том и в другом случае
        todoItemForm.form.addEventListener('submit', async function(e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера. В данном случае, мы не хотим, чтобы страница перезагружалась при отправке формы, если не написать эту строчку, страница будет перезагружаться при отправке формы - это стандартное поведение
            e.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {                
                return;
            }

            // Делаем запрос к серверу на добавление нового дела
            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify({
                    name: todoItemForm.input.value.trim(),
                    owner, 
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const todoItem = await response.json();

            let todoItemElement = createTodoItemElement(todoItem, handlers);            

            // создаём и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItemElement);

            // обнуляем значение в поле, чтобы не пришлось стирать его вречную
            todoItemForm.input.value = '';            

            // делаем кнопку отправки формы неактивной после отправки формы и очищения поля для ввода
            todoItemForm.button.setAttribute('disabled', 'true'); 
            todoItemForm.button.classList.remove('btn-primary');
            todoItemForm.button.classList.add('btn-secondary');            
        });    
    }

    // присваиваем функцию createTodoApp в глобальную область видимости
    window.createTodoApp = createTodoApp;    
})();