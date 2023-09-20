(function() {
    // создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // сщздаём и возвращаем форму для создания дела
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
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

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
    function createTodoItem(name) {
        let item = document.createElement('li');
        // кнопки помещаем в контейнер для стилизации\
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой чатси с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'algin-items-center');
        item.textContent = name;

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

    // обработчик событий для загрузки дом-дерева
    document.addEventListener('DOMContentLoaded', function() {
        // получаем div из html-документа
        let container = document.getElementById('todo-app');

        // вызываем вышенаписанные функции, присваивая их в переменные
        let todoAppTitle = createAppTitle('Список дел');
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        
        // размещаем результат выполнения функций внутри контейнера
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        
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

            // обнуляем значение в поле, чтобы не пришлось стирать его вречную
            todoItemForm.input.value = '';            
        });
    });
})();

