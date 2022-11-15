let itemsContainer = document.getElementById('items');

function getProducts(){
    fetch("http://localhost:3000/api/products")
    .then(function(res){
      if(res.ok){
        return res.json()
      }
    })
    .then(function(products){
        for(let product of products){
           insertProduct(product)
        }
    })
}

getProducts();

function insertProduct(product){

    let anchor = document.createElement('a');
    anchor.href = "./product.html?id=" + product._id;

    let article = document.createElement('article');
    let img = document.createElement('img');
    let h3 = document.createElement('h3');
    let p = document.createElement('p');
    
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    h3.textContent = product.name;
    p.textContent = product.description;
    
    anchor.appendChild(article);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
    
    itemsContainer.appendChild(anchor)
}