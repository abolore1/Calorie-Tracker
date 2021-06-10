//Storage Controller
const StorageCtrl = (function(){
    // public function
    return {
      storageItem:function(item){
        let items;

        // Check is storage is empty
        if(localStorage.getItem('items') === null){
           items = [];

           // Push new item
           items.push(item)

           // Set ls
           localStorage.setItem('items', JSON.stringify(items))
        } else {
          items = JSON.parse(localStorage.getItem('items'));

          // Push new item
          items.push(item)

          // Reset ls
          
           // Set ls
           localStorage.setItem('items', JSON.stringify(items));
        }   
      },

      getItemsFromStorage:()=>{
        let items;
        if(localStorage.getItem('items')===null){
          items = []
        } else {
          items = JSON.parse(localStorage.getItem('items'))
        }
        return items
      },

      updateItemStorage: function(updatedItem){
       let items = JSON.parse(localStorage.getItem('items'))
       
       items.forEach(function(item, index){
         if(updatedItem.id === item.id){
           items.splice(index, 1, updatedItem)
         } 
       });
       localStorage.setItem('items', JSON.stringify(items))
      },

      deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'))

        items.forEach(function(item, index){
          if(id === item.id){
            items.splice(index, 1);
          }
        });
        localStorage.setItem('items', JSON.stringify(items))
      },
      clearItemFromStorage: function(){
        localStorage.removeItem('items');
      }

    }
})()  ;

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
   // items: [
      // { id: 0, name: "Steak Meat", calories: 1200 },
      // { id: 1, name: "Cookies", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 },
   // ],
    items:StorageCtrl.getItemsFromStorage(),
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

    getItemById:function(id){
      let found = null;
      //Loop through items
      data.items.forEach(item=>{
        if(item.id === id){
          found = item;
        }
      });
      return found
    }, 

    updateItem:function(name,calories){
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(item=>{
        if(item.id === data.currentItem.id){
          item.name = name
          item.calories = calories
          found = item
        }
      });
      return found;
    },

    deleteItem:id=>{

      const ids = data.items.map(item =>{
        return item.id
      });

      const index = ids.indexOf(id)
     data.items.splice(index,1)

    },

    clearAllItems:function(){
      data.items = []

    },
    
    setCurrentItem:function(item){
       data.currentItem = item;
    },
    
    getCurrentItem:function(){
      return data.currentItem
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
    listItems:"#item-list li",
    addBtn:".add-btn",
    updateBtn:".update-btn",
    deleteBtn:".delete-btn",
    clearBtn:".clear-btn",
    backBtn:".back-btn",
    itemNameInput:"#item-name",
    itemCaloriesInput:"#item-calories",
    totalCalories:".total-calories",
  };

  //Public function
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(item => {
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
        </a>`;
        //Insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },


    updateListItem: item =>{
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(listItem =>{
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`
        }
      });
    },

    deleteListItem:id=>{
      const itemId = `#item-${id}`
      const item = document.querySelector(itemId);
      item.remove();
    },



    //Clear input field
    clearInputField:function(){
        document.querySelector(UISelectors.itemNameInput).value = ''
        document.querySelector(UISelectors.itemCaloriesInput).value = ''
    },

    addItemToForm:function(){      
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems:function(){
      let listItems = document.querySelectorAll(UISelectors.listItems)
      listItems = Array.from(listItems)

      listItems.forEach(item =>{
        item.remove()
      })

    },

    hideList:function(){
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },

    showTotalCalories:function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },

    clearEditState:()=>{
      UICtrl.clearInputField();
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
    },

    showEditState:()=>{
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },

    getSelectors:()=> {
      return UISelectors;
    },
  }
})();

//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //load events listener
  const loadEventsListener = function () {
    //Get UI selector
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

    //Disable submit on enter
    document.addEventListener('keypress',function(e){
        if(e.keyCode ===13 || e.which === 13){
          e.preventDefault()
          return false
        }
    })

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

    //Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

    //Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDelete);

      //Delete item event
      document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemClick);


    //Update item event
    document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);
    
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

      // Store in localStorage
      StorageCtrl.storageItem(newItem)

      // Clear input fields
      UICtrl.clearInputField();
    }
    
    e.preventDefault(); 
  };

    //Click edit item
    const itemEditClick= function(e){
      if(e.target.classList.contains('edit-item')){
        //Get list-item id
        const listId = e.target.parentNode.parentNode.id;
  
        // Break into array
        const listIdArr = listId.split('-')
       
        //Get the actual id
        const id = parseInt(listIdArr[1]);
  
        //Get item to edit
        const itemToEdit = ItemCtrl.getItemById(id);
        ItemCtrl.setCurrentItem(itemToEdit);
  
        //Add item to form
        UICtrl.addItemToForm();
      }
      e.preventDefault()
    }

  //Update item submit
  const itemUpdateSubmit = function(e){
    //Get item input
   const input = UICtrl.getItemInput();

   //Update item
   const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      //Update UI 
      UICtrl.updateListItem(updatedItem)
   

   //Get total calories
   const totalCalories = ItemCtrl.getTotalCalories();

   // Add total calories in the UL
   UICtrl.showTotalCalories(totalCalories);

   // Update local storage
   StorageCtrl.updateItemStorage(updatedItem);

   // Clear edit 
   UICtrl.clearEditState();

    e.preventDefault();
  }


  
  //Delete button event
 const itemDelete = e =>{
  //Get current item
  const currentItem = ItemCtrl.getCurrentItem();

  //Delete from data structure
  ItemCtrl.deleteItem(currentItem.id);

  //Delete from UI
  UICtrl.deleteListItem(currentItem.id);

  //Get total calories
  const totalCalories = ItemCtrl.getTotalCalories();

  // show in the UL
  UICtrl.showTotalCalories(totalCalories);

  // Delete from local storage
  StorageCtrl.deleteItemFromStorage(currentItem.id);

  UICtrl.clearEditState();

   e.preventDefault()
}

const clearAllItemClick = function(){
  // Delete all items from data structure
  ItemCtrl.clearAllItems()

   //Get total calories
   const totalCalories = ItemCtrl.getTotalCalories();

   // Add total calories to UI
   UICtrl.showTotalCalories(totalCalories);

  // Remove from UI
  UICtrl.removeItems();

  StorageCtrl.clearItemFromStorage();

  // hide the list
  UICtrl.hideList();

}

  //Public function
  return {
    init: function () {

      // Clear edit state
      UICtrl.clearEditState();

      //Fetching data from data structure
      const items = ItemCtrl.getItems();

      //check if any item
      if(items.length === 0){
        UICtrl.hideList();
      }else{
        //Populate list with items
        UICtrl.populateItemList(items);
      }
      // when the app init
       // Get total calories
       const totalCalories = ItemCtrl.getTotalCalories();

       // show in the UL
       UICtrl.showTotalCalories(totalCalories);

      //Load event listener
      loadEventsListener();
    },
  };
})(ItemCtrl,StorageCtrl, UICtrl);

// Initializing App
App.init()
