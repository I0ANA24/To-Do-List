// import { handleAddTask } from "./tasks/addTask.js";
import { pagAccess } from "./sidebar.js";

export function switchPages(pageElement, pageClass, currentSidebarPage, currentSidebarPageRelationship) {
    pageElement?.classList.toggle(pageClass);
    currentSidebarPage?.classList.toggle(currentSidebarPageRelationship.getPageClass());
}

export function pageUpdate(oldSidebarFolderName, newPageId, newPageClass) {
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
                const rules = Array.from(sheet.cssRules || sheet.rules); // Cross-browser compatibility
                rules.forEach((rule, index) => {
                    if (rule.selectorText && rule.selectorText.includes(`.access-${oldSidebarFolderName}-page`)) {
                        // Create a new selector replacing .access-Project-page with .access-new-page
                        const newSelector = rule.selectorText.replace(`.access-${oldSidebarFolderName}-page`, `.${newPageClass}`);

                        // Add the new rule and delete the old one
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
                console.warn("Could not access stylesheet:", err);
            }
        });
    }    
}

export function addTheNewPage(inputElement) {
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

    const addTaskButton = newPage.querySelector(".add-task-button");
    // handleAddTask(addTaskButton, newProjectPageId);
}