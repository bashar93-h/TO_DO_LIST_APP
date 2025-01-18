let tasks = []

window.onload = () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if(storedTasks){
        tasks = storedTasks;
        updateTasksList();
    }
}

function saveTasks() {
    window.localStorage.setItem("tasks",JSON.stringify(tasks));
}

const addTask = () => {
    const currentDate = new Date().toString().split("GMT")[0];
    let taskInput = document.querySelector(".taskInput");
    let text = taskInput.value.trim();
    if(text) {
        tasks.push({
            text:text,
            completed:false,
            taskDate_created: currentDate, 
            taskDate_updated: currentDate
        });
        saveTasks();
        updateTasksList()
        taskInput.value = ""
    }
}

function toggleTaskComplete(index){
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    saveTasks();
}


function deleteTask(index){
    // delete tasks[index];
    tasks.splice(index, 1);
    updateTasksList();
    saveTasks();
}


function editTask(index){
    let taskInput = document.querySelector(".taskInput");
    taskInput.value = tasks[index].text;
    taskInput.focus();
    document.querySelectorAll(".task p")[index].innerHTML = ""    

    document.querySelector(".new-task").onclick = function(e){        
        e.preventDefault();
 
        const updatedText = taskInput.value.trim();
        if(updatedText){
            tasks[index].text = updatedText;
            tasks[index].taskDate_updated = new Date().toString().split("GMT")[0];
            updateTasksList();
            saveTasks();
            taskInput.value = "";
            this.onclick = addTask;
        }
    }
}

function updateStats(){
    const completedTasks = tasks.filter(task => {
        return task.completed
    }).length;
    const totalTasks = tasks.length;
    const progressValue = (completedTasks / totalTasks) * 100;
    const progress = document.querySelector(".progress");
    console.log(progress)
    progress.style.width = `${progressValue}%`; 
    document.querySelector(".number").innerHTML = `${completedTasks} / ${totalTasks}`;
}

function toggleDateVisibilty(event, index) {
    console.log("showDate");
    // document.querySelectorAll(".taskDate")[index].classList.toggle("hidden"); 
    const taskDiv = document.querySelectorAll(".task")[index];
    const taskDate = document.querySelectorAll(".taskDate")[index];
    const taskParagraph = taskDiv.querySelector("p");
    if(event.target === taskDiv || event.target === taskParagraph){
        taskDate.classList.toggle("hidden")
    }
}

const updateTasksList = () => {
    const tasksList = document.querySelector(".tasks-list");
    tasksList.innerHTML = "";
    tasks.forEach((task,index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                    <div class="task ${task.completed ? "completed" : ""}" onclick=toggleDateVisibilty(event,${index})>
                        <label>
                            <input type="checkbox" ${task.completed ? "checked": ""}> 
                            <span class="circleRadio"></span>
                        </label>          
                        <p>${task.text}</p>
                        <i class="fa-regular fa-pen-to-square edit" onclick="editTask(${index})"></i>
                        <i class="fa-sharp fa-solid fa-trash-can trash" onclick="deleteTask(${index})"></i>
                    </div> 
                    <div class="taskDate hidden">
                        <div class="taskDate_created">
                            Created: <span>${task.taskDate_created}</span>
                        </div>
                        <div class="taskDate_updated">
                            Updated: <span>${task.taskDate_updated}</span> 
                        </div>
                    </div>      
        `;

        listItem.addEventListener("change", () => toggleTaskComplete(index));
        tasksList.appendChild(listItem);

    })      
    updateStats();
}

document.querySelector(".new-task").onclick = function(e){
    e.preventDefault();
    addTask();
}
