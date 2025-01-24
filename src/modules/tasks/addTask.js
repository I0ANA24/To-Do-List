(function closeOverlayFromButton() {
    const addTaskContainer = document.getElementById("add-task-container");
    const overlay = document.getElementById("overlay");
    const addTaskButtonFromContainer = document.getElementById("add-task-button");
  
    addTaskButtonFromContainer.addEventListener("click", () => {
        overlay.style.display = "none";
        addTaskContainer.classList.add("hide-add-task-container");
    });
})();
  
export function handleAddTask(page) {
    const addTaskButton = page.querySelector(".add-task-button");
    const addTaskContainer = document.getElementById("add-task-container");
    const overlay = document.getElementById("overlay");
    const addTaskButtonFromContainer = document.getElementById("add-task-button");

    addTaskButton.addEventListener("click", () => {
        overlay.style.display = "block";
        addTaskContainer.classList.remove("hide-add-task-container");

        addTaskButtonFromContainer.addEventListener("click", addTheTaskEventFunction);

        function addTheTaskEventFunction() {
            addTheTask(page);
            addTaskButtonFromContainer.removeEventListener("click", addTheTaskEventFunction);
        }
    });

    function addTheTask(page) {
        const tasksContainer = page.querySelector(".principal-tasks-container");

        const principalTask = newTask();
        tasksContainer.appendChild(principalTask);
        overlay.addEventListener("click", closeOverlayFromClickEventFunction);

        function newTask() {
            const task = document.createElement("div");
            task.classList.add("principal-task");
            
            task.innerHTML = `
                <div class="principal-task-left">
                    <div class="checkbox-container">
                        <input type="checkbox" id="today-input1">
                        <label for="today-input1"></label>
                    </div>                        
                    <p>New Task</p>
                </div>
                <p>Sat, 30 Nov</p>
            `;

            return task;
        }

        function closeOverlayFromClickEventFunction() {
            overlay.style.display = "none";
            addTaskContainer.classList.add("hide-add-task-container");
            overlay.removeEventListener("click", closeOverlayFromClickEventFunction);
        }
    }
}