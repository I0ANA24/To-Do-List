export function handleAddTask(page, addTaskButton) {
    const addTaskContainer = document.getElementById("add-task-container");
    const overlay = document.getElementById("overlay");
    
    overlay.style.display = "block";
    addTaskContainer.classList.remove("hide-add-task-container");

    closeOverlayFromButton(overlay, addTaskContainer);
    // addTheTask(page, addTaskContainer);
}

function closeOverlayFromButton(overlay, addTaskContainer) {
    const addTaskButtonFromContainer = document.getElementById("add-task-button");

    addTaskButtonFromContainer.addEventListener("click", () => {
        overlay.style.display = "none";
        addTaskContainer.classList.add("hide-add-task-container");
    });
}

// function addTheTask(page, addTaskContainer) {

// }

export function closeOverlayFromClick(overlay) {
    const addTaskContainer = document.getElementById("add-task-container");
    
    if (!addTaskContainer.classList.contains("hide-add-task-container")) {
        overlay.style.display = "none";
        addTaskContainer.classList.add("hide-add-task-container");
    }
}