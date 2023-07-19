const Paste = () => {
    if (navigator.clipboard) {
        navigator.clipboard.readText()
            .then((pastedData) => {
            const sanitizedText = pastedData.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            document.execCommand("insertHTML", false, sanitizedText);
            })
            .catch((error) => {
            console.error('Failed to read clipboard text data:', error);
            });
    
        navigator.clipboard.read()
            .then((clipboardItems) => {
            if (!clipboardItems || clipboardItems.length === 0) {
                console.warn('Clipboard is empty or contains no valid data.');
                return;
            }
    
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                if (type.includes("image")) {
                    clipboardItem.getType(type)
                    .then((imageBlob) => {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                        if (type.includes("gif")) {
                            const img = document.createElement("img");
                            img.src = e.target.result;
                            document.execCommand("insertHTML", false, img.outerHTML);
                        } else {
                            document.execCommand('insertImage', false, e.target.result);
                        }
                        };
                        reader.readAsDataURL(imageBlob);
                    })
                    .catch((error) => {
                        console.error('Failed to read clipboard image data:', error);
                    });
                }
                }
            }
            })
            .catch((error) => {
            console.error('Failed to read clipboard:', error);
            });
    } else {
      console.warn('The browser does not support the Clipboard API.');
    }
};
  