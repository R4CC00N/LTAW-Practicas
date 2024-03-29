
function logout() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Elimina la cookie de usuario
    document.querySelector('h3').textContent = ''; // Actualiza el mensaje de conexión
}
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

const fs = require('fs');

function showProducts(){
    let nameProductos = [];
    productos.forEach(producto => {
      nameProductos.push(producto.nombre) ;});
    return nameProductos;
  }
  const nombres=showProducts();
  ////////////////////////////////////////////////////////////////
  
  searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const filteredNames = nombres.filter(product =>
          product.toLowerCase().includes(searchTerm)
      );
  
      renderResults(filteredNames);
  });
  
  function renderResults(results) {
      searchResults.innerHTML = '';
  
      results.forEach(result => {
          const li = document.createElement('li');
          li.textContent = result;
          searchResults.appendChild(li);
      });
  
      if (results.length > 0) {
          searchResults.style.display = 'block';
      } else {
          searchResults.style.display = 'none';
      }
  }
  
  searchResults.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI') {
          searchInput.value = e.target.textContent;
          searchResults.style.display = 'none';
      }
  });
  