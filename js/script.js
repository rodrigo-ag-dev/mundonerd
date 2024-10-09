window.onload = function () {
    matrix();
    const page = localStorage.getItem("bn-initialpage")
    loadPage(page)
};

function matrix() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * canvas.height / fontSize;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i] += Math.random() * 2; // Varia a velocidade de queda
        }
    }

    setInterval(draw, 33);
}

const ccbColor = (id) => {
    const obj = document.getElementById(id);
    const css = obj.style.cssText;

    navigator.clipboard.writeText(obj.innerHTML)
        .then(() => {
            obj.style.cssText += `color:${obj.innerHTML}`
        }).catch(function (err) {
            obj.style.cssText = css
            console.error('Erro ao copyButton o conteúdo: ', err)
        });
    setTimeout(() => { obj.style.cssText = css }, 2000)
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
}

const text2Unicode = (text) => {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
    }).join('');
}

const unicode2Text = (unicodeStr) => {
    return unicodeStr.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace('\\u', ''), 16));
    });
}

const clearAll = () => {
    const text = document.getElementById("input");
    text.value = '';
    setOutput();
    clearCopyButton();
    text.focus();
}

const clearCopyButton = () => {
    const btn = document.getElementById('copyButton');
    btn.classList.remove('colorRed');
    btn.classList.remove('colorGreen');
}

const encodeUrl = () => {
    setOutput("url", true)
}

const decodeUrl = () => {
    setOutput("url", false)
}

const encodeUnicode = () => {
    setOutput("unicode", true)
}

const decodeUnicode = () => {
    setOutput("unicode", false)
}

const setOutput = (mode = null, encode = true) => {
    let response = null
    if (mode && mode == "unicode") {
        const text = document.getElementById("input").value;
        if (encode)
            response = text2Unicode(text);
        else
            response = unicode2Text(text);
    } else if (mode && mode == "url") {
        const text = document.getElementById("input").value;
        if (encode)
            response = encodeURIComponent(text);
        else
            response = decodeURIComponent(text);
    }

    const btn = document.getElementById('copyButton');
    btn.focus();

    const output = document.getElementById("output");
    output.innerHTML = response;
}

const ccbUnicode = () => {
    const obj = document.getElementById("output");
    const btn = document.getElementById("copyButton");
    const clear = document.getElementById("clearButton");

    clear.focus();

    navigator.clipboard.writeText(obj.innerHTML).then(function () {
        btn.classList.add('colorGreen');
    }).catch(function (err) {
        btn.classList.add('colorRed');
        console.error('Erro ao copyButton o conteúdo: ', err);
    });
    setTimeout(() => clearCopyButton(), 2000);
}

const t2uOnClick = async (e) => {
    localStorage.setItem("bn-initialpage", "t2u")
    loadPage("t2u")
}

const url2textOnClick = async (e) => {
    localStorage.setItem("bn-initialpage", "url2text")
    loadPage("url2text")
}

const colorPickerOnClick = async (e) => {
    localStorage.setItem("bn-initialpage", "colorPicker")
    loadPage("colorPicker")
}

const jsonFormatterOnClick = async (e) => {
    localStorage.setItem("bn-initialpage", "jsonFormatter")
    loadPage("jsonFormatter")
}

const loadPage = (page) => {
    if (page === "home" || !page) {
        console.log('page', page)
        $('.detail').load('./pages/home.html')
    } else if (page === "t2u") {
        $('.detail').load('./pages/text2unicode.html', () => {
            const object = document.querySelector("#input")
            object.focus()
        })
    } else if (page === "url2text") {
        $('.detail').load('./pages/url2text.html', () => {
            const object = document.querySelector("#input")
            object.focus()
        })
    } else if (page === "colorPicker") {
        $('.detail').load('./pages/colorPicker.html', () => {
            const colorPicker = document.getElementById('colorPicker');
            const hexValue = document.getElementById('hexValue');
            const rgbValue = document.getElementById('rgbValue');
            colorPicker.addEventListener('input', () => {
                const color = colorPicker.value;
                hexValue.textContent = color;
                rgbValue.textContent = hexToRgb(color);
            });
        })
    } else if (page === "jsonFormatter") {
        $('.detail').load('./pages/jsonFormatter.html', () => {
            const inputText = document.querySelector("#inputText")
            inputText.focus()
        })
    }
}

const goHome = () => {
    localStorage.removeItem("bn-initialpage")
    loadPage(null)
}

const processText = () => {
    let inputText = document.getElementById('inputText').value;
    try {
        inputText = inputText.replace(/(\w+):/g, '"$1":');
        const jsonObject = JSON.parse(inputText);
        const formattedJson = syntaxHighlight(jsonObject);
        document.getElementById('outputJson').innerHTML = formattedJson;
    } catch (error) {
        document.getElementById('outputJson').textContent = 'Erro: O texto fornecido não é um JSON válido.';
    }
}

const syntaxHighlight = (json) => {
    json = JSON.stringify(json, null, 4);
    json = json.replace(/\"(\w+)\":/g, '<span class="key">$1</span>:');
    json = json.replace(/: \"(.*?)\"/g, ': <span class="string">"$1"</span>');
    json = json.replace(/: (\d+)/g, ': <span class="number">$1</span>');
    json = json.replace(/: (true|false)/g, ': <span class="boolean">$1</span>');
    json = json.replace(/([\{\}\[\]])/g, '<span class="bracket">$1</span>');
    json = json.replace(/(:)/g, '<span class="colon">$1</span>');
    json = json.replace(/(,)/g, '<span class="comma">$1</span>');
    return json;
}

const ccbJSon = () => {
    const obj = document.getElementById("outputJson");
    const btn = document.getElementById("copyButton");

    navigator.clipboard.writeText(obj.textContent).then(function () {
        btn.classList.add('colorGreen');
    }).catch(function (err) {
        btn.classList.add('colorRed');
        console.error('Erro ao copyButton o conteúdo: ', err);
    });
    setTimeout(() => clearCopyButton(), 2000);
}
