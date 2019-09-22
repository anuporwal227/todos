(function() {
    var addListTrigger = document.getElementById('trigger');
    var addListTarget = document.getElementById('add-list-target');
    var addListBtn = document.getElementsByClassName('add-list-btn')[0];
    var hideAddListBtn = document.getElementById('hide-add-list');
    var lists = document.getElementById('lists');
    var taskDescriptionModal = document.getElementById('task-description-modal');
    var closeModalButton = document.getElementsByClassName('close')[0];
    var addDescriptionInput = document.getElementById('add-description-input');
    var saveDescriptionBtn = document.getElementById('save-task-description');
    var editDescriptionBtn = document.getElementById('edit-description-btn');
    var closeSaveDescriptionBtn = document.getElementById('hide-task-description-input');

    var taskDetails = {};

    function toggleTaskDescriptionInput() {
        taskDescriptionModal.getElementsByClassName('task-description')[0].classList.toggle('hide');
        taskDescriptionModal.getElementsByClassName('add-task-description')[0].classList.toggle('hide');
    }

    function showTaskDescriptionDialog(e) {
        var taskId;
        if (e.target.classList.contains('.list-item')) {
            taskId = e.target.id;
        } else {
            taskId = (getClosest(e.target, '.list-item')).id;
        }
        taskDescriptionModal.querySelector('.task-title').innerText = taskDetails[taskId].name;
        if (taskDetails[taskId].description) {
            taskDescriptionModal.getElementsByClassName('task-description-para')[0].innerText = taskDetails[taskId].description;
            toggleTaskDescriptionInput();
        } else {
            toggleTaskDescriptionInput();
        }
        taskDescriptionModal.id = 'task_' + taskId;
        taskDescriptionModal.style.display = 'flex';
    }

    closeModalButton.addEventListener('click', function() {
        taskDescriptionModal.querySelector('.task-title').innerText = '';
        taskDescriptionModal.getElementsByClassName('task-description-para')[0].innerText = '';
        taskDescriptionModal.id = '';
        toggleTaskDescriptionInput();
        taskDescriptionModal.style.display = 'none';
    });

    saveDescriptionBtn.addEventListener('click', function() {
        var taskDescription = addDescriptionInput.value;
        var taskId = taskDescriptionModal.id.split('_')[1];
        if (taskDescription) {
            taskDetails[taskId].description = taskDescription;
            taskDescriptionModal.getElementsByClassName('task-description-para')[0].innerText = taskDescription;
            toggleTaskDescriptionInput();
        }
    });

    closeSaveDescriptionBtn.addEventListener('click', toggleTaskDescriptionInput);
    editDescriptionBtn.addEventListener('click', function() {
        var taskId = taskDescriptionModal.id.split('_')[1];
        addDescriptionInput.value = taskDetails[taskId].description;
        toggleTaskDescriptionInput();
    })

    function toggleAddList() {
        addListTrigger.classList.toggle('hide');
        addListTarget.classList.toggle('hide');
    }

    addListTrigger.addEventListener('click', toggleAddList);

    function deleteTask(e) {
        e.stopPropagation();
        var listItem = getClosest(e.target, '.list-item');
        delete taskDetails[listItem.id];
        document.getElementById(listItem.id).remove()
    }

    var createNewListItem = function(taskName) {
        var listItem = document.createElement("div");
        var listItemName = document.createElement("p");
        var deleteListItem = document.createElement("button");

        listItem.className = 'list-item';
        listItem.id = uuidv4();
        listItem.draggable = true;
        listItem.ondragstart = dragStart;
        listItem.onclick = showTaskDescriptionDialog;

        taskDetails[listItem.id] = {
            name: taskName
        };

        deleteListItem.innerText = 'Delete';
        deleteListItem.className = 'delete-task';
        deleteListItem.onclick = deleteTask;

        listItemName.innerText = taskName;
        listItemName.appendChild(deleteListItem);
        listItem.appendChild(listItemName);

        return listItem;
    };

    function addTask(e) {
        var list = getClosest(e.target.parentElement, '.list');
        var tasksList = list.getElementsByClassName('tasks-list')[0];
        var taskName = e.target.previousSibling;
        if (taskName.value) {
            var newTask = createNewListItem(taskName.value);
            tasksList.appendChild(newTask);
            taskName.value = '';
        }
    }

    function toggleAddTask(e) {
        var addTaskTrigger, addTaskTarget;
        if (e.target.classList.contains('.add-task-trigger')) {
            addTaskTrigger = e.target;
        } else {
            addTaskTrigger = e.target.parentElement;
        }

        addTaskTarget = (addTaskTrigger.parentElement).getElementsByClassName('add-task-target')[0];
        addTaskTrigger.classList.toggle('hide');
        addTaskTarget.classList.toggle('hide');
    }

    function toggleToggleAddTask(e) {
        var addTaskTarget = e.target.parentElement;
        var addTaskTrigger = addTaskTarget.previousSibling;
        var addTaskTargetInput = addTaskTarget.getElementsByTagName('textarea')[0];
        addTaskTargetInput.value = '';
        addTaskTrigger.classList.toggle('hide');
        addTaskTarget.classList.toggle('hide');
    }

    var createNewListElement = function(name) {
        var listElementWrapper = document.createElement('div');
        var list = document.createElement("div");
        var listName = document.createElement("p");
        var addTaskTrigger = document.createElement('div');
        var addTaskTriggerText = document.createElement('p');
        var addTaskTarget = document.createElement('div');
        var taskInput = document.createElement('textarea');
        var addTaskButton = document.createElement("button");
        var closeAddTaskButton = document.createElement("button");
        var tasksList = document.createElement('div');

        listElementWrapper.className = 'list-wrapper';

        list.className = 'list';
        list.ondragover = allowDrop;
        list.ondrop = drop;

        listName.innerText = name;
        listName.className = 'list-header';

        addTaskTrigger.className = 'add-task-trigger';
        addTaskTrigger.onclick = toggleAddTask;
        addTaskTriggerText.innerText = '+ Add task';
        addTaskTrigger.appendChild(addTaskTriggerText);

        addTaskTarget.className = 'add-task-target hide';

        taskInput.placeholder = 'Enter title for this task';

        addTaskButton.innerText = 'Save Task';
        addTaskButton.className = 'add-task';
        addTaskButton.onclick = addTask;

        closeAddTaskButton.className = 'close-btn';
        closeAddTaskButton.innerText = '✕';
        closeAddTaskButton.onclick = toggleToggleAddTask;

        addTaskTarget.appendChild(taskInput);
        addTaskTarget.appendChild(addTaskButton);
        addTaskTarget.appendChild(closeAddTaskButton);

        tasksList.className = 'tasks-list';

        list.appendChild(listName);
        list.appendChild(tasksList);
        list.appendChild(addTaskTrigger);
        list.appendChild(addTaskTarget);
        listElementWrapper.appendChild(list);

        return listElementWrapper;
    };

    function addList() {
        var listName = document.getElementById('new-list');
        if (listName.value) {
            var newList = createNewListElement(listName.value);
            lists.appendChild(newList);
            listName.value = '';
            toggleAddList();
        }
    }

    addListBtn.addEventListener('click', addList);
    hideAddListBtn.addEventListener('click', toggleAddList);

    function dragStart(e) {
        e.dataTransfer.setData("task", e.target.id);
    }

    function allowDrop(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        var data = e.dataTransfer.getData("task");
        if (e.target.classList.contains('tasks-list')) {
            tasksList = e.target;
        } else if (e.target.classList.contains('list') || e.target.classList.contains('list-wrapper')) {
            tasksList = e.target.getElementsByClassName('tasks-list')[0];
        } else {
            tasksList = (getClosest(e.target, '.list')).getElementsByClassName('tasks-list')[0];
        }
        tasksList.appendChild(document.getElementById(data));
    }
})();