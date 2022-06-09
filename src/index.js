const API_KEY = `27953461-d4616364e0672ac878ff8b77d`
const imageType = `photo`
const imageOrientation  = `horizontal`
const safeSearch = `true`
const searchParameter = `cat`

fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${searchParameter}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${safeSearch}`).then(response => response.json()).then(console.log).catch(console.log)

function makeImage(image) {
body.innerHTML = `<img src=${image[0]} alt="cat">`
}

