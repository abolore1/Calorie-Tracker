//Storage Controller

// Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure | State
  const data = {
    items: [
      // { id: 0, name: "Steak Meat", calories: 1200 },
      // { id: 1, name: "Cookies", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  //Public function
  return {
    getItems: function () {
      return data.items;
    },

    addItem: function (name, calories) {
      let ID;
      // Create Id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Calories to number
      calories = parseInt(calories);

      //Create new item
      newItem = new Item(ID, name, calories);

      //Add to items array
      data.items.push(newItem);

      return newItem;
    },

    
    getTotalCalories:function(){
        let total = 0;

        //loop through items and add to calories
        data.items.forEach(item=>{
          total += item.calories;
        });

        //Set total calories in the data structure
        data.totalCalories = total

        // Return total
        return data.totalCalories
    },
    logData: function () {
      return data;
    }
  }
})();

//UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList:"#item-list",
    addBtn:".add-btn",
    itemNameInput:"#item-name",
    itemCaloriesInput:"#item-calories",
    totalCalories:".total-calories",
  };

  //Public function
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${items.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a> 
              </li>`;
      });

      //Insert into the DOM
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    // Add list item
    addListItem: function (item) {
       //Show the list
       document.querySelector(UISelectors.itemList).style.display = 'block'

        //Create li element
        const li = document.createElement('li');
        //Add class 
        li.className  = 'collection-item';
          //Add Id
        li.id = `item-${item.id}`;
        //Add HTML
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a> `;
        //Insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    //Clear input field
    clearInputField:function(){
        document.querySelector(UISelectors.itemNameInput).value = ''
        document.querySelector(UISelectors.itemCaloriesInput).value = ''
    },

    hideList:function(){
        document.querySelector(UISelectors.itemList).style.display = 'none'
    },

    showTotalCalories:function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },

    getSelectors: function () {
      return UISelectors;
    },
  }
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {
  //load events listener
  const loadEventsListener = function () {
    //Get UI selector
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // show in the UL
      UICtrl.showTotalCalories(totalCalories);

      // Clear input field
      UICtrl.clearInputField();

    }
    
    e.preventDefault(); 
  };

  //Public function
  return {
    init: function () {
      //Fetching data from data structure
      const items = ItemCtrl.getItems();

      //check if any item
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        //Populate list with items
        UICtrl.populateItemList(items);
      }

      //Load event listener
      loadEventsListener();
    },
  };
})(ItemCtrl, UICtrl);

// Initializing App
App.init();
