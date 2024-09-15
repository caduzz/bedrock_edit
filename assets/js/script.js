const loadingPage = document.querySelector('.load');
const btnOption = document.querySelectorAll('.btn-option');
const btnResize = document.querySelectorAll('.btn-size');
const btnTheme = document.querySelector('.btn-theme');
const btnHidden = document.querySelector('#btn-hidden');
const selectdFont = document.querySelector('.font-selected');
const sizeInput = document.querySelectorAll('.size-input');
const colorDef = document.querySelectorAll('.input-color-def');
const textarea = document.querySelector('.text-editor');
const bubbleFormat = document.querySelector('.bubble-format');

let fontSize = 2;

window.onload = async () => {
    const main = document.querySelector('.container').parentElement
    const theme = localStorage.getItem('theme:editor')
    textarea.innerHTML = textarea.innerHTML.trim();

    if(theme === 'light') {
        main.className = 'light'
        btnTheme.innerHTML = '<span class="mdi mdi-weather-night"></span>'
    } else {
        btnTheme.innerHTML = '<span class="mdi mdi-sun-wireless-outline"></span>'
        main.className = 'dark'
    }

    sizeInput.forEach((input) => {
        input.textContent = fontSize + 8
    })
    setTimeout(() => {
        loadingPage.style.display = 'none'
    }, 500)
};

textarea.addEventListener('paste', handlePaste);
textarea.addEventListener('click', verifyContent)
textarea.addEventListener('input', verifyContent)
textarea.addEventListener('select', verifyContent)
textarea.addEventListener('keydown', handleEnterKey);
textarea.addEventListener('keyup', handleBubbleFormat);
btnHidden.addEventListener('click', handleHiddenButtonClick);
selectdFont.addEventListener('change', handleFontChange);

btnResize.forEach((btn) => btn.addEventListener('click', handleResizeButtonClick));
btnOption.forEach((btn) => btn.addEventListener('click', handleActionButtonClick));
colorDef.forEach((input) => input.addEventListener('change', (event) => handleColorInputChange(event)));


// Em analise
function handleEnterKey(event) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    if(event.key === 'Enter'){
        const newLine = document.createElement('div');
        const br = document.createElement('br');
        newLine.appendChild(br)

        if (event.ctrlKey) {
            event.preventDefault();
            const textField = document.querySelector('.text-editor');
            textField.appendChild(newLine);;

            range.selectNodeContents(newLine);
            range.collapse(true);
        } else if (!event.ctrlKey) {
            event.preventDefault();
        
            range.insertNode(newLine);
            range.setStartAfter(newLine);
            range.collapse(false);
        }

        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function handleBubbleFormat() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;

    const previousCharacter = range.startContainer.textContent[startOffset - 1];
    if(previousCharacter === '/'){
        const cursorRect = range.getClientRects()[0];
        
        const cursorX = cursorRect.left;
        const cursorY = cursorRect.top;
      
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const isNearHorizontalEdges = cursorX < windowWidth / 2;
        const isNearVerticalEdges = cursorY < windowHeight / 2;
        
        const bubbleWidth = bubbleFormat.offsetWidth;
        const bubbleHeight = bubbleFormat.offsetHeight;
        
        let left, top;
        
        if (isNearHorizontalEdges) {
          left = cursorX + bubbleWidth > windowWidth ? windowWidth - bubbleWidth : cursorX;
        } else {
          left = cursorX < bubbleWidth ? 0 : cursorX - bubbleWidth;
        }
        
        if (isNearVerticalEdges) {
          top = cursorY + bubbleHeight > windowHeight ? windowHeight - bubbleHeight : cursorY + 20;
        } else {
          top = cursorY < bubbleHeight ? 0 : cursorY - bubbleHeight;
        }

        bubbleFormat.style.opacity = 1;
        bubbleFormat.style.zIndex = '99';
        bubbleFormat.style.left = left + 'px';
        bubbleFormat.style.top = top + 'px';
    }else {
        bubbleFormat.style.opacity = 0;
        bubbleFormat.style.zIndex = '-1';
    }
    verifyContent()
}

function handlePaste(event) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("Text");

    // Verifica se é uma imagem colada
    if (clipboardData.files.length > 0 && clipboardData.files[0].type.includes("image")) {
        const file = clipboardData.files[0];
        const reader = new FileReader();
    
        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            editor.appendChild(img);
        };
        
        reader.readAsDataURL(file);
    } else {
        // Se não for uma imagem, colar apenas texto simples
        const sanitizedText = pastedData.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        document.execCommand("insertHTML", false, sanitizedText);
    }
    verifyContent();
}

function handleFontChange({ target }) {
    document.execCommand("fontName", false, target.value);
}   

function handleHiddenButtonClick({ target }) {
    const header = target.closest('div').parentNode.parentNode.parentNode;
    const btn = target.closest('button');
    const show = btn.dataset.show;

    if (show === 'show') {
        header.classList.add('inviseble');
        btn.dataset.show = 'null';
        btn.innerHTML = '<span class="mdi mdi-menu-down"></span>';
    } else {
        header.classList.remove('inviseble');
        btn.dataset.show = 'show';
        btn.innerHTML = '<span class="mdi mdi-menu-up"></span>';
    }
}

function handleResizeButtonClick({ target }) {
    const action = target.closest('button').dataset.action;
    if (action === 'size-') {
        if (fontSize <= 7 && fontSize > 0) {
        fontSize -= 1;
        }
    } else if (action === 'size+') {
        if (fontSize < 7 && fontSize >= 0) {
        fontSize += 1;
        }
    }

    document.execCommand("fontSize", false, fontSize + "px");
    sizeInput.forEach((input) => {
        input.textContent = fontSize + 8;
    });

    textarea.focus();
}

function handleColorInputChange({ target }) {
    const button = target.parentElement.closest('button');
    const action = button.dataset.action;
    if (target) {
        console.log(target.value)
        document.execCommand(action, true, target.value);
    }
}

// Em analise
function handleActionButtonClick(event) {
    textarea.focus();
    const button = event.target.closest('button');
    const action = button.dataset.action;
    const justifyData = action.split('-');

    if (justifyData[0] === 'align') {
        document.execCommand("justify" + justifyData[1], true, null);
    } else {
        if (action === 'save') {
        saveDocument();
        } else {
        if (action === 'paste') {
            Paste(event);
        } else {
            if (action === 'insertHTML') {
                const tag = button.dataset.html;
                let iHTML;
                if (tag === 'table') {
                    iHTML = `
                        <table>
                            <tr>
                                <th></th>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>
                        </table>
                    `;
                } else if (tag === 'callout' || tag === 'p' || tag === 'blockquote') {
                    if(tag === 'callout'){
                        iHTML = `<div id="callout" class="badrock_component"><br/></div>`;
                    } else {
                        iHTML = `<${tag} class="badrock_component">Exemple<${tag}>`;
                    }
                } else {
                    iHTML = `<${tag} class="badrock_tag">Exemple<${tag}>`;
                }
                resetBubbleFormat()
                document.execCommand(action, false, iHTML);
            } else {
                document.execCommand(action, false, null);
            }
        }
        verifyContent();
        }
    }
}

function resetBubbleFormat() {
    document.execCommand("delete", false, null);

    handleBubbleFormat()
}

function verifyContent() {
    const isItalic = document.queryCommandState("italic");
    const isBold = document.queryCommandState("bold");
    const isUnderline = document.queryCommandState("underline");
    const isStrikethrough = document.queryCommandState("strikethrough");
    const isJustifyFull = document.queryCommandState("justifyFull");
    const isJustifyCenter = document.queryCommandState("justifyCenter");
    const isJustifyRight = document.queryCommandState("justifyRight");
    const isJustifyLeft = document.queryCommandState("justifyLeft");

    btnOption.forEach((btn) => {
        const action = btn.dataset.action;
        const actionType = action.split('-');

        if (actionType[0] === 'align') {
            switch (actionType[1]) {
                case 'full':
                    checkActiveBtn(btn, isJustifyFull);
                break;
                case 'center':
                    checkActiveBtn(btn, isJustifyCenter);
                break;
                case 'right':
                    checkActiveBtn(btn, isJustifyRight);
                break;
                case 'left':
                    checkActiveBtn(btn, isJustifyLeft);
                break;
            }
        } else {
            switch (action) {
                case 'bold':
                    checkActiveBtn(btn, isBold);
                break;
                case 'italic':
                    checkActiveBtn(btn, isItalic);
                break;
                case 'underline':
                    checkActiveBtn(btn, isUnderline);
                break;
                case 'strikethrough':
                    checkActiveBtn(btn, isStrikethrough);
                break;
            }
        }
    });
    function checkActiveBtn(button, validate) {
        if (validate) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
}
  
function saveDocument() {
    const fileName = prompt("Digite o nome do arquivo: ");

    if (fileName === '' || fileName === null) return;

    // Cria um objeto Blob com o texto fornecido
    var blob = new Blob([textarea.innerHTML], { type: 'text/plain' });

    // Cria um link de download
    var linkDownload = document.createElement('a');
    linkDownload.href = window.URL.createObjectURL(blob);
    linkDownload.download = fileName;

    // Simula o clique no link de download
    linkDownload.click();
}