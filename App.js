const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
const { demandOption, string } = require("yargs");

function loadData() {
  try {
    const buffer = fs.readFileSync("db.json");
    const data = buffer.toString();
    const dataObj = JSON.parse(data);
    return dataObj;
  } catch (error) {
    return [];
  }
}

function addTodo(todo, status) {
  const data = loadData();
  if (data.length === 0) {
    id = 1;
  } else {
    id = data[data.length - 1].id + 1;
  }
  const newTodo = { todo: todo, status: status, id: id };
  data.push(newTodo);
  saveData(data);
  console.log(data);
}

function deleteTodo(deleteId) {
  const data = loadData();
  const id = data.findIndex((item) => item.id === deleteId);
  console.log(id);
  if (id === -1) {
    console.log("Your item is not found in the list");
    return;
  } else {
    dataCut = data.splice(id, 1);
    console.log(data);
    saveData(data);
  }
}

function toggleToDo(toggleId) {
  const data = loadData();
  const id = data.findIndex((item) => item.id === toggleId);
  console.log(id);
  console.log(data[id].status);
  if (data[id].status === true) {
    data[id].status = false;
    console.log(data[id].status);
    saveData(data);
  } else if (data[id].status === false) {
    data[id].status = true;
    console.log(data[id].status);
    saveData(data);
  }
}

function saveData(data) {
  fs.writeFileSync("db.json", JSON.stringify(data));
}

// if (process.argv[2] === "list"){
//     console.log("Listing todos")
//     const data = loadData()
//     data.forEach(({ todo, status }) => console.log(`todo:${todo}, status:${status}`))
// } else if (process.argv[2] === "add") {
//     let todo = process.argv[3] || null
//     let status = process.argv[4] || false
//     if (todo) {
//         console.log("Adding a new todo to the list")
//         addTodo(todo, status)
//     }
//     else {
//         console.log("Please add a todo thing")
//     }
// }
// else {
//     console.log("Not understand the command")
// }

yargs.command({
  command: "list",
  describe: "listing all todos",
  alias: "l",
  builder: {
    status: {
      describe: "status of todo",
      demandOption: false,
      type: "boolean",
      alias: "s",
    },
  },
  handler: function (arg) {
    let data = loadData();
    console.log("What is arg", typeof arg.status);
    if (arg.status === true) {
      data = data.filter((item) => item.status === true);
    } else if (arg.status === false) {
      data = data.filter((item) => item.status === false);
    } else {
      data = data;
    }
    data.forEach(({ todo, status }, idx) =>
      console.log(`idx:${idx}, todo:${todo}, status:${status}`)
    );
  },
});

yargs.command({
  command: "add",
  describe: "adding a todo",
  alias: "a",
  builder: {
    todo: {
      describe: "todo content",
      demandOption: true,
      type: "string",
      alias: "t",
    },
    status: {
      describe: "status of todo",
      demandOption: false,
      type: "boolean",
      alias: "s",
      default: false,
    },
  },
  handler: function ({ todo, status }) {
    addTodo(todo, status);
    console.log("finished adding");
  },
});

yargs.command({
  command: "filter-true",
  describe: "filter the complete",
  alias: "f-f",
  handler: function ({ todo, status }) {
    let data = loadData();
    let dataFilter = data.filter((item) => (item.status = true));
    console.log(dataFilter);
  },
});

yargs.command({
  command: "filter-false",
  describe: "filter the incomplete",
  alias: "f-f",
  handler: function ({ todo, status }) {
    let data = loadData();
    let dataFilter = data.filter((item) => (item.status = false));
    console.log(dataFilter);
  },
});

yargs.command({
  command: "toggle",
  describe: "toggle status",
  alias: "tog",
  builder: {
    id: {
      describe: "id number",
      type: "number",
    },
  },
  handler: function (arg) {
    if (arg.id != null) {
      console.log("What is id", arg.id);
      toggleToDo(arg.id);
    } else {
      console.log("Please input an id");
    }
  },
});

yargs.command({
  command: "delete",
  describe: "delete",
  alias: "del",
  builder: {
    id: {
      describe: "id number",
      type: "number",
    },
    complete: {
      describe: "status of todo",
      type: "boolean",
    },
  },
  handler: function (arg) {
    let data = loadData();
    console.log(data);
    if (arg.id != null) {
      console.log("what is id", arg.id);
        deleteTodo(arg.id);
    } else if (arg.complete===true) {
        console.log("you have reached here", arg.complete)
        let dataFilter = data.filter((item) => (item.status === false));
        console.log(dataFilter)
        saveData(dataFilter)
        // saveData(dataFilter)
    }
    else {
      data = [];
      saveData(data);
    }
  },
});

yargs.parse();
