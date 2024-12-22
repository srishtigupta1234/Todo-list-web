//GET
//base url :- http://localhost:3000/api
//end point :- /todo
window.addEventListener("load",()=>{
    getData();
})
let getData = async() =>{
    let res = await fetch("http://localhost:3000/api/todo")
    let data = await res.json();
    console.log(data);
    renderDom(data)
    
}
let renderDom = (data)=>{
    let box = document.getElementById("box");
    box.innerHTML = null;
   data.forEach(({title,id,status}) => {
     let div = document.createElement('div');
     let h3 = document.createElement('h3');
     let p = document.createElement('p');
     let toggle = document.createElement("button");
     let update = document.createElement("button");
     let remove = document.createElement("button");

     h3.innerText = title;
     p.innerText = status;
     toggle.innerText = "Toggle";
     toggle.addEventListener("click",()=>{
        ToggleStatus(id)
     })
     update.innerText = "Update";
     update.addEventListener("click",()=>{
        UpdateItem(id);
     })
     remove.innerText = "Remove";
     remove.addEventListener("click",()=>{
        DeleteItem(id);
     })
     div.append(h3,p,toggle,update,remove)
     box.append(div)
   }); 
  
}
let UpdateItem = async(id)=>{
        let todo = await fetch(`http://localhost:3000/api/todo/${id}`);
        todo = await todo.json();

        let title = prompt("Update title:", todo.title) || todo.title;
        let data = { title, status: todo.status };

        let res = await fetch(`http://localhost:3000/api/todo/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });

        getData();
}
let ToggleStatus = async(id) =>{ //PATCH
   let todo = await fetch(`http://localhost:3000/api/todo/${id}`);
   todo = await todo.json();
   let data = {status :!todo.status};
   let res = await fetch(`http://localhost:3000/api/todo/${id}`,{
    method:"PATCH",
    body:JSON.stringify(data),
    headers:{
        "Content-type":"application/json",
    }
   })
   getData();
   res = await res.json();
   console.log(res);
}
let addTodo = async() => {
   let todo = document.getElementById('todo').value;
   let data = {
     title: todo,
     status:false,
     id: Date.now(),
   };
   let res =  await fetch ('http://localhost:3000/api/todo',{
    method:"POST",
    body: JSON.stringify(data),
    headers:{
      "Content-Type":"application/json",
    }
   })
   getData();
   res = await res.json();
   console.log(res)
}
let DeleteItem = async(id) =>{
   let res = await fetch(`http://localhost:3000/api/todo/${id}`,{
    method :"DELETE",
    headers:{
        "Content-Type":"application/json"
    }
   })
   getData();
 
}
let sortByTitle=async()=>{
   let res = await fetch(`http://localhost:3000/api/todo?_sort=title&_order=asc`)
   res = await res.json();
   renderDom(res)
}
// Function to display pagination buttons
let totalPages = 30; // Total number of pages (example)
let visibleButtons = 5; // Number of buttons to display at a time
let currentPage = 1; // Keep track of the current page

// Function to show pagination buttons
function showButtons() {
    let buttons_div = document.getElementById('buttons');
    buttons_div.innerHTML = null;

    // Determine the range of buttons to show
    let start = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
    let end = Math.min(totalPages, start + visibleButtons - 1);

    // Adjust start if at the end of the range
    start = Math.max(1, end - visibleButtons + 1);

    // Add "First" button
    if (currentPage > 1) {
        let firstBtn = document.createElement('button');
        firstBtn.innerText = "<< First";
        firstBtn.onclick = () => goToPage(1);
        buttons_div.append(firstBtn);
    }

    // Add page buttons
    for (let i = start; i <= end; i++) {
        let btn = document.createElement('button');
        btn.innerText = i;
        btn.setAttribute("id", `btn-${i}`);
        btn.className = i === currentPage ? "active" : ""; // Highlight the current page
        btn.onclick = () => goToPage(i);
        buttons_div.append(btn);
    }

    // Add "Last" button
    if (currentPage < totalPages) {
        let lastBtn = document.createElement('button');
        lastBtn.innerText = "Last >>";
        lastBtn.onclick = () => goToPage(totalPages);
        buttons_div.append(lastBtn);
    }
}

// Function to fetch and display data for the selected page
let goToPage = async (page) => {
    currentPage = page; // Update the current page
    try {
        // Fetch data for the selected page
        let res = await fetch(`http://localhost:3000/api/todo?_page=${page}&_limit=4`);
        let data = await res.json();

        // Render the fetched data
        renderDom(data);

        // Update the pagination buttons
        showButtons();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};


// Initialize Pagination
goToPage(1);
//CRUD :- Create(POST),Read(GET),Update(PUT & PATCH),Delete(REMOVE);
//PUT(Replace) :- it will remove entire existing data and put new data there
//PATCH(Modify):- it will change only particular data like status:- above i shown