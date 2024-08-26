let offset = 0;
let currentChart = null;

async function obtenerPokemones(limit = 20, offset = 0) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const data = await response.json();
        mostrarPokemones(data.results);
    } catch (error) {
        console.error("Error al obtener la información: " + error.message);
    }
}

function mostrarPokemones(pokemones) {
    const contenedor = document.getElementById('pokemones');
    contenedor.innerHTML = '';

    pokemones.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('col-md-4');
        card.innerHTML = `
            <div class="card" data-id="${pokemon.url.split('/')[6]}">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/')[6]}.png" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <h5 class="card-title">${pokemon.name}</h5>
                    <p class="card-text">ID: ${pokemon.url.split('/')[6]}</p>
                </div>
            </div>
        `;
        card.addEventListener('click', () => mostrarDetalles(pokemon.url));
        contenedor.appendChild(card);
    });
}

async function mostrarDetalles(url) {
    try {
        document.getElementById('pokemonInfo').innerHTML = '';
        if (currentChart) {
            currentChart.destroy();
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        } else {
            console.log(response)
        }

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

document.getElementById('cargarMas').addEventListener('click', () => {
    offset += 20;
    obtenerPokemones(20, offset);
});

document.getElementById('limpiarTodo').addEventListener('click', () => {
    offset = 0;
    obtenerPokemones(20, offset);
});

obtenerPokemones(20, offset);

