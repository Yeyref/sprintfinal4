async function buscarPokemon(query) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!response.ok) {
            throw new Error("No se encontró el Pokémon");
        } else {
            console.log(response);
        }

        const pokemon = await response.json();
        mostrarPokemones([pokemon]); // Pasamos el Pokémon en un array para reutilizar la función
        console.log(pokemon);
    } catch (error) {
        alert(error.message);
        console.error("Error al buscar el Pokémon: " + error.message);
    }
}

function mostrarPokemones(pokemones) {
    const contenedor = document.getElementById('pokemones');
    contenedor.innerHTML = '';

    pokemones.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('col-md-4');
        card.innerHTML = `
            <div class="card" data-id="${pokemon.id}" data-url="${pokemon.url}">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <h5 class="card-title">${pokemon.name}</h5>
                    <p class="card-text">ID: ${pokemon.id}</p>
                </div>
            </div>
        `;
        card.addEventListener('click', () => mostrarDetalles(pokemon.id));
        contenedor.appendChild(card);
        console.log(pokemon.id)
    });
}
let currentChart = null;
async function mostrarDetalles(pokemonid) {
    try {
        document.getElementById('pokemonInfo').innerHTML = '';
        if (currentChart) {
            currentChart.destroy();
        }
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonid}`);
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        } else { console.log(response) }

        const pokemon = await response.json();
        $('#pokemonModal').modal('show');
        document.getElementById('pokemonInfo').innerHTML = `
            <h5>${pokemon.name}</h5>
            <p>ID: ${pokemon.id}</p>
            <p>Tipo(s): ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        `;

        const ctx = document.getElementById('pokemonChart').getContext('2d');
        currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: pokemon.stats.map(stat => stat.stat.name),
                datasets: [{
                    label: 'Poderes',
                    data: pokemon.stats.map(stat => stat.base_stat),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#D6E9C6', '#BFD3C1'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error al obtener los detalles del Pokémon: " + error.message);
    }
}

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (query) {
        buscarPokemon(query);
    }
});
