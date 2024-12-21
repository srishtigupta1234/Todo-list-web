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
//CRUD :- Create(POST),Read(GET),Update(PUT & PATCH),Delete(REMOVE);
//PUT(Replace) :- it will remove entire existing data and put new data there
//PATCH(Modify):- it will change only particular data like status:- above i shown