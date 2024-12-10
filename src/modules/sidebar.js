import projectIcon  from "../assets/project.svg";

export function handleSidebar() {
    openCloseSidebar();
    // pagAccess();
    handleAddProject();
}

function openCloseSidebar() {
    const sidebarButtonContainer = document.getElementById("sidebar-icon-container");
    const sidebarContainer = document.getElementById("sidebar-container");
    const overlay = document.getElementById("overlay");

    sidebarButtonContainer?.addEventListener("click", () => {
        sidebarContainer?.classList.toggle("open-close-sidebar");
        if(sidebarContainer?.classList.contains("open-close-sidebar")) {
            if(overlay) {
                overlay.style.display = "none";
            }
        } else {
            if(overlay) {
                overlay.style.display = "block";
            }
        }
    });


    overlay?.addEventListener("click", () => {
        sidebarContainer?.classList.add("open-close-sidebar");
        overlay.style.display = "none";
    });
}

const pagAccess = (function pagesAccess() {
    class sidebarPageRelationship {
        constructor(sidebarId, pageId, pageClass) {
            this.sidebarId = sidebarId;
            this.pageId = pageId;
            this.pageClass = pageClass;
        }

        setRelationship(sidebarId, pageId, pageClass) {
            this.sidebarId = sidebarId;
            this.pageId = pageId;
            this.pageClass = pageClass;
        }

        getSidebarId() {
            return this.sidebarId;
        }

        getPageId() {
            return this.pageId;
        }

        getPageClass() {
            return this.pageClass;
        }
    }


    const sidebarToPageMap = [
        new sidebarPageRelationship("today-sidebar", "today-page", "access-today-page"), 
        new sidebarPageRelationship("tomorrow-sidebar", "tomorrow-page", "access-tomorrow-page"), 
        new sidebarPageRelationship("this-week-sidebar", "this-week-page", "access-this-week-page"), 
        new sidebarPageRelationship("planned-sidebar", "planned-page", "access-planned-page"), 
        new sidebarPageRelationship("completed-sidebar", "completed-page", "access-completed-page"), 
        new sidebarPageRelationship("project1-sidebar", "project1-page", "access-project1-page")
    ];

    const addRelationship = (sidebarId, pageId, pageClass) => {
        const relationship = new sidebarPageRelationship(sidebarId, pageId, pageClass);
        sidebarToPageMap.push(relationship);
    }

    let currentSidebarPageRelationship = sidebarToPageMap[0];
    let currentSidebarPage = document.getElementById(currentSidebarPageRelationship.getPageId());

    const configureSidebarAction = (sidebarId, pageId, pageClass, isNewProject) => {
        const sidebarElement = document.getElementById(sidebarId);
        const pageElement = document.getElementById(pageId);

        sidebarElement?.addEventListener("click", () => {
            if (sidebarId !== currentSidebarPageRelationship.getSidebarId()) {
                switchPages();
                updateCurrentSidebar();
                closeSidebar();
            } else {
                closeSidebar();
            }
        });

        if(isNewProject === true) {
            if (sidebarId !== currentSidebarPageRelationship.getSidebarId()) {
                switchPages();
                updateCurrentSidebar();
                closeSidebar();
            } else {
                closeSidebar();
            }
        }

        function switchPages() {
            pageElement?.classList.toggle(pageClass);
            currentSidebarPage?.classList.toggle(currentSidebarPageRelationship.getPageClass());
        }

        function updateCurrentSidebar() {
            const newActiveSidebar = document.getElementById(sidebarId);
            const oldActiveSidebar = document.getElementById(currentSidebarPageRelationship.getSidebarId());
            newActiveSidebar?.classList.toggle("active-task-project");
            oldActiveSidebar?.classList.toggle("active-task-project");

            if(newActiveSidebar.classList.contains("prj")) {
                const newActiveSidebarPElements = newActiveSidebar.querySelectorAll('p');
                const newActiveSidebarP1 = newActiveSidebarPElements[0];
                const newActiveSidebarP2 = newActiveSidebarPElements[1];

                newActiveSidebarP1.classList.add("hide-count");
                newActiveSidebarP2.classList.remove("hide-options");
            }

            if(oldActiveSidebar.classList.contains("prj")) {
                const oldActiveSidebarPElements = oldActiveSidebar.querySelectorAll('p');
                const oldActiveSidebarP1 = oldActiveSidebarPElements[0];
                const oldActiveSidebarP2 = oldActiveSidebarPElements[1];

                oldActiveSidebarP1.classList.remove("hide-count");
                oldActiveSidebarP2.classList.add("hide-options");
            }

            currentSidebarPageRelationship.setRelationship(sidebarId, pageId, pageClass);
            currentSidebarPage = document.getElementById(currentSidebarPageRelationship.getPageId());
        }

        function closeSidebar() {
            const sidebarContainer = document.getElementById("sidebar-container");
            const overlay = document.getElementById("overlay");

            sidebarContainer?.classList.toggle("open-close-sidebar");
            if(overlay) {
                overlay.style.display = "none";
            }
        }
    }

    sidebarToPageMap.forEach((relationship) => {
        configureSidebarAction(
            relationship.getSidebarId(),
            relationship.getPageId(),
            relationship.getPageClass(),
            false
        );
    });

    return { configureSidebarAction, addRelationship };
})();

