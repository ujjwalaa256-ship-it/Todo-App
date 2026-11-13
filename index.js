
const todoForm = document.querySelector("#form")
const todoinput = document.querySelector("#todoinput")
const todoList = document.querySelector("#todolist")
const formBtn = document.querySelector("#form-btn")
const taskCount = document.querySelector("#task-count")
const completeCount = document.querySelector("#complete-count")
const cancelBtn = document.querySelector("#cancel-btn")


let todos = JSON.parse(localStorage.getItem("todos")) || [];



let editTodoId = null // flag

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()


    const todoValue = todoinput.value.trim();
    // todos.push(todoValue);

    console.log({ editTodoId, todoValue });

    if (!todoValue) {
        return
    }

    if (editTodoId) {
        todos = todos.map((todo) => {
            if (todo.id === Number(editTodoId)) {
                return {
                    ...todo,
                    text: todoValue
                }
            }

            return todo
        })

        localStorage.setItem("todos", JSON.stringify(todos))
    } else {
        let newtodo = {
            id: Date.now(),
            text: todoValue,
            iscompleted: false
        }


        todos.push(newtodo)

        localStorage.setItem("todos", JSON.stringify(todos))
    }

    todoinput.value = ""


    cancelEdit()

    renderTodo()



})



function renderTodo() {
    todoList.innerHTML = ""
    todos.forEach(function (todo) {

        const li = document.createElement("li")
        // li.textcontent = todo.text
        // <li data-id="1" class="flex gap-2 border border-gray-300 rounded-lg py-2 px-3 
        li.dataset.id = todo.id
        li.className = `flex gap-2 border border-gray-300 rounded-lg py-2 px-3`
        li.innerHTML = `
    
                    <input data-action="toogle" ${todo.iscompleted === true ? 'checked' : ""} type="checkbox">
                    <p class="flex-1  ${todo.iscompleted ? "line-through text-gray-500" : ""}" >${todo.text}</p>
                    <div class="flex gap-2">
                        <button data-action="edit" data-id="${todo.id}"  class="bg-yellow-50  rounded-md text-yellow-500 px-2 font-semibold">Edit</button>
                        <button data-action="delete" data-id="${todo.id}" class="bg-red-50 rounded-md text-red-600 px-2 py-0.5 font-semibold">Delete</button> 
                    </div>
                
    `
        todoList.append(li)
    })

    taskCount.textContent = `TASKS (${todos.length})`
    completeCount.textContent = `COMPLETED (${todos.filter((todo) => todo.iscompleted).length})`

}

renderTodo()



todoList.addEventListener('click', (e) => {

    e.stopPropagation()

    const li = e.target.closest('li')
    // let btn = e.target.closest('button')

    const id = li.dataset.id
    let checkbox = e.target.closest('input[type="checkbox"]')

    let action = e.target.dataset.action;

    if (action === "edit") {
        startEdit(id)

    }

    if (action === "delete") {
        deleteTodo(id)

    }

    if (action === "toogle") {
        todos = todos.map((todo) => {
            if (todo.id === Number(id)) {
                return {
                    ...todo,
                    iscompleted: !todo.iscompleted
                }
            }
            return todo
        })

        localStorage.setItem("todos", JSON.stringify(todos))
        // console.log(todos);

        renderTodo()
    }


})

function deleteTodo(id) {

    // e.target.closest('li').remove()

    todos = todos.filter((todo) => {
        if (todo.id !== Number(id)) {
            return todo
        }

    })

    localStorage.setItem("todos", JSON.stringify(todos))
    // console.log(todos);
    renderTodo()


}

function startEdit(id) {

    editTodoId = id

    let currentTodo = todos.find((todo) => {
        if (todo.id === Number(id)) {
            return todo
        }

    })

    todoinput.value = currentTodo.text
    formBtn.textContent = "Update"

    formBtn.className =
        "px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors cursor-pointer";

    cancelBtn.classList.remove("hidden");
}

function cancelEdit() {
    editTodoId = null;
    todoinput.value = "";
    formBtn.textContent = "Add"

    formBtn.className =
        "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer";


    cancelBtn.classList.add("hidden");



}

cancelBtn.addEventListener(`click`, () => {
    cancelEdit()
})