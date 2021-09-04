class UI {
  constructor() {
    //we accessing all predifined elements from html so that every new instance will have access to them
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    //title of your expense
    this.expenseInput = document.getElementById("expense-input");
    //amount of your expense
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  //submit budget method
  submitBudgetForm() {
    //get the input value
    const value = this.budgetInput.value;
    //checks if value is empty or ess than 0 then displays feedback by adding display:block;
    if (value === "" || value <= 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `<p>You cannot input empty or negative value</p>`;
      setTimeout(() => {
        //hide error feedback
        this.budgetFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      //display valid input in budget amount, clear input, and show balance
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this.showBalance();
    }
  }
  //show blanace
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      console.log("negative");
      //change the color of $ sign before balance amount
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    } else if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }
  //total expense
  totalExpense() {
    let total = 0;
    //calculate total expense and balance only if there is an expense
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((accumulator, currentValue) => {
        console.log(`acc ${accumulator} and curr ${currentValue.amount}`);
        //iterate through amount objects value
        accumulator += currentValue.amount;
        return accumulator;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }
  //edit listed expense
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    //access the parent element surrounding both expense title and amount to edit both. do it by hopping up the parent elements
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM
    this.expenseList.removeChild(parent);
    //find and return the expense item that has same id with the item that has its edit icon clicked so that we can remove from list. filter returns new array
    let expense = this.itemList.filter(function (item) {
      return item.id === id;
    });
    //show clicked item
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    //remove from list. return rest of items that don't have this id so that they will be new in itemlist
    let temporaryList = this.itemList.filter(function (item) {
      return item.id !== id;
    });
    //new list of expense items
    this.itemList = temporaryList;
    //show updated balance
    this.showBalance();
  }
  //delete listed expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM
    this.expenseList.removeChild(parent);
    let temporaryList = this.itemList.filter(function (item) {
      return item.id !== id;
    });
    //new list of expense items
    this.itemList = temporaryList;
    //show updated balance
    this.showBalance();
  }
  submitExpenseForm() {
    //title of your expense
    const expenseValue = this.expenseInput.value;
    //amount of your expense
    const amountValue = this.amountInput.value;
    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML =
        "<p>values cannot be empty or neagative</p>";
      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      let amount = parseInt(amountValue);
      //access constructor and clear exp value and amount once everthing works correct
      this.expenseInput.value = "";
      this.amountInput.value = "";
      //save exp value and amount in an object
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount,
      };
      this.itemID++;
      this.itemList.push(expense);
      //display expense
      this.addExpense(expense);
      //show balance
      this.showBalance();
    }
  }
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

      <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
      <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

      <div class="expense-icons list-item">

        <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
        </a>
        <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fas fa-trash"></i>
        </a>
      </div>
    </div>
    `;
    //append the created expense title and value to expenselist
    this.expenseList.appendChild(div);
  }
}

//runs once DOM finishes loading
function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  //new instance of UI class
  const ui = new UI();

  //eventListeners function will be listening to 3 events that happen in budget form, expense form, and expense list areas where user makes chnages
  // budget form submit
  budgetForm.addEventListener("submit", function (event) {
    //we are accessing event form listeners to prevent forms automatic default submision
    event.preventDefault();
    //call this function because ui instance inherited it from parent class UI
    ui.submitBudgetForm();
  });

  //expense form submit
  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    ui.submitExpenseForm();
  });

  //expense click. listens to events when user clicks to edit or delete expenses from expense list
  expenseList.addEventListener("click", function (event) {
    //check if clicked icon is either edit-icon or delete-icon by accessing its parent element's classes and run respective methods.
    if (event.target.parentElement.classList.contains("edit-icon")) {
      console.log(event.target.parentElement.classList.contains("edit-icon"));
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  eventListeners();
});
