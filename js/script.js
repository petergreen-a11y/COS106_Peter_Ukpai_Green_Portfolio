document.addEventListener("DOMContentLoaded", () => {
    setupMobileNavigation();
    setupAcademicPlanner();
    setupContactValidation();
});

function setupMobileNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

function setupAcademicPlanner() {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const taskCount = document.getElementById("taskCount");
    const taskMessage = document.getElementById("taskMessage");

    if (!taskForm || !taskInput || !taskList) return;

    // Array used to store the planner's tasks.
    let tasks = [];

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.className = `task-item${task.completed ? " completed" : ""}`;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-check";
            checkbox.checked = task.completed;
            checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                renderTasks();
            });

            const text = document.createElement("span");
            text.className = "task-text";
            text.textContent = task.text;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                tasks = tasks.filter(item => item.id !== task.id);
                renderTasks();
            });

            listItem.append(checkbox, text, deleteButton);
            taskList.appendChild(listItem);
        });

        const completedCount = tasks.filter(task => task.completed).length;
        taskCount.textContent = `${tasks.length}${completedCount ? ` • ${completedCount} done` : ""}`;
        emptyState.hidden = tasks.length !== 0;
    }

    taskForm.addEventListener("submit", event => {
        event.preventDefault();

        const text = taskInput.value.trim();

        if (!text) {
            taskMessage.textContent = "Please enter a task.";
            taskInput.focus();
            return;
        }

        tasks.push({
            id: Date.now(),
            text,
            completed: false
        });

        taskInput.value = "";
        taskMessage.textContent = "";
        renderTasks();
        taskInput.focus();
    });

    renderTasks();
}

function setupContactValidation() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const fields = {
        name: document.getElementById("name"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        message: document.getElementById("message")
    };

    const errors = {
        name: document.getElementById("nameError"),
        email: document.getElementById("emailError"),
        phone: document.getElementById("phoneError"),
        message: document.getElementById("messageError")
    };

    const success = document.getElementById("contactSuccess");

    function clearErrors() {
        Object.values(errors).forEach(error => {
            error.textContent = "";
        });
        success.textContent = "";
    }

    function validateForm() {
        clearErrors();
        let valid = true;

        if (!fields.name.value.trim()) {
            errors.name.textContent = "Name is required.";
            valid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fields.email.value.trim()) {
            errors.email.textContent = "Email address is required.";
            valid = false;
        } else if (!emailPattern.test(fields.email.value.trim())) {
            errors.email.textContent = "Enter a valid email address.";
            valid = false;
        }

        if (!fields.phone.value.trim()) {
            errors.phone.textContent = "Phone number is required.";
            valid = false;
        } else if (!/^\d+$/.test(fields.phone.value.trim())) {
            errors.phone.textContent = "Phone number must contain digits only.";
            valid = false;
        }

        if (!fields.message.value.trim()) {
            errors.message.textContent = "Message is required.";
            valid = false;
        }

        return valid;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (validateForm()) {
            success.textContent = "Message validated successfully. This demonstration form is ready for a backend/email service.";
            form.reset();
        }
    });

    Object.values(fields).forEach(field => {
        field.addEventListener("input", () => {
            clearErrors();
        });
    });
}
