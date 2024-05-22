let checkBoxList = [];
let inputFields = [];
const errorLabel = document.querySelector(".error-label");
const progressLabel = document.querySelector(".progress-label");
const progressBar = document.querySelector(".progress-bar");
const progressValue = document.querySelector(".progress-value");
const appContainer = document.getElementById("appContainer");
let allGoals = {}; // Initialize allGoals variable
let goalIdCounter = 0; // Counter to ensure unique IDs for goals

function addGoalInput() {
  const newGoalContainer = document.createElement("div");
  newGoalContainer.className = "goal-container";

  const customCheckbox = document.createElement("div");
  customCheckbox.className = "custom-checkbox";
  customCheckbox.innerHTML =
    '<img class="check-icon" src="./images/check-icon.svg" alt="check-icon" />';
  newGoalContainer.appendChild(customCheckbox);

  const newInput = document.createElement("input");
  newInput.className = "goal-input";
  newInput.type = "text";
  newInput.placeholder = "Add new goal... ";
  newInput.id = `goal-${goalIdCounter++}`; // Assign a unique ID
  newGoalContainer.appendChild(newInput);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<img src="../images/trash.png" alt="Delete" class='delete-icon'>`;
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", () => {
    deleteGoal(newInput.id); // Delete goal by ID
    newGoalContainer.remove();
    updateFields();
    updateProgressBar();
  });
  newGoalContainer.appendChild(deleteButton);

  appContainer
    .querySelector(".goal-list-container")
    .appendChild(newGoalContainer);

  updateFields();
  addInputEventListeners(newInput); // Add event listeners to the new input
}

function updateFields() {
  inputFields = document.querySelectorAll(".goal-input");
  checkBoxList = document.querySelectorAll(".custom-checkbox");
  updateProgressBar();
}

function updateProgressBar() {
  const completedGoalsCount = [...inputFields].filter(
    (input) => input.value.trim() !== "" && allGoals[input.id]?.completed
  ).length;
  progressValue.style.width = `${
    inputFields.length === 0
      ? 0
      : (completedGoalsCount / inputFields.length) * 100
  }%`;
  progressValue.firstElementChild.innerText = `${completedGoalsCount}/${inputFields.length} Completed`;
  progressLabel.innerText = `Goals: ${completedGoalsCount}/${inputFields.length}`;
}

function addInputEventListeners(input) {
  input.addEventListener("focus", () => {
    progressBar.classList.remove("show-error");
  });

  input.addEventListener("input", (e) => {
    const inputId = input.id;
    allGoals[inputId] = {
      name: input.value.trim(),
      completed: allGoals[inputId]?.completed || false,
    };
    updateLocalStorage();
    updateProgressBar();
  });
}

appContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("custom-checkbox")) {
    const checkboxContainer = event.target;
    const inputId = checkboxContainer.nextElementSibling.id;
    const allGoalsAdded = [...inputFields].every(
      (input) => input.value.trim() !== ""
    );
    if (allGoalsAdded) {
      checkboxContainer.parentElement.classList.toggle("completed");
      handleGoalCompletion(inputId);
      updateProgressBar();
    } else {
      progressBar.classList.add("show-error");
    }
  }
});

function updateLocalStorage() {
  localStorage.setItem("allGoals", JSON.stringify(allGoals));
}

function handleGoalCompletion(inputId) {
  allGoals[inputId].completed = !allGoals[inputId].completed;
  updateProgressBar();
  updateLocalStorage();
}

function deleteGoal(inputId) {
  delete allGoals[inputId];
  updateLocalStorage();
  updateProgressBar();
}

const addGoalBtn = document.getElementById("addGoalBtn");
addGoalBtn.addEventListener("click", addGoalInput);

const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

inputFields.forEach((input) => {
  addInputEventListeners(input);
});

updateProgressBar();
