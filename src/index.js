import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
const axios = require('axios').default;
const lightBox = new SimpleLightbox(`.gallery div a`, { captionsData: `alt`, captionDelay: 250 });

const API_KEY = `27953461-d4616364e0672ac878ff8b77d`
const perPage = 40;
let page = 1;
let searchParameter = ``;

const searchForm = document.querySelector(`#search-form`)
const gallery = document.querySelector(`.gallery`)
const loadMoreButton = document.querySelector(`.load-more`)
const checkBox = document.querySelector(`#infiniteScroll`)

searchForm.addEventListener(`submit`, callImages)
loadMoreButton.addEventListener(`click`, callImages)

async function fetchImages(url) {
    try {
        const response = await axios.get(url, {
            params: {
                key: API_KEY,
                q: searchParameter,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: `true`,
                per_page: perPage,
                page: page,
            }
        });
        const images = await response.data;
        page += 1;
        return images;
    }
    catch (error) {
         console.error(error);
    }
}

async function callImages(event) {
    if (event) {
        if (event.type == `submit`) {
        event.preventDefault();
        searchParameter = event.target.elements.searchQuery.value;
        gallery.innerHTML = ''
        page = 1;
            loadMoreButton.classList.remove("show");
    }}
    try {
    const url = `https://pixabay.com/api/`
    const fetch = await fetchImages(url)
    const imagesMarkup = await makeImages(fetch)
    const totalHits = await imagesMarkup;
    if (gallery.children.length < 500) {
        Notify.success(`Hooray! We found ${totalHits} images.`)
    }
        smoothScroll()
    }
    catch (error) {
         console.error(error);
    }
}

function makeImages(images) {

     if (images.hits.length === 0) {
         Notify.warning("Sorry, there are no images matching your search query. Please try again.")
         
    }

    images.hits.map(hit => { 

        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = hit;

        gallery.insertAdjacentHTML("beforeend", 
            `<div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
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
             </a>
            </div>
           `);
    })
    
    lightBox.on('show.simplelightbox')
    lightBox.refresh();
    smoothScroll();

        window.onscroll = throttle(infiniteScroll, 500);

    if (gallery.children.length >= 500) {
            Notify.warning("We're sorry, but you've reached the end of search results.")
            loadMoreButton.classList.remove("show");
            return;
    }

    return images.totalHits;
}

function smoothScroll() {

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * perPage,
        behavior: "smooth",
    });
    
}

function infiniteScroll() {
    if (checkBox.checked === false) {
        loadMoreButton.classList.add("show");
        return;
    }
    
    if (checkBox.checked === true) {
        loadMoreButton.classList.remove("show")
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            callImages()
            return;
        }
    }
    }