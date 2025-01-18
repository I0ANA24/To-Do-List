import projectIcon  from "../assets/project.svg";
import { switchPages, pageUpdate, addTheNewPage } from "./pages.js";

export function handleSidebar() {
    openCloseSidebar();
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

        const overlay2 = document.getElementById("overlay2");
        if(overlay2.style.display === "block") {
            overlay2.style.display = "none"; 
        }

        const hideOptions = document.querySelectorAll(".options-container");
        hideOptions.forEach(optionsContainer => {
            optionsContainer.classList.add("hide-options-container");
        });

        const addProject = document.getElementById("add-project-button");
        const addProjectContainer = addProject.nextElementSibling;
        const inputElement = document.getElementById("new-project-input");

        addProjectContainer.classList.add("open-close-new-project");
        addProject.style.display = "flex";
        inputElement.value = "";

        const attp = document.querySelector(".att-p");
        const attp2 = document.querySelector(".att-p2");

        if (attp) {
            attp.remove();
        }

        if (attp2) {
            attp2.remove();
        }
    });


    overlay?.addEventListener("click", (event) => {
        if (!event.target.classList.contains("rename") && !event.target.classList.contains("delete")) {
            sidebarContainer?.classList.add("open-close-sidebar");
            overlay.style.display = "none";

            const addProject = document.getElementById("add-project-button");
            const addProjectContainer = addProject.nextElementSibling;
            const inputElement = document.getElementById("new-project-input");

            addProjectContainer.classList.add("open-close-new-project");
            addProject.style.display = "flex";
            inputElement.value = "";
        }
    });
}

export const pagAccess = (function pagesAccess() {
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
        new sidebarPageRelationship("Project-sidebar", "Project-page", "access-Project-page")
    ];

    const addRelationship = (sidebarId, pageId, pageClass) => {
        const relationship = new sidebarPageRelationship(sidebarId, pageId, pageClass);
        sidebarToPageMap.push(relationship);
    }

    let currentSidebarPageRelationship = sidebarToPageMap[0];
    let currentSidebarPage = document.getElementById(currentSidebarPageRelationship.getPageId());

    const configureSidebarAction = (sidebarId, pageId, pageClass, isNewProject, isFromDelete) => {
        let sidebarElement = document.getElementById(sidebarId);
        let pageElement = document.getElementById(`${pageId}`);

        if (!isFromDelete) {
            sidebarElement?.addEventListener("click", (event) => {
                if (sidebarId !== currentSidebarPageRelationship.getSidebarId()) {
                    if (!event.target.classList.contains("rename") && !event.target.classList.contains("delete")) {
                        if(!event.target.classList.contains("options")) {
                            switchPages(pageElement, pageClass, currentSidebarPage, currentSidebarPageRelationship);
                            updateCurrentSidebar();
                            closeSidebar();
                        } else {
                            addClickEventForOptions(event.target);
                        }
                    }
                } else {
                    if (!event.target.classList.contains("options")) {
                        if (!event.target.classList.contains("rename") && !event.target.classList.contains("delete")) {
                            closeSidebar();
                        }
                    } else if (event.target.classList.contains("options")) {
                        addClickEventForOptions(event.target);
                    }
                }
            });
        }

        function addClickEventForOptions(options) {
            options.style.display = "block";
            const countElement = options.previousElementSibling;
            countElement.style.display = "none";

            const optionsContainer = options.nextElementSibling;
            const overlay2 = document.getElementById("overlay2");
            const renameProjectContainer = document.querySelector(".rename-project-container");

            optionsContainer.classList.remove("hide-options-container");
            overlay2.style.display = "block";

            function cancelOrOverlay2() {
                optionsContainer.classList.add("hide-options-container");
                overlay2.style.display = "none";
                overlay2.style.backgroundColor = "transparent";
                options.style.removeProperty("display");
                countElement.style.removeProperty("display");
                renameProjectContainer.classList.add("hide-rename-project-container");
                deleteProjectContainer.classList.add("hide-delete-project-container");

                const attp = document.querySelector(".att-p");
                const attp2 = document.querySelector(".att-p2");

                if (attp) {
                    attp.remove();
                }

                if (attp2) {
                    attp2.remove();
                }

            }

            overlay2.addEventListener("click", () => {
               cancelOrOverlay2();
               renameInputButton.value = "";
            });

            const renameElement = optionsContainer.querySelector(".rename");
            const renameInputButtonsContainer = renameProjectContainer.querySelector(".rename-ib");
            const renameInputButton = renameInputButtonsContainer.querySelector("#new-project-input");
            const renameAddButton = renameInputButtonsContainer.querySelector("#add-button");
            const renameCancelButton = renameInputButtonsContainer.querySelector("#cancel-button");

            renameElement.addEventListener("click", renameElementClickEventFunction);

            function renameElementClickEventFunction() {
                renameProjectContainer.classList.remove("hide-rename-project-container");
                renameAddButton.disabled = true;
                renameInputButton.focus();
                optionsContainer.classList.add("hide-options-container");

                renameEvent(renameInputButtonsContainer, renameInputButton, renameAddButton);

                renameCancelButton.addEventListener("click", () => {
                    cancelOrOverlay2();
                    renameInputButton.value = "";
                });
            }

            function renameEvent(renameInputButtonsContainer, renameInputButton, renameAddButton) {
                renameElement.removeEventListener("click", renameElementClickEventFunction);
                inputVerification(renameInputButtonsContainer, renameInputButton, renameAddButton);

                renameAddButton.addEventListener("click", renameAddButtonClickEventFunction);

                function renameAddButtonClickEventFunction() {
                    let optionsParentId = options.parentElement?.id;
                    if(renameAddButton.disabled === false) {
                        const optionsParent = document.getElementById(`${optionsParentId}`);
                        if(renameInputButton.value !== "") {
                            optionsParentId = optionsParent.id;
                            handleRenameProject(optionsParent);
                            cancelOrOverlay2();
                            optionsParentId = optionsParent.id;
                        }
                    }

                    renameAddButton.removeEventListener("click", renameAddButtonClickEventFunction);
                }
            }

            function handleRenameProject(optionsParent) {
                const sidebarFolder = optionsParent;
                const sidebarFolderName = sidebarFolder.querySelector("h4");
                const oldSidebarFolderName = sidebarFolderName.textContent;
                const pageName = document.getElementById(`${oldSidebarFolderName}-page`).querySelector("h2");
                pageName.textContent = renameInputButton.value;
                const oldSidebarId = sidebarFolder.id;
                const newSidebarId = `${renameInputButton.value}-sidebar`;
                const newPageId = `${renameInputButton.value}-page`;
                const newPageClass = `access-${renameInputButton.value}-page`;

                sidebarFolderName.textContent = renameInputButton.value;
                sidebarFolder.id = newSidebarId;

                // Update the relationship in sidebarToPageMap
                const relationship = sidebarToPageMap.find(rel => rel.getSidebarId() === oldSidebarId);
                if (relationship) {
                    relationship.setRelationship(newSidebarId, newPageId, newPageClass);
                }

                sidebarId = newSidebarId;
                pageId = newPageId;
                pageClass = newPageClass;

                pageUpdate(oldSidebarFolderName, newPageId, newPageClass);

                sidebarElement = document.getElementById(`${sidebarId}`);
                pageElement = document.getElementById(`${pageId}`);
                
                renameInputButton.value = "";
            }

            const deleteElement = optionsContainer.querySelector(".delete");
            const deleteProjectContainer = document.querySelector(".delete-project-container");
            deleteElement.addEventListener("click", deleteElementClickEventFunction);

            function deleteElementClickEventFunction() {
                const optionsParent = options.parentElement;
                const optionsParentId = optionsParent.id;
                const pageId = `${optionsParentId.split('-')[0]}-page`;
                const page = document.getElementById(pageId);
                const sidebarId = `${optionsParentId}`;
                const sidebar = document.getElementById(sidebarId);

                deleteProjectContainer.classList.remove("hide-delete-project-container");
                overlay2.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                optionsContainer.classList.add("hide-options-container");
                deleteEvent(deleteProjectContainer, sidebarId);

                function deleteEvent(deleteProjectContainer, sidebarId) {
                    const deleteAddButton = deleteProjectContainer.querySelector("#add-button");
                    const deleteCancelButton = deleteProjectContainer.querySelector("#cancel-button");

                    deleteAddButton.addEventListener("click", deleteAddButtonClickEventFunction);

                    function deleteAddButtonClickEventFunction() {
                        if (currentSidebarPageRelationship.getSidebarId() === sidebarId) {
                            configureSidebarAction("today-sidebar", "today-page", "access-today-page", false, true);
                        }
                        
                        page.remove();
                        sidebar.remove();

                        const indexToRemove = sidebarToPageMap.findIndex(item => item.getSidebarId() === sidebarId);
                        if (indexToRemove !== -1) {
                            sidebarToPageMap.splice(indexToRemove, 1);
                        }

                        cancelOrOverlay2();
                    }

                    deleteCancelButton.addEventListener("click", () => {
                        deleteProjectContainer.classList.add("hide-delete-project-container");
                        cancelOrOverlay2();
                    });
                }

                
            }
        }

        if(isNewProject === true) {
            if (sidebarId !== currentSidebarPageRelationship.getSidebarId()) {
                switchPages(pageElement, pageClass, currentSidebarPage, currentSidebarPageRelationship);
                updateCurrentSidebar();
                closeSidebar();
            } else {
                closeSidebar();
            }
        }

        if(isFromDelete === true) {
            switchPages(pageElement, pageClass, currentSidebarPage, currentSidebarPageRelationship);
            updateCurrentSidebar();
            closeSidebar();
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

function inputVerification(projectContainer, inputElement, addButton) {
    function isOnlyLetters(inputValue) {
        const regex = /^[a-zA-Z]+$/;
        return regex.test(inputValue);
    }

    function existThisProject(projectName) {
        const projectSidebarElement = document.getElementById(`${projectName}-sidebar`);
        if(projectSidebarElement) {
            return true;
        }

        return false;
    }

    const attentionParagraph = document.createElement('p');
    attentionParagraph.textContent = "Please insert only letters!";
    attentionParagraph.style.width = "100%";
    attentionParagraph.style.textAlign = "center";
    attentionParagraph.style.color = "rgb(231, 84, 84)";
    attentionParagraph.classList.add("att-p");

    const attentionParagraph2 = document.createElement('p');
    attentionParagraph2.textContent = "This project already exists!";
    attentionParagraph2.style.width = "100%";
    attentionParagraph2.style.textAlign = "center";
    attentionParagraph2.style.color = "rgb(231, 84, 84)";
    attentionParagraph2.classList.add("att-p2");
    
    function removeChild() {
        const child = projectContainer.querySelector(".att-p");
        if (child) {
            projectContainer.removeChild(child);
        }
    }

    function removeChild2() {
        const child2 = projectContainer.querySelector(".att-p2");
        if (child2) {
            projectContainer.removeChild(child2);
        }
    }

    inputElement.addEventListener("input", () => {
        if(inputElement.value === "") {
            removeChild();
            removeChild2();
        } else if(inputElement.value.trim() !== "") {
            if (isOnlyLetters(inputElement.value) && !existThisProject(inputElement.value)) { // Both are correct
                addButton.disabled = false;
                removeChild();
                removeChild2();
            } else if (!isOnlyLetters(inputElement.value) && !projectContainer.querySelector(".att-p") && !existThisProject(inputElement.value)) { // Only the letters are wrong
                addButton.disabled = true;
                projectContainer.appendChild(attentionParagraph);
                removeChild2();
            } else if (existThisProject(inputElement.value) && !projectContainer.querySelector(".att-p2")) { // The project already exists
                addButton.disabled = true;
                projectContainer.appendChild(attentionParagraph2);
                removeChild();
            }
        }
    });
}

function handleAddProject() {
    const addProject = document.getElementById("add-project-button");
    const addProjectContainer = addProject.nextElementSibling;
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

    function addButtonAction(inputElement, addButton, addProject, addProjectContainer) {
        inputVerification(addProjectContainer, inputElement, addButton);
    
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
    
            newDiv.innerHTML = `
                <div class="sidebar-left-task">
                    <img src="${projectIcon}" alt="today-icon">
                    <h4>${inputElement.value}</h4>
                </div>
                <p class = "count">0</p>
                <p class="options hide-options">...</p>
                <div class="options-container hide-options-container">
                    <p class="rename">Rename</p>
                    <p class="delete">Delete</p>
                </div>
            `;
    
            projectsContainer.insertBefore(newDiv, addProject);
        }
    }

    function cancelButtonAction(inputElement, cancelButton, addProject, addProjectContainer) {
        cancelButton.addEventListener("click", () => {
            inputElement.value = "";
            addProjectContainer.classList.toggle("open-close-new-project");
            addProject.style.display = "flex";

            const attp = document.querySelector(".att-p");
            const attp2 = document.querySelector(".att-p2");

            if (attp) {
                attp.remove();
            }

            if (attp2) {
                attp2.remove();
            }
        });
    }
}

