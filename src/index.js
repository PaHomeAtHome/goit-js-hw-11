const API_KEY = `27953461-d4616364e0672ac878ff8b77d`
const imageType = `photo`
const imageOrientation  = `horizontal`
const safeSearch = `true`
const searchParameter = `cat`

const body = document.querySelector(`body`)

fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${searchParameter}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${safeSearch}`)
    .then(response => response.json())
    .then(makeImage)
    .catch(console.log)

function makeImage(images) {

    images.hits.map(hit => {
        const largeImage = hit.largeImageURL
        body.insertAdjacentHTML("beforeend", `<img src=${largeImage} alt=${searchParameter} width="300">`);
    })
    
console.log(images)

}

