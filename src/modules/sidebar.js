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

        const overlay2 = document.getElementById("overlay2");
        if(overlay2.style.display === "block") {
            overlay2.style.display = "none"; 
        }

        const hideOptions = document.querySelectorAll(".options-container");
        hideOptions.forEach(optionsContainer => {
            optionsContainer.classList.add("hide-options-container");
        });

    });


    overlay?.addEventListener("click", (event) => {
        if (!event.target.classList.contains("rename") && !event.target.classList.contains("delete")) {
            sidebarContainer?.classList.add("open-close-sidebar");
            overlay.style.display = "none";
        }
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
        new sidebarPageRelationship("Project-sidebar", "Project-page", "access-Project-page")
    ];

    const addRelationship = (sidebarId, pageId, pageClass) => {
        const relationship = new sidebarPageRelationship(sidebarId, pageId, pageClass);
        sidebarToPageMap.push(relationship);
    }

    let currentSidebarPageRelationship = sidebarToPageMap[0];
    let currentSidebarPage = document.getElementById(currentSidebarPageRelationship.getPageId());

    const configureSidebarAction = (sidebarId, pageId, pageClass, isNewProject) => {
        let sidebarElement = document.getElementById(sidebarId);
        let pageElement = document.getElementById(`${pageId}`);

        sidebarElement?.addEventListener("click", (event) => {
            if (sidebarId !== currentSidebarPageRelationship.getSidebarId()) {
                if (!event.target.classList.contains("rename") && !event.target.classList.contains("delete")) {
                    if(!event.target.classList.contains("options")) {
                        switchPages();
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
                    console.log(event.target.parentElement, "target");
                    addClickEventForOptions(event.target);
                }
            }
        });

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
                options.style.removeProperty("display");
                countElement.style.removeProperty("display");
                renameProjectContainer.classList.add("hide-rename-project-container");
            }

            overlay2.addEventListener("click", () => {
               cancelOrOverlay2();
               renameInputButton.value = "";
            });

            const renameElement = optionsContainer.querySelector(".rename");
            const renameInputButtonsContainer = renameProjectContainer.querySelector(".rename-ib");
            const renameInputButton = renameInputButtonsContainer.querySelector("#new-project-input");
            const renameAddButton = renameInputButtonsContainer.querySelector("#add-button");

            renameElement.addEventListener("click", renameElementClickEventFunction);

            function renameElementClickEventFunction() {
                renameProjectContainer.classList.remove("hide-rename-project-container");
                renameAddButton.disabled = true;
                renameInputButton.focus();
                optionsContainer.classList.add("hide-options-container");

                renameEvent(renameInputButtonsContainer, renameInputButton, renameAddButton);
            }

            function renameEvent(renameInputButtonsContainer, renameInputButton, renameAddButton) {
                renameElement.removeEventListener("click", renameElementClickEventFunction);
                inputVerification(renameInputButtonsContainer, renameInputButton, renameAddButton);

                renameAddButton.addEventListener("click", renameAddButtonClickEventFunction);

                function renameAddButtonClickEventFunction() {
                    let optionsParentId = options.parentElement?.id;
                    console.log(optionsParentId, options);
                    if(renameAddButton.disabled === false) {
                        console.log(options.parentElement);
                        const optionsParent = document.getElementById(`${optionsParentId}`);
                        if(renameInputButton.value !== "") {
                            optionsParentId = optionsParent.id;
                            console.log(optionsParentId);
                            console.log(optionsParent);
                            console.log(optionsParentId);
                            handleRenameProject(optionsParent);
                            cancelOrOverlay2();
                            console.log(optionsParent.id);
                            optionsParentId = optionsParent.id;
                            console.log(optionsParentId, optionsParent.id);
                        }
                    }

                    renameAddButton.removeEventListener("click", renameAddButtonClickEventFunction);
                }
            }

            function handleRenameProject(optionsParent) {
                console.log(optionsParent);
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
                // options = document.getElementById(`${newSidebarId}`).querySelector(".options");
                // console.log(options, newSidebarId, document.getElementById(`${newSidebarId}`));

                // Update the relationship in sidebarToPageMap
                const relationship = sidebarToPageMap.find(rel => rel.getSidebarId() === oldSidebarId);
                if (relationship) {
                    relationship.setRelationship(newSidebarId, newPageId, newPageClass);
                }

                sidebarId = newSidebarId;
                pageId = newPageId;
                pageClass = newPageClass;

                pageUpdate();

                function pageUpdate() {
                    const page = document.getElementById(`${oldSidebarFolderName}-page`);
                    page.id = newPageId;
                    
                    if(page.classList.contains(`access-${oldSidebarFolderName}-page`)) {
                        page.classList.remove(`access-${oldSidebarFolderName}-page`);
                        page.classList.add(newPageClass);
                    }

                    updateCSSRules();

                    function updateCSSRules() {
                        const styleSheets = Array.from(document.styleSheets);
    
                        styleSheets.forEach(sheet => {
                            try {
                                const rules = Array.from(sheet.cssRules || sheet.rules); // Compatibilitate între browsere
                                rules.forEach((rule, index) => {
                                    if (rule.selectorText && rule.selectorText.includes(`.access-${oldSidebarFolderName}-page`)) {
                                        // Creează un selector nou, înlocuind .access-Project-page cu .access-new-page
                                        const newSelector = rule.selectorText.replace(`.access-${oldSidebarFolderName}-page`, `.${newPageClass}`);
    
                                        // Adaugă noua regulă și șterge pe cea veche
                                        sheet.deleteRule(index);
                                        sheet.insertRule(`${newSelector} { ${rule.style.cssText} }`, index);
                                    }

                                    if(rule.selectorText && rule.selectorText.includes(`#${oldSidebarFolderName}-page`)) {
                                        const newSelector = rule.selectorText.replace(`#${oldSidebarFolderName}-page`, `#${newPageId}`);
                                        sheet.deleteRule(index);
                                        sheet.insertRule(`${newSelector} { ${rule.style.cssText} }`, index);
                                    }
                                });
                            } catch (err) {
                                console.warn("Nu s-a putut accesa stylesheet-ul:", err);
                            }
                        });
                    }    
                }

                sidebarElement = document.getElementById(sidebarId);
                pageElement = document.getElementById(`${pageId}`);
                
                renameInputButton.value = "";
            }
        }

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
            if (isOnlyLetters(inputElement.value) && !existThisProject(inputElement.value)) { //ambele sunt corecte
                addButton.disabled = false;
                removeChild();
                removeChild2();
            } else if (!isOnlyLetters(inputElement.value) && !projectContainer.querySelector(".att-p") && !existThisProject(inputElement.value)) { //doar literele sunt gresite
                addButton.disabled = true;
                projectContainer.appendChild(attentionParagraph);
                removeChild2();
            } else if (existThisProject(inputElement.value) && !projectContainer.querySelector(".att-p2")) { //proiectul exista deja
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
    
    // let numberOfProjects = 1;

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
            // numberOfProjects++;
    
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

        function addTheNewPage(inputElement) {
            const newPage = document.createElement("div");
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

