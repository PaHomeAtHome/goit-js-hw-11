import { Notify } from "notiflix"

const API_KEY = `27953461-d4616364e0672ac878ff8b77d`
const imageType = `photo`
const imageOrientation  = `horizontal`
const safeSearch = `true`
const searchParameter = `cat`
const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchParameter}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${safeSearch}`

const body = document.querySelector(`body`)

async function fetchImages(url) {
    const response = await fetch(url);
    const images = response.json();
    return images;
}

function callImages() {
    fetchImages(url).then(makeImage)
}

callImages()

function makeImage(images) {

     if (images.hits.length === 0) {
        Notify.warning("Sorry, there are no images matching your search query. Please try again.")
    }

    images.hits.map(hit => {
        
        const webFormatURL = hit.webformatURL;
        const largeImage = hit.largeImageURL;
        const tags = hit.tags;
        const likes = hit.likes;
        const views = hit.views;
        const comments = hit.comments;
        const downloads = hit.downloads;

        body.insertAdjacentHTML("beforeend",
            
            `<div class="photo-card">
            <img src="${webFormatURL}" alt="${searchParameter}" loading="lazy" />
            <div class="info">
            <p class="info-item">
            <b>Likes</b>${likes}</p>
            <p class="info-item">
            <b>Views</b>${views}</p>
            <p class="info-item">
            <b>Comments</b>${comments}</p>
            <p class="info-item">
            <b>Downloads</b>${downloads}</p>
            </div>
            </div>`);
    })
    
console.log(images)

}

