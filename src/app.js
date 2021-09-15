const cards = document.getElementById("cards");
const footer = document.getElementById("footer");
const items = document.getElementById("items")

const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
;

const fragment = document.createDocumentFragment();
let carrito = {};

//comment


document.addEventListener("DOMContentLoaded", () => {
    
    fetchData();

    //recuperamos el carrito del local storage
    if (localStorage.getItem("carrito"))
    {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito();
    }

});

cards.addEventListener("click", e => {
    addCarrito(e);

});

items.addEventListener("click",  e=> {
    btnAccion(e);
});

const fetchData = async () => {
    try
    {
        const res = await fetch("./src/productos.json");
        const data = await res.json();
        pintarCards(data);
    }
    catch (error)
    {
        console.log("error de lectura JSON");
    }

}

const pintarCards = data => {
    //console.log(data);
    data.forEach( producto => {
        templateCard.querySelector("h5").textContent = producto.title;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src",producto.thumbnailUrl);
        templateCard.querySelector("img").setAttribute("alt",producto.title);
        templateCard.querySelector("button").dataset.id= producto.id;
       
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);

    });

    cards.appendChild(fragment);

}

const addCarrito = e => {
    e.stopPropagation();
    console.log(e.target);
    if (e.target.classList.contains("btn-dark"))
    {
        setCarrito(e.target.parentElement);
    }
    
}

const setCarrito = objeto => {
    
    console.log(objeto);
    const idProducto = objeto.querySelector("button").dataset.id;
    
    //si el producto ya está en el carrito incrementamos la cantidad
    if (carrito.hasOwnProperty(idProducto)){
        carrito[idProducto].cantidad ++;

    }else{ //si no está en el carrito creamos un nuevo objeto y añadimos
        const producto = {
            id: objeto.querySelector("button").dataset.id,
            title: objeto.querySelector("h5").textContent,
            precio: objeto.querySelector("p").textContent,
            cantidad : 1
        }
        //console.log(producto.id)
        carrito[producto.id] = producto;
    }
    
    pintarCarrito();

}

const pintarCarrito = () => {
    items.innerHTML="";
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.precio * producto.cantidad;

        const clone = templateCarrito.cloneNode(true); //true hace que se copien descendientes del nodo
        fragment.appendChild(clone);
    });
   // console.log(items);
    items.appendChild(fragment);
    pintarFooter();

    localStorage.setItem("carrito", JSON.stringify(carrito));


}

const pintarFooter = () => {
    footer.innerHTML="";
    if (Object.keys(carrito).length === 0 ) //carrito vacío
    {
        footer.innerHTML='<th scope="row" colspan="5">Carrito vacío. Comience a comprar!!</th>'
    }else
    {
        
        const nCantidad = Object.values(carrito).reduce( (acc, {cantidad} ) => acc + cantidad, 0);
        const nTotal = Object.values(carrito).reduce( (acc, {cantidad, precio} ) => acc + cantidad * precio, 0);
        
        templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
        templateFooter.querySelector("span").textContent = nTotal;
        
        const clone = templateFooter.cloneNode(true);
        fragment.appendChild(clone);
        footer.appendChild(fragment);

        document.getElementById("vaciar-carrito").addEventListener("click", () => {
            console.log("Carrito Vacío")
            carrito = {};
            pintarCarrito();
        });


    }

}

const btnAccion = ( e => {
    e.stopPropagation();
    if (e.target.classList.contains("btn-info")) //opción de aumentar objeto
    {
        carrito[e.target.dataset.id].cantidad++;
        pintarCarrito();
    
    }else if(e.target.classList.contains("btn-danger")) //si es el btn disminuir 
    {
        carrito[e.target.dataset.id].cantidad--;
        
        if (carrito[e.target.dataset.id].cantidad === 0)
        {
            delete carrito[e.target.dataset.id];
        } 
        pintarCarrito();
    }
    
})