const text2Unicode = (text) => {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
    }).join('');
}

const clearAll = () => {
    const text = document.getElementById("input");
    text.value = '';
    setOutput();
    clearCopyButton();
    text.focus();
}

const clearCopyButton = () => {
    const btn = document.getElementById('copiar');
    btn.classList.remove('colorRed');
    btn.classList.remove('colorGreen');
}

const setOutput = () => {
    const btn = document.getElementById('copiar');
    const text = document.getElementById("input").value;
    const response = text2Unicode(text);
    const output = document.getElementById("output");

    btn.focus();

    output.innerHTML = response;
}

const ccb = (name) => {
    const obj = document.getElementById(name);
    const btn = document.getElementById('copiar');
    const clear = document.getElementById("limpar");

    clear.focus();    

    navigator.clipboard.writeText(obj.innerHTML).then(function () {
        btn.classList.add('colorGreen');
    }).catch(function (err) {
        btn.classList.add('colorRed');
        console.error('Erro ao copiar o conteúdo: ', err);
    });
    setTimeout(() => clearCopyButton(), 2000);
}

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

t2u.addEventListener("click", e => {
    e.preventDefault()
    detail.innerHTML = ` 
    <ul>
        <h2>Texto para unicode</h2>
        <li>
            <div id="t2uDiv">
                <section class="secao-t2u">
                  <input id="input" class="t2uObj" autofocus />
                  <button id="transcrever" onclick={setOutput()}>Transcrever</button>
                </section>
                <section class="secao-t2u">
                  <div id="output" class="t2uObj"></div>
                  <button id="copiar" onclick={ccb("output")}>Copiar</button>
                </section>
                <section class="secao-t2u">
                  <button id="limpar" onclick={clearAll()}>Limpar</button>
                </section>
            </div>
        </li>
    </ul>
      `
    document.getElementById('input').focus();
    clearCopyButton()
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
