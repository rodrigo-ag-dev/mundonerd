const ccbColor = (id) => {
    const obj = document.getElementById(id);
    const css = obj.style.cssText;

    navigator.clipboard.writeText(obj.innerHTML)
        .then(() => {
            obj.style.cssText += `color:${obj.innerHTML}`
        }).catch(function (err) {
            obj.style.cssText = css
            console.error('Erro ao copiar o conteúdo: ', err)
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
    const btn = document.getElementById('copiar');
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

    const btn = document.getElementById('copiar');
    btn.focus();

    const output = document.getElementById("output");
    output.innerHTML = response;
}

const ccbUnicode = () => {
    const obj = document.getElementById("output");
    const btn = document.getElementById("copiar");
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
    if (page === "home" || !page)
        $('.divDatail').load('./pages/home.html')
    else if (page === "t2u") {
        $('.divDatail').load('./pages/text2unicode.html', () => {
            const t2uObj = document.querySelector("#input")
            t2uObj.focus()
        })
    } else if (page === "url2text") {
        $('.divDatail').load('./pages/url2text.html', () => {
            const t2uObj = document.querySelector("#input")
            t2uObj.focus()
        })
    } else if (page === "colorPicker") {
        $('.divDatail').load('./pages/colorPicker.html', () => {
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
        $('.divDatail').load('./pages/jsonFormatter.html', () => {
            const inputText = document.querySelector("#inputText")
            inputText.focus()
        })
    }
}

const goHome = () => {
    localStorage.removeItem("bn-initialpage")
    loadPage(null)
}

window.onload = (event) => {
    const page = localStorage.getItem("bn-initialpage")
    loadPage(page)
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
    const btn = document.getElementById("copiar");

    navigator.clipboard.writeText(obj.textContent).then(function () {
        btn.classList.add('colorGreen');
    }).catch(function (err) {
        btn.classList.add('colorRed');
        console.error('Erro ao copiar o conteúdo: ', err);
    });
    setTimeout(() => clearCopyButton(), 2000);
}