function handleAddProject() {
    const addProject = document.getElementById("add-project-button");
    const addProjectContainer = document.getElementById("new-project");
    const inputElement = document.getElementById("new-project-input");
    const cancelButton = document.getElementById("cancel-button");
    const addButton = document.getElementById("add-button");

    addProjectAction(addProject, addProjectContainer, addButton, inputElement);
    cancelButtonAction(inputElement, cancelButton, addProject, addProjectContainer);
    addButtonAction(inputElement, addButton, addProject, addProjectContainer);

    function addProjectAction(addProject, addProjectContainer, addButton, inputElement) {
        addProject.addEventListener("click", () => {
            addProjectContainer.classList.toggle("open-close-new-project");
            addProject.style.display = "none";
            addButton.disabled = true;
            inputElement.focus();
        });
    }
    
    let numberOfProjects = 1;
    
    function addButtonAction(inputElement, addButton, addProject, addProjectContainer) {
        inputElement.addEventListener("input", () => {
            if(inputElement.value.trim() !== "") {
                addButton.disabled = false;
            } else {
                addButton.disabled = true;
            }
        });
    
        addButton.addEventListener("click", () => {
            if(addButton.disabled === false) {
                addProjectContainer.classList.toggle("open-close-new-project");
                addProject.style.display = "flex";
    
                addTheNewProject(addProject, inputElement);
                addTheNewPage(inputElement);
                inputElement.value = "";
            }
        });
    
        function addTheNewProject(addProject, inputElement) {
            const projectsContainer = document.getElementById("projects-container");
            const newDiv = document.createElement("div");
            newDiv.id = `${inputElement.value}-sidebar`;
            newDiv.classList.add("task-project");
            newDiv.classList.add("prj");
            numberOfProjects++;
    
            newDiv.innerHTML = `
                <div class="sidebar-left-task">
                    <img src="${projectIcon}" alt="today-icon">
                    <h4>${inputElement.value}</h4>
                </div>
                <p class = "count">0</p>
                <p class="options hide-options">...</p>
            `;
    
            projectsContainer.insertBefore(newDiv, addProject);
        }

        function addTheNewPage(inputElement) {
            const newPage = document.createElement("div");
            console.log(inputElement.value);
            newPage.id = `${inputElement.value}-page`;
            newPage.classList.add(`access-${inputElement.value}-page`);

            const styleSheet = document.styleSheets[0];

            styleSheet.insertRule(`#${inputElement.value}-page { width: 700px; max-width: 93vw; display: flex; flex-direction: column; justify-content: center; align-items: center; }`, styleSheet.cssRules.length);
            styleSheet.insertRule(`.access-${inputElement.value}-page { display: none !important; }`, styleSheet.cssRules.length);

            newPage.innerHTML = `
                <h2>${inputElement.value}</h2>
                <div class="pending-completed">
                    <div class="pending">
                        <p class="pc-number">0</p>
                        <p class="pc-text">Pending</p>
                    </div>
                    <div class="completed">
                        <p class="pc-number">0</p>
                        <p class="pc-text">Completed</p>
                    </div>
                </div>
                <div class="principal-tasks-container">
                    <div class="principal-task">
                        <div class="principal-task-left">
                            <div class="checkbox-container">
                                <input type="checkbox" id="${inputElement.value}-input1">
                                <label for="${inputElement.value}-input1"></label>
                            </div>                        
                            <p>Website Maintenance</p>
                        </div>
                        <p>Sat, 30 Nov</p>
                    </div>
                    <div class="principal-task">
                        <div class="principal-task-left">
                            <div class="checkbox-container">
                                <input type="checkbox" id="${inputElement.value}-input2">
                                <label for="${inputElement.value}-input2"></label>
                            </div>                        
                            <p>Code Review Session</p>
                        </div>
                        <p>Tue, 31 Dec</p>
                    </div>
                    <div class="principal-task">
                        <div class="principal-task-left">
                            <div class="checkbox-container">
                                <input type="checkbox" id="${inputElement.value}-input3">
                                <label for="${inputElement.value}-input3"></label>
                            </div>                        
                            <p>Product Launch Preparation</p>
                        </div>
                        <p>Mon, 18 Sept</p>
                    </div>
                    <div class="principal-task">
                        <div class="principal-task-left">
                            <div class="checkbox-container">
                                <input type="checkbox" id="${inputElement.value}-input4">
                                <label for="${inputElement.value}-input4"></label>
                            </div>                        
                            <p>Employee Feedback Collection</p>
                        </div>
                        <p>Thu, 27 Oct</p>
                    </div>
                </div>
                <button class="add-task-button"> + Add Task</button>
            `;

            const mainContainer = document.querySelector("main");
            mainContainer.appendChild(newPage);
            const newProjectSidebarId = `${inputElement.value}-sidebar`;
            const newProjectPageId = `${inputElement.value}-page`;
            const newProjectPageClass = `access-${inputElement.value}-page`;
            pagAccess.addRelationship(newProjectSidebarId, newProjectPageId, newProjectPageClass);
            pagAccess.configureSidebarAction(newProjectSidebarId, newProjectPageId, newProjectPageClass, true);


        }
    }

    function cancelButtonAction(inputElement, cancelButton, addProject, addProjectContainer) {
        cancelButton.addEventListener("click", () => {
            inputElement.value = "";
            addProjectContainer.classList.toggle("open-close-new-project");
            addProject.style.display = "flex";
        })
    }
}

