document.addEventListener("DOMContentLoaded", function(event) { 
    const searchBar = document.getElementsByClassName('searchBar')[0];
    const searchElements = document.getElementById('searchElements');
    searchBar.addEventListener('input', searchPreview);
    
    let searchResults = [];
    
    function searchPreview() {
        const search = searchBar.value;
        if (search.length >= 3) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/product?names=" + search, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const results = JSON.parse(xhr.responseText);
                    searchElements.innerHTML = "";
                    for (let i = 0; i < results.length; i++) {
                        //searchElements.innerHTML += `<button class='elementSearched' onclick="location.href=' ${results[i][1]}.html'"> ${results[i]} </button>`;
                        searchElements.innerHTML += `<button class='elementSearched' onclick="location.href=' searchPage.html'"> ${results[i]} </button>`;
                    }
                    searchResults = results;
                }
            };
            xhr.send(); // Envío de la petición
        } else {
            searchElements.innerHTML = "";
        }
    }
});