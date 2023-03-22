const card = (element) => {
    const poster = document.createElement("img")
    poster.src = "https://www.themoviedb.org/t/p/w300" + element.poster_path

    const titulo = document.createElement("p")
    if (element.name)
        titulo.innerHTML = element.name
    else if (element.title)
        titulo.innerHTML = element.title

    const divNota = document.createElement("div")
    divNota.classList.add("nota")

    const nota = document.createElement("span")
    nota.innerHTML = element.vote_average.toFixed(1)

    divNota.appendChild(nota)

    const card = document.createElement("div")
    card.classList.add("cards")

    card.appendChild(poster)
    card.appendChild(titulo)
    card.appendChild(divNota)

    return card
}

const groupCard = (columns, cards) => {
    const groupCard = document.createElement("div")
    groupCard.classList.add("groupCard")
    for (let i = 0; i < columns; i++) {
        if (cards[i]) groupCard.appendChild(cards[i])
    }
    return groupCard
}

const data = (url) => {
    const columns = 50
    let dados;
    fetch(url)
        .then(resp => resp.json()
            .then(json => {
                dados = json.results
                if (dados) {
                    let cards = []
                    const dadosOrdenados = dados.sort((a, b) => {
                        if (a.vote_average > b.vote_average) return -1;
                        if (a.vote_average < b.vote_average) return 1;
                    })
                    dadosOrdenados.forEach(element => {
                        cards.push(card(element))
                        if (cards.length == columns) {
                            document.querySelector("#series").appendChild(groupCard(columns, cards))
                            cards = []
                        }
                    })
                    if (cards.length > 0)
                        document.querySelector("#series").appendChild(groupCard(columns, cards))
                }
            })
        )
}

const menu = document.querySelector('#menu')
const mcl = menu.classList

const btnClose = document.querySelector('#btnClose')

const detail = document.querySelector('#detail')

const hideMenu = () => {
    mcl.add('hide')
    mcl.remove('show')
}

const showMenu = () => {
    mcl.add('show')
    mcl.remove('hide')
}

btnMenu.addEventListener("click", e => {
    e.preventDefault()
    showMenu()
})

btnClose.addEventListener("click", e => {
    e.preventDefault()
    hideMenu()
})

optionPwr7.addEventListener("click", async (e) => {
    e.preventDefault()
    $('#detail').load('./pages/pwr7.html')
    hideMenu()
})

optionDelTmp.addEventListener("click", e => {
    e.preventDefault()
    $('#detail').load('./pages/delTmp.html')
    hideMenu()
})

optionFilms.addEventListener("click", e => {
    e.preventDefault()
    detail.innerHTML = ` 
    <ul>
        <h2>Filmes mais assistidos na última semana</h2>
        <li>
            <div id="pwr7">
                <section id="series" class="secao-filmes">
                </section>
            </div>
        </li>
    </ul>
      `
    data("https://api.themoviedb.org/3/trending/movie/week?api_key=02d559f2f2a791ee43539e09647ff4b2&language=pt-BR")
    hideMenu()
})

optionSerie.addEventListener("click", e => {
    e.preventDefault()
    detail.innerHTML = ` 
    <ul>
        <h2>Séries mais assistidas na última semana</h2>
        <li>
            <div id="pwr7">
                <section id="series" class="secao-filmes">
                </section>
            </div>
        </li>
    </ul>
      `
    data("https://api.themoviedb.org/3/trending/tv/week?api_key=02d559f2f2a791ee43539e09647ff4b2&language=pt-BR")
    hideMenu()
})
