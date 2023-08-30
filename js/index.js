const URL = "https://japceibal.github.io/japflix_api/movies-data.json";
let listaPeliculas = [];

function getJSONData(url) {
    let result = {};
    return fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (response) {
            result.status = "ok";
            result.data = response;
            return result;
        })
        .catch(function (error) {
            result.status = "error";
            result.data = error;
            return result;
        });
}

const estrellas = (num)=> Math.round(num / 2);

function mostrarBusquedaPelis(peliculasFiltradas) {
    let htmlAppend = "";
    document.getElementById("lista").innerHTML = htmlAppend;
    for (let i = 0; i < peliculasFiltradas.length; i++) {
        let propiedades = peliculasFiltradas[i];
        let stars = "";
        
        for(let x = 0; x < 5; x++){
            if(x < estrellas(propiedades.vote_average)){
                stars += `<span class="fa fa-star checked"></span>`;
            }else{
                stars += `<span class="fa fa-star text-light"></span>`;
            }
        }

        htmlAppend = `
        <li onClick="showInfo(${propiedades.id})" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" class="list-group-item-action list-group-item bg-dark">
            <span class="text-light fw-bold">${propiedades.title} </span><br>
            <span class="text-muted fst-italic">${propiedades.tagline} </span>
            <div>${stars} </div>
        </li>
        `;
        document.getElementById("lista").innerHTML += htmlAppend;
    }
}

function showInfo(id){
    let peli;
    let generos = "";

    for(let i = 0; i <listaPeliculas.length; i++){
        if(id == listaPeliculas[i].id){
            peli = listaPeliculas[i];
        }
    }
    for(let x=0; x<peli.genres.length; x++){
        if(x+1 < peli.genres.length){
            generos += `<span>${peli.genres[x].name} - </span>`;
        }else{
            generos += `<span>${peli.genres[x].name}</span>`;
        }
    }
    document.getElementById("offcanvasTopLabel").innerHTML = `${peli.title}`;

    let moreInfo = `
    <div class="dropdown float-end">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            More info
        </button>
        <ul class="dropdown-menu" style="width: 200px">
            <li><span class="dropdown-item">Year: <span class="float-end"> ${peli.release_date.slice(0, 4)} </span></span></li>
            <li><span class="dropdown-item">Runtime: <span class="float-end">${peli.runtime} mins</span></span></li>
            <li><span class="dropdown-item">Budget: <span class="float-end">$${peli.budget}</span></span></li>
            <li><span class="dropdown-item">Revenue: <span class="float-end">$${peli.revenue}</span></span></li>
        </ul>
    </div>
`;

    document.getElementById("info").innerHTML = `
        <span>${peli.overview}</span>
        <hr>
        ${generos}
        ${moreInfo}
    `;

}

function generos(unaPeli, busqueda){
    let tiene = false;
    unaPeli.genres.forEach(genero => {
        if(genero.name.toUpperCase().includes(busqueda)){
            tiene = true;
        }
    });
    return tiene;
}

function filtrado(y) {
    const resultado = listaPeliculas.filter((pelicula) =>
        pelicula.title.toUpperCase().includes(y) || 
        pelicula.tagline.toUpperCase().includes(y) || 
        pelicula.overview.toUpperCase().includes(y) ||
        generos(pelicula, y)
    );
    return resultado;
}

document.addEventListener("DOMContentLoaded", function () {
    getJSONData(URL).then(function (resultObj) {
        listaPeliculas = resultObj.data;
    });
    document.getElementById("btnBuscar").addEventListener("click", function () {
        let busqueda = "";
        busqueda = document.getElementById("inputBuscar").value;
        if (busqueda == "") {
            alert("Busca una peli");
        } else {
            mostrarBusquedaPelis(filtrado(busqueda.toUpperCase()));
        }
    });
});
