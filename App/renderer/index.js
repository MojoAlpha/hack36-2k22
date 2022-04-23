const { log } = require("console");
const { ipcRenderer } = require("electron");
const fs = require("fs");
const { run_shell_command } = require("../scripts/run_shell_command");
// delete todo by its text value ( used below in event listener)
const deleteTodo = (textContent) => {
  ipcRenderer.send("delete-todo", textContent);
};

// create add todo window button
document.getElementById("createTodoBtn").addEventListener("click", () => {
  console.log("clicked");
  ipcRenderer.send("add-todo-window");
});

document.getElementById("findBestProxy").addEventListener("click", () => {
  ipcRenderer.send("request-todo-list");
});

ipcRenderer.on("sending-todo-list", (event, todos) => {
  console.log("here are the requested data:", todos);
});

// on receive todos
ipcRenderer.on("todos", (event, todos) => {
  console.log("updated");
  // get the todoList ul
  const todoList = document.getElementById("todoList");

  // create html string
  const todoItems = todos.reduce((html, todo) => {
    html += `<li class="todo-item bg-white w-full justify-between mr-0 flex items-center text-gray-900 p-2 rounded-md shadow-lg font-bold"><p>${todo.ip}</p>
    <div class="float-right flex space-x-2">
    <img id="connectBtn" title="connect" class="cursor-pointer h-5 w-5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADN0lEQVR4nO2ay2sUQRDGfwmLguILFCRxbwZBRcEXJAe9mJMYUNCj3gTPQhLIUQQTPPiAHNSzoOhFETTJEjQJ/gtxr0pChCjGF6txx0N3mHGzme3umZ6ezfYHdZmt+rrq2+ma6e4BD480sAEYAeakDctraWGjZf7EGAaCGruZIv+IZf7EmGN1gvMp8s/b4m9LgwSRkC3+NqBqi789KUGzwwvgOgHX8AK4TsA1vACuE3ANL4DrBFyj5QXw8FDHNKtXZHm1KdWidFZTa6348gql2nSaYLMJoISWfwp4ATR8p61lkT6Um6BHqyPJpmI1YXzaMMplvTRB40f0ehHAGC0vQCFBbIDevFsGZoCXwDtgAXGiBNAB7Aa6gTNAj2ZuTnrRX9QWJj8RZ3s7Nbh3AbeAX4pjOHlNVxHgEdAZiTkADAAloAx8l1YGJoB+YH/Efw/wWGGc3AnwB7gS8T0BjMf419oYcCwSfxUxhXIlQDUmmUvSpwDci/h+Bh4A54AuYLO0LuA88FD6BDLmDmEvuBwz3lqHp1YRJ0A3Yh6XCPvAdWCbAu924Abh/C9Jrp6Y8XInQIWwgI/8fzv3Iu6C94Q9YBa4D5yO+B2XsYHkqsSMlzsBVuw3UJT+XcBbhZg3wF4ZU5QcjWJyK8AycBLoAxbltQVgCDgMbJJ2SF77JH0WZcwp1J42uRWg1p4CW2I4twLPDHibQoBZwlfvPmCSsAdMAmflb+2I/pB7AZY0k1wCLgCjMT6jwEXgmyb3V8u11kVZM8moVRBvfR3SBojv8ip3V+aYMEw2QBRci8EEfK8t1NcQ/YbJBoh/HcTm5cpma2cCvmumRSTZD3ieIHYFAeIxB8mWtC9SyMUIY5j9Y4N1uIYMuV5ZqUwRRzF7H6ggROhELHmHMGuCVeCI9Sob4C7mczep3c6gvoYoEK76srQJkm3ppYodZCtCSY6ZKxQQGxgmPUFnzkc3SXKJg8AT0i9+HNF0U4XN7eR9iEVPL2JdX0Rsf6ngB/BB2hjinaNsIUePLA8UdJvWFytZ1CBLAQJN/3aDGG1keTY4o+E7RQbFe3i4+8Kj3tclAQ6O6119H1CvH/gvuzwc4B9gULAnWtmrfAAAAABJRU5ErkJggg=="/>
    <img id="deleteBtn" title="delete" class="cursor-pointer h-5 w-5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACXUlEQVRoge2Yv2tTURTHP/fd+F9UyNwOjk62FZwcLRXUkGIVR8HB1hiDQlptcXWppkjrj4AVVwdbiNVRxziIQwZXBbuJufc6RJMXY9N38076WnifKdx3cs73y/1xLhdSUlIONUoymRvnDo7be1RcVtvckKopZiCS+E5VMRORDLirJ0+DWwFGJIpG4CvWXVEP3r7eKzCIlm9fxQOMoNRKlMCIBvZVfAvF0ShhUQ0cWLw2sTuBG5aQMOpddF2HfgZSA0mTGkia1EDSiBpw2VGRGB/EDJh8ieajj9hT53eNsRNTNB9+wFxelCpLRiKJyZewM6XW7/lVAILN510xdmIKU3wCOoM9dx0AXSnGrh17Blx2DJsrhDJqzFwFOzndHrKT023x7bGz13DZsbjl48+AatTRCznMracdgTqDKa5D5gj8+om5udYlHmvQy5dQjXrc8nKXOTt+ptsEgLWAg0CHxgx6aZZgq7q7qCQuc8H2K/RCDkwzNBh4i/euK5aJkAlrej86Ky4ehtHIVJ/Z7/dtQEQNtI/K8LL5iwow86t9+8QgiBkIn/OdQdu9nAItbkLEwP/FG/TSRXT5wj8bW9aESCPrEW+a6MU8wVa1tbHvzvSamKuINLLYBlSjjn4cepD706SC2kanSG2j54jVz+6JNDKRJRRU77fuNX3O+XCf0OtlgrWyRGnZZxWXHUU1PvXPESHGpxOn70JJkxpIGl8DO0NR0c0Pn2A/A45Nr/jBeOMT7DsDBeCb5398+I6msHdYBy8D6j2faXIMxwtkl9MO8BLNcVXji2DelJSUg85vwU3YNL7U328AAAAASUVORK5CYII="/>
    </div>
    </li>`;

    return html;
  }, "");

  // set list html to the todo items
  todoList.innerHTML = todoItems;

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll(".todo-item").forEach((item, index) => {
    console.log(item.children[0].textContent);
    item.children[1].children[1].addEventListener("click", () =>
      deleteTodo(item.children[0].textContent)
    );

    item.children[1].children[0].addEventListener("click", () => {
      const { ip, port, usernamw, password } = todos[index];

      run_shell_command(
        `/home/lovedeep/Desktop/code/3rdyear/hack36-2k22/App/scripts/setup.sh ${ip} ${port} ${usernamw} ${password}`
      )
        .then((op) => {
          console.log(op);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
