let url = new URL(window.location.href);
let search_params = new URLSearchParams(url.search);
let productId = search_params.get('id');
let btnAddToCart = document.getElementById('addToCart');

fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
        if (res.ok) {
            return res.json()
        }
    })
    .then(function (product) {
        displayProduct(product)
    })
    .catch((error) => {
        console.log(error)
    })

function displayProduct(product) {

    document.title = product.name;

    let img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    document.querySelector(".item__img").appendChild(img);

    let title = document.getElementById('title');
    title.textContent = product.name;

    let price = document.getElementById('price');
    price.textContent = product.price.toString();

    let description = document.getElementById('description');
    description.textContent = product.description;

    let colors = document.getElementById('colors');
    for (let color of product.colors) {
        let option = document.createElement('option');
        option.value = color.toString();
        option.innerHTML = color.toString();
        colors.appendChild(option);
    };

    btnAddToCart.addEventListener('click', function () {

        let color = document.getElementById('colors').value;
        let quantity = document.getElementById('quantity').value;
        let quantityValue = parseInt(quantity);
        let cart = localStorage.getItem('cart');
        let newItem = true;

        if (color == '') return alert('Selectionnez une couleur svp');
        if (quantity == 0 || quantity > 100) return alert('Selectionnez une quantité comprise entre 1 et 100 maximum');

        let articleInCart = {
            name: product.name,
            id: product._id,
            color: color,
            quantity: quantityValue
        }
      
        if (cart === null) {
            cart = [];
        } else {
            cart = JSON.parse(cart)
        }

        for (let product of cart) {
            if (articleInCart.id === product.id && articleInCart.color === product.color) {
                product.quantity += quantityValue
                newItem = false;
            }
        }

        if (newItem === true) {
            cart.push(articleInCart)
        }
        localStorage.setItem('cart', JSON.stringify(cart))
    });
}



