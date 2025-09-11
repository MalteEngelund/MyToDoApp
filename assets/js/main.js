  // #region init (setup)
  // App state: either showing lists (listView) or items in one list (itemView)
  let appState = "listView";  
  let activeList = 0;          // index of the currently active list
  let currentData = null;      // holds all our saved data

  // Dummy data to use when nothing is in localStorage
  const dummyData = {
    lists: [
      { id: 1, name: "List 1", items: [
        { id: 1, name: "Item 1", completed: false },
        { id: 2, name: "Item 2", completed: true }
      ]},
      { id: 2, name: "List 2", items: [] }
    ]
  };

  // Main container where we draw everything
  const mainContent = document.getElementById("content");

  // Start app
  initApp();

  function initApp() {
    // Try reading from localStorage
    let stored = readData();
    if (!stored) {
      // If nothing stored, use dummy data
      currentData = dummyData;
      saveData(currentData);
    } else {
      currentData = stored;
    }
    // Setup event listeners for static buttons
    setupStatics();
  }

  function setupStatics() {
    const newButton = document.getElementById("newListButton");
    // One "new" button works for both adding lists or items
    newButton.addEventListener("click", newCallback);
    // Show the list view first
    listView();
  }
  
  // #endregion

  // #region callbacks
  // Called when a list is clicked (show, delete…)
  function listClickCallback(action, index) {
    activeList = index; // remember which list was clicked
    switch(action) {
      case "showList":
        listItemView(); // go into that list and show items
        break;
         case "editList":
          console.log("editList Called");
          editListView(index);
         break;
        /*
         case "deleteList":
        console.log("deleteList Called");
        
        currentData.lists.splice(index,1); // remove list
        saveData(currentData);             // update storage
        listView();q                        // redraw
        break; 
        */
       // built in confirm popup temporary
        case "deleteList":
        if (confirm("Are you sure you want to delete this list?")) {
        currentData.lists.splice(index,1);
        saveData(currentData);
        listView();
  }
  break;

    }
  }

  // Called when an item is clicked (delete for now)
  function itemClickCallback(action, index) {
    switch(action) {
      case "editItem":
      editItemView(index);
      break;
      case "deleteItem":
        // built in confirm popup temporary
        if (confirm("Are you sure you want to delete this item?")) {
        currentData.lists[activeList].items.splice(index,1); // remove item
        saveData(currentData);
        listItemView(); // redraw
        }
        break;
    }
  }

  // Called when the +New button is pressed
  function newCallback() {
    switch(appState) {
      case "listView": newListCreationView(); break; // add new list
      case "itemView": newItemCreationView(); break; // add new item
    }
  }
  // #endregion

  // #region views
  // Show all lists
  function listView() {
    appState = "listView";
    mainContent.innerHTML = ""; // clear screen

    const listOverview = document.createElement("h2");
    listOverview.innerText = "Lister:"
    mainContent.appendChild(listOverview);

    currentData.lists.forEach((list, idx) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h2 onclick="listClickCallback('showList',${idx})">${list.name}</h2>
        <button onclick="listClickCallback('editList',${idx})" class="buttonTest">Edit</button>
        <button onclick="listClickCallback('deleteList',${idx})">Delete</button>
      `;
      mainContent.appendChild(div);
    });
  }

  // Show all items inside the active list
  function listItemView() {
    appState = "itemView";
    mainContent.innerHTML = "";
    const list = currentData.lists[activeList];

    
    // List title
    const title = document.createElement("h2");
    title.innerText = list.name;
    mainContent.appendChild(title);

    // Show each item
    list.items.forEach((item, idx) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <span>${item.name}</span>
        <button onclick="itemClickCallback('editItem',${idx})">Edit</button>
        <button onclick="itemClickCallback('deleteItem',${idx})">Delete</button>
      `;
      mainContent.appendChild(div);
    });

    // Back button to go back to lists
    const back = document.createElement("button");
    back.textContent = "Back";
    back.onclick = listView;
    mainContent.appendChild(back);
  }

  // Screen to add a new list
  function newListCreationView() {
    mainContent.innerHTML = "";
    const input = document.createElement("input");
    input.placeholder = "List name";
    
    const ok = document.createElement("button");
    ok.textContent = "OK";
    ok.onclick = () => {
      // Push new list into data
      currentData.lists.push({ id: Date.now(), name: input.value, items: [] });
      saveData(currentData);
      listView();
    };
    
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.onclick = listView;
    
    mainContent.append(input, ok, cancel);
  }

  // Screen to add a new item
  function newItemCreationView() {
    mainContent.innerHTML = "";
    const input = document.createElement("input");
    input.placeholder = "Item name";
    
    const ok = document.createElement("button");
    ok.textContent = "OK";
    ok.onclick = () => {
      // Push new item into active list
      currentData.lists[activeList].items.push({
        id: Date.now(),
        name: input.value,
        // completed: false  // ikke lavet (optional)
      });
      saveData(currentData); 
      listItemView();
    };
    
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.onclick = listItemView;
    mainContent.append(input, ok, cancel);
  }

  // Edit list title
function editListView(index) {
  mainContent.innerHTML = "";
  const input = document.createElement("input");
  input.value = currentData.lists[index].name;

  const ok = document.createElement("button");
  ok.textContent = "Save";
  ok.onclick = () => {
    currentData.lists[index].name = input.value;
    saveData(currentData);
    listView();
  };

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.onclick = listView;

  mainContent.append(input, ok, cancel);
}

// Edit item title
function editItemView(index) {
  mainContent.innerHTML = "";
  const input = document.createElement("input");
  input.value = currentData.lists[activeList].items[index].name;

  const ok = document.createElement("button");
  ok.textContent = "Save";
  ok.onclick = () => {
    currentData.lists[activeList].items[index].name = input.value;
    saveData(currentData);
    listItemView();
  };

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.onclick = listItemView;

  mainContent.append(input, ok, cancel);
}

    function darkMode() {
      
    let element = document.body;
    element.classList.toggle("dark-mode");

    if (element.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    } else {
    localStorage.setItem("darkMode", "disabled");
  }
}


  // are you sure popup, jeg har brugt confirm som er en indbygget popup i browseren midlertidigt




  // #endregion

  // #region model (data persistence)
  function readData() {
    return JSON.parse(localStorage.getItem("ToDoListApp_v1"));
  }
  
  function saveData(data) {
    localStorage.setItem("ToDoListApp_v1", JSON.stringify(data));
  }


  // #endregion
