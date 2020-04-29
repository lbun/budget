// immediately invoked function (IFI) expression that returns an object
// that is an anonymous function wrapped in parenthesis
// Good for data privacy because it creates new scope


// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    };
    var Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) { 
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };

    // DATA STRUCTURW
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val) {
            var newItem;

            data.allItems[type].length>0
            ?ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            :ID=0

            // create a new item
            type==="exp"?newItem = new Expense(ID, des, val):newItem = new Income(ID, des, val)

            // pushed in the data structure
            data.allItems[type].push(newItem);

            //return the new Item
            return newItem;
        },

        deleteItem: function(type, id) {
            // id = 3
            // data.allItems[type][id]; - n ot working if we delete some element
            var ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            // we want the index if our id
            index = ids.indexOf(id);

            // delete the item with the id found
            if (index !== -1) {
                // start deleting items at index and in this case we remove 1 element
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function() {

            // calculate total income and expenses (private funcitons)
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income we have spent
            if (data.totals.inc > 0) {
            data.percentage = Math.round(data.totals.exp / data.totals.inc * 100)
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totaleExp: data.totals.exp,
                percentage: data.percentage
        }},


        testing: function() {
            console.log(data);
        }
    }

})();



// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

    }

    return {
        getInput: function() {

            return {
                type : document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                descripton : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            // Create html string with placeholder text
            var html;

            type==='inc'
            ?(html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>\
            <div class="right clearfix"><div class="item__value">%value%</div>\
            <div class="item__delete"><button class="item__delete--btn">\
            <i class="ion-ios-close-outline"></i</button></div></div></div>',
            element = DOMstrings.incomeContainer)
            :(html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>\
            <div class="right clearfix"><div class="item__value">%value%</div>\
            <div class="item__delete"><button class="item__delete--btn">\
            <i class="ion-ios-close-outline"></i></button></div></div></div>',
            element = DOMstrings.expensesContainer)

            //replace the placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value); 

            //insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        deleteListItem: function(selectorID) {
            // we can only remove a child element
            var el =  document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },
           

        clearFields: function() {
            var fields;
            // this return a list that we need to convert in an array
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            })
            fieldsArr[0].focus()
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totaleExp;
            

            obj.percentage>0
            ?document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage
            :document.querySelector(DOMstrings.percentageLabel).textContent = '---';

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event) {
    
            event.keyCode===13 || event.which === 13?ctrlAddItem():null;
        });

        document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem)
    }

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI 
        UICtrl.displayBudget(budget);
    }



    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the field input data
        var input = UIController.getInput();

        // 2. Add Item to budget controller
        if (input.descripton !== "" && !isNaN(input.value) && input.value>0)  {
            
            var newItem = budgetCtrl.addItem(input.type, input.descripton, input.value)

            // 3. Add the items to UI
            UICtrl.addListItem(newItem, input.type)

            // 4 Clear the fields
            UICtrl.clearFields()

            // 5. Calculate and Update Budget
            updateBudget();

        } else {null}   
    }

    var ctrDeleteItem = function(event) {
        var itemId, splitId, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            //inc-1
            splitId = itemId.split('-')
            type = splitId[0];
            ID = parseInt(splitId[1]);

            // 1. Delete item from the data srructure
            budgetCtrl.deleteItem(type, ID)

            //2. Delete item from UI
            UICtrl.deleteListItem(itemId);

            // 3. Update and show the new budget
            updateBudget();
        }

    };

    return {
        init: function() {
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totaleExp: 0,
                percentage: -1
            });
        }
    }

})(budgetController, UIController);

controller.init()




