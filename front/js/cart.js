let cart = JSON.parse(localStorage.getItem('cart') || '[]');
for (product of cart) {
    fetchProduct(product)
}
let itemsContainer = document.getElementById('cart__items');
let inputQuantity = document.getElementsByClassName('itemQuantity');
let deleteBtn = document.getElementsByClassName('deleteItem');
let totalQuantitySpan = document.getElementById('totalQuantity');
let totalPriceSpan = document.getElementById('totalPrice');

// All inputs
let firstNameInput = document.getElementById('firstName');
let lastNameInput = document.getElementById('lastName');
let addressInput = document.getElementById('address');
let cityInput = document.getElementById('city');
let emailInput = document.getElementById('email');

const btnMakeOrder = document.getElementById('order');
btnMakeOrder.addEventListener('click', function (e) {
    e.preventDefault()
    postOrder()
});

function fetchProduct(product) {
    fetch("http://localhost:3000/api/products/" + product.id)
        .then(function (res) {
            if (res.ok) {
                return res.json()
            }
        })
        .then(function (api) {
            // Populate article(s)
            let element = `<article class="cart__item" data-id="${api._id}" data-color="${product.color}">
            <div class="cart__item__img">
              <img src=${api.imageUrl} alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${api.name}</h2>
                <p>${product.color}</p>
                <p>${api.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
            itemsContainer.innerHTML += element;
        })
        .then(function () {
            for (let i = 0; i < inputQuantity.length; i++) {
                inputQuantity[i].addEventListener('change', function (e) {
                    modifyQuantity(this, e)
                })
                deleteBtn[i].addEventListener('click', function (e) {
                    deleteProduct(this, e)
                })
            }
        })
        .then(function () {
            totalQuantity()
            totalPrice()
        })
}

function modifyQuantity(element, event) {
    let article = element.closest('article');
    let newQuantity = event.target.valueAsNumber;
    let productID = article.dataset.id;
    let productColor = article.dataset.color;

    for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === productID && cart[j].color === productColor) {
            cart[j].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    }
    totalQuantity()
    totalPrice()
}

function deleteProduct(element, event) {
    let article = element.closest('article');
    let productID = article.dataset.id;
    let productColor = article.dataset.color;
    let filtered = cart.filter((item) => item.id !== productID || item.color !== productColor);
    localStorage.setItem('cart', JSON.stringify(filtered));
    cart = JSON.parse(localStorage.getItem('cart') || '[]')
    totalQuantity()
    totalPrice()
    article.remove()
}

function totalQuantity() {
    let totalQuantity = 0
    for (product of cart) {
        totalQuantity += product.quantity
    }
    totalQuantitySpan.textContent = totalQuantity.toString()
}

function totalPrice() {
    let totalAmount = 0
    if (cart.length >= 0){
        totalPriceSpan.textContent = 0
    }
    for (product of cart) {
        let quantity = product.quantity
        fetch("http://localhost:3000/api/products/" + product.id)
            .then(function (res) {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(function (api) {
                totalAmount += api.price * quantity
                totalPriceSpan.textContent = totalAmount.toString()
            })
    }
}

function validFirstName(firstNameInput) {
    let error = document.getElementById('firstNameErrorMsg')
    if (firstNameInput.value === '') {
        error.textContent = 'Veuillez renseigner le champ Prénom svp'
        return false
    } else {
        error.textContent = ''
        return true
    }
}

function validLastName(lastNameInput) {
    let error = document.getElementById('lastNameErrorMsg');
    if (lastNameInput.value === '') {
        error.textContent = 'Veuillez renseigner le champ Nom svp';
        return false;
    } else {
        error.textContent = ''
        return true;
    }
}

function validAddress(addressInput) {
    let error = document.getElementById('addressErrorMsg')
    if (addressInput.value === '') {
        error.textContent = 'Veuillez renseigner le champ adresse svp'
        return false;
    } else {
        error.textContent = ''
        return true;
    }
}

function validCity(cityInput) {
    let error = document.getElementById('cityErrorMsg')
    if (cityInput.value === "") {
        error.textContent = 'Veuillez renseigner le champ Ville svp'
        return false
    } else {
        error.textContent = ''
        return true
    }
}

function validEmail(emailInput) {
    let error = document.getElementById('emailErrorMsg')
    var validRegex = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    // Check if string@string.string
    if (emailInput.value.match(validRegex)) {
        error.textContent = ''
        return true
    } else {
        error.textContent = 'Le champ est email est incorrect'
        return false
    }
}

async function postOrder() {

    if (cart.length === 0) return alert('Votre panier est vide');

    // Check all inputs
    if (validFirstName(firstNameInput) === true &&
        validLastName(lastNameInput) === true &&
        validAddress(addressInput) === true &&
        validCity(cityInput) === true &&
        validEmail(emailInput) === true) {

        // Tranform array of object into array of string id
        let products = cart.map(item => item.id); 

        let response = await fetch('http://localhost:3000/api/products/order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                contact: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    email: document.getElementById('email').value
                },
                products: products
            })
        });

        let result = await response.json();

        localStorage.clear();

        window.location.href = 'confirmation.html?id=' + result.orderId;
    } else {
        return alert('Vérifiez les champs du formulaire')
    }
}
