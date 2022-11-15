// 1 : Récupérer les infos du panier - OK
// 2 : Créer une fonction qui affiche les élements du panier à chaque tour de boucle - OK
// 3 : Récupérer tous les infos de l'API - OK
// 4 : Mise en place de la suppresion d'un produit - OK 
// 5 : Mise en place de la modification de quantité - OK

// 6 : Validation du formulaire
// 7 : Envoi sur la route en "POST" OK mais pas les bonnes data du formulaire
// 8 : Passage sur la page confirmation.html 


/*

Deleteproduct
ModifyQty
CalculTotal
CalculQty

X fonction pour chaque input du formulaire
 
OrderPost
*/
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
for (product of cart) {
    fetchProduct(product)
}
let itemsContainer = document.getElementById('cart__items');
let inputQuantity = document.getElementsByClassName('itemQuantity');
let deleteBtn = document.getElementsByClassName('deleteItem');
let totalQuantitySpan = document.getElementById('totalQuantity')
let totalPriceSpan = document.getElementById('totalPrice');


const btnMakeOrder = document.getElementById('order');
btnMakeOrder.addEventListener('click', function () {
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
                    modifQuantity(this, e)
                })
            }
        })
        .then(function () {
            for (let i = 0; i < deleteBtn.length; i++) {
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

function modifQuantity(element, event) {
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
    article.remove()
    totalQuantity()
    totalPrice()
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
                totalPriceSpan.textContent = totalAmount
            })

    }
}

function validFirstName() {
    let isValid = false
    let firstNameInput = document.getElementById('firstName')
    let error = document.getElementById('firstNameErrorMsg')
    firstNameInput.addEventListener('input', function (e) {
        var value = e.target.value;
        if (value === '') {
            error.textContent = 'Veuillez renseigner le champ Prénom svp'
            isValid === false
        } else {
            error.textContent = ''
            isValid === true
        }
    })
    return isValid
}
validFirstName()

function validLastName() {
    let lastNameInput = document.getElementById('lastName')
    let error = document.getElementById('lastNameErrorMsg')
    lastNameInput.addEventListener('input', function (e) {
        var value = e.target.value;
        if (value === '') {
            error.textContent = 'Veuillez renseigner le champ Nom svp'
            return false
        } else {
            error.textContent = ''
            return true
        }
    })
    
}
validLastName()

function validAddress() {
    let addressInput = document.getElementById('address')
    let error = document.getElementById('addressErrorMsg')
    addressInput.addEventListener('input', function (e) {
        var value = e.target.value;
        if (value === '') {
            error.textContent = 'Veuillez renseigner le champ adresse svp'
            return false
        } else {
            error.textContent = ''
            return true
        }
    })
}
validAddress()

function validCity() {
    let addressInput = document.getElementById('city')
    let error = document.getElementById('cityErrorMsg')
    addressInput.addEventListener('input', function (e) {
        var value = e.target.value;
        if (value === "") {
            error.textContent = 'Veuillez renseigner le champ Ville svp'
            return false
        } else {
            error.textContent = ''
            return true
        }
    })
}
validCity()


function validEmail() {
    let addressInput = document.getElementById('email')
    let error = document.getElementById('emailErrorMsg')
    var validRegex = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    addressInput.addEventListener('input', function (e) {
        var value = e.target.value;
        if (value.match(validRegex)) {
            error.textContent = ''
            return true
        } else {
            error.textContent = 'Le champ est email est incorrect'
            return false
        }
    })
}
validEmail()

async function postOrder() {


    // if (validFirstName === true && validLastName === true && validAddress === true && validCity === true && validEmail === true) {

        let products = cart.map(item => item.id);
        console.log(products)

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

    // } else {
    //   return alert('Veuillez vérifiez les champs du formulaire')
    // }
}
