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

    // DATA STRUCTURW
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: function() {

            return {
                type : document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                descripton : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function (obj, type) {
            // Create html string with placeholder text
            var html;

            type==='inc'
            ?(html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>\
            <div class="right clearfix"><div class="item__value">%value%</div>\
            <div class="item__delete"><button class="item__delete--btn">\
            <i class="ion-ios-close-outline"></i</button></div></div></div>',
            element = DOMstrings.incomeContainer)
            :(html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>\
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
        })
    }

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the field input data
        var input = UIController.getInput();

        // 2. Add Item to budget controller
        var newItem = budgetCtrl.addItem(input.type, input.descripton, input.value);

        // 3. Add the items to UI
        UICtrl.addListItem(newItem, input.type)

        // 4. Calculate the budger

        // 5. Display the budget on the UI

    }

    return {
        init: function() {
            setupEventListeners()
        }
    }

})(budgetController, UIController);

controller.init()




