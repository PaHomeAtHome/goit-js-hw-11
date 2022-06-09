import { Notify } from "notiflix"

const API_KEY = `27953461-d4616364e0672ac878ff8b77d`
const imageType = `photo`
const imageOrientation  = `horizontal`
const safeSearch = `true`
const perPage = 40;
let page = 1;
let searchParameter = ``;

const searchForm = document.querySelector(`#search-form`)
const gallery = document.querySelector(`.gallery`)
const loadMoreButton = document.querySelector(`.load-more`)

searchForm.addEventListener(`submit`, callImages)
loadMoreButton.addEventListener(`click`, callImages)

async function fetchImages(url) {
    const response = await fetch(`${url}&page=${page}`);
    const images = await response.json();
    page += 1;
    return images;
}

async function callImages(event) {

    event.preventDefault();

    if (event.type == `submit`) {
        searchParameter = event.target.elements.searchQuery.value;
        gallery.innerHTML = ''
        page = 1;
        loadMoreButton.classList.remove("show");
    }

    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchParameter}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${safeSearch}&per_page=${perPage}`

    const fetch = await fetchImages(url)
    const imagesMarkup = await makeImages(fetch)

    return;
}

function makeImages(images) {

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

        gallery.insertAdjacentHTML("beforeend",
            
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
    loadMoreButton.classList.add("show");
    return;
}

