let url = new URL(window.location.href);
let search_params = new URLSearchParams(url.search);
let id = search_params.get('id')

let idSpan = document.getElementById('orderId');
idSpan.textContent = id