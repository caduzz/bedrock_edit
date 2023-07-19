btnTheme.addEventListener('click', ({target}) => {
    const main = document.querySelector('.container').parentNode
    if (main.className.includes('light')) {
        main.className = 'dark'
        localStorage.setItem('theme:editor', 'dark')
        target.closest('button').innerHTML = '<span class="mdi mdi-sun-wireless-outline"></span>'
    } else {
        main.className = 'light'
        localStorage.setItem('theme:editor', 'light')
        target.closest('button').innerHTML = '<span class="mdi mdi-weather-night"></span>'
    }
})