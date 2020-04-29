// immediately invoked function (IFI) expression that returns an object
// that is an anonymous function wrapped in parenthesis
// Good for data privacy because it creates new scope


// BUDGET CONTROLLER
var budgetController = (function () {


})();



// UI CONTROLLER
var UIController = (function () {

 

})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {

        // 1. Get the field input data

        // 2. Add Item to budget controller

        // 3. Ass the item to UI

        // 4. Calculate the budger

        // 5. Display the budget on the UI

        console.log('bla')
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)

    document.addEventListener('keypress', function(event) {

        event.keyCode===13 || event.which === 13?ctrlAddItem():null;

        
    })

})(budgetController, UIController);





