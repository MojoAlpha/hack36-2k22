const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

/**
 * Creates the main window
 */
const Window = require("./Window");
const DataStore = require("./DataStore");

require("electron-reload")(__dirname);

// create a new todo store name "Todos Main"
const proxyData = new DataStore({ name: "ProxyList" });

function createMainWindow() {
  const mainWindow = new Window({
    file: path.join("renderer", "index.html"),
    showDevTools: true,
  });
  mainWindow.removeMenu();
  // add todo window
  let addTodoWin;

  // TODO: put these events into their own file

  // initialize with todos
  mainWindow.once("show", () => {
    mainWindow.webContents.send("todos", proxyData.todos);
  });

  // create add todo window
  ipcMain.on("add-todo-window", (e) => {
    // if addshowTodoWin does not already exist
    if (!addTodoWin) {
      // create a new add todo window
      addTodoWin = new Window({
        file: path.join("renderer", "add.html"),
        width: 400,
        height: 400,
        // close with the main window
        parent: mainWindow,
      });

      // cleanup
      addTodoWin.on("closed", () => {
        addTodoWin = null;
      });
    }
  });

  // add-todo from add todo window
  ipcMain.on("add-todo", (event, todo) => {
    console.log(todo);
    const updatedTodos = proxyData.addTodo(todo).todos;
    console.log(updatedTodos);
    mainWindow.send("todos", updatedTodos);
  });

  // delete-todo from todo list window
  ipcMain.on("delete-todo", (event, todo) => {
    console.log("deleting todo");
    const updatedTodos = proxyData.deleteTodo(todo).todos;

    mainWindow.send("todos", updatedTodos);
  });
}

app.whenReady().then(createMainWindow);

// When all windows are closed exit the app, except in macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// When the application gets activated create the main window if one does not exist
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
