import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
const axios = require('axios').default;
const lightBox = new SimpleLightbox(`.gallery div a`, { captionsData: `alt`, captionDelay: 250 });

const url = `https://pixabay.com/api/`
const API_KEY = `27953461-d4616364e0672ac878ff8b77d`
const perPage = 40;
let page = 1;
let searchParameter = ``;
let loading = null;
let loadMoreButton = null;

const searchForm = document.querySelector(`#search-form`)
const gallery = document.querySelector(`.gallery`)
const checkBox = document.querySelector(`#infiniteScroll`)

searchForm.addEventListener(`submit`, callImages)

async function fetchImages(url) {

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

async function callImages(event) {
    if (event) {
        if (event.type == `submit`) {
            event.preventDefault();
            searchParameter = event.target.elements.searchQuery.value;
            gallery.innerHTML = '';
            page = 1;
            gallery.insertAdjacentHTML(`beforeend`, `<div class="loading"></div>`);
            loading = document.querySelector(`.loading`);
        }
        }
        

    try {
        const fetch = await fetchImages(url)
    const imagesMarkup = await makeImages(fetch)
        const totalHits = await imagesMarkup;
    if (gallery.children.length < 500 && totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`)
        }
    }
    catch {}
}

function makeImages(images) {
        if (images) {
            if (images.hits.length === 0) {
                Notify.warning("Sorry, there are no images matching your search query. Please try again.");
                return;
            }

            if (!loading) {
                gallery.insertAdjacentHTML(`beforeend`, `<div class="loading"></div>`);
                loading = gallery.querySelector(`.loading`);
            }

            loadingFunc(`start`);

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
            window.onscroll = throttle(infiniteScroll, 500);
            smoothScroll();
            
                  if (checkBox.checked === false && !loadMoreButton) {
                gallery.insertAdjacentHTML(`beforeend`, `<button type="button" class="load-more">Load more</button>`)
                loadMoreButton = gallery.querySelector(`.load-more`);
                loadMoreButton.addEventListener(`click`, callImages);
                loadMoreButton.classList.add("show");}

            if (gallery.children.length >= 500) {
                window.onscroll = throttle(notoficationMax, 1000);
                loadMoreButton.classList.remove("show");
                return;
            }

            return images.totalHits;
        }
        return;
    }

function smoothScroll() {
    
  const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * perPage,
        behavior: "smooth",
    });
    return;  
}

function infiniteScroll() {

     loadingFunc(`stop`);
      if (checkBox.checked === true) {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            callImages();
            return;
        }
    }
}

function notoficationMax() {

    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        Notify.warning("We're sorry, but you've reached the end of search results.");
        loadingFunc(`stop`);
        return;
    }
    return
}

function loadingFunc(command) {
    if (command === `start`) {
        loading.classList.add("visible");
        return;
    }
    loading.classList.remove("visible");
    return;
}