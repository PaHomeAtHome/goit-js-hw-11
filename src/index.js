import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
const axios = require('axios').default;
const lightBox = new SimpleLightbox(`.gallery div a`, { captionsData: `alt`, captionDelay: 250 });

const url = `https://pixabay.com/api/`;
const API_KEY = `27953461-d4616364e0672ac878ff8b77d`;
const perPage = 40;
let page = 1;
let searchParameter = ``;

const loadMoreButton = document.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, callImages);

const searchForm = document.querySelector(`#search-form`);
const gallery = document.querySelector(`.gallery`);
const checkBox = document.querySelector(`#infiniteScroll`);

searchForm.addEventListener(`submit`, callImages),
window.addEventListener(`scroll`, debounce(infiniteScroll, 250));
lightBox.on('show.simplelightbox');


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

    try {

        if (event.type == `submit`) {
            event.preventDefault();
            searchParameter = event.target.elements.searchQuery.value;
            gallery.innerHTML = '';
            page = 1;
        }
        
        const fetch = await fetchImages(url);
        const imagesMarkup = await makeImages(fetch);
        const totalHits = await imagesMarkup;

        if (page > 2) {
            smoothScroll();
        }
  
    if (gallery.children.length < 500 && totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        }
    }

    catch {
        Notify.warning("We're sorry, but you've reached the end of search results.");
        loadMoreButton.classList.remove("show");
        return;
    }
}

async function makeImages(images, event) {

        if (images) {
            if (images.hits.length === 0) {
                Notify.warning("Sorry, there are no images matching your search query. Please try again.");
                return;
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
            lightBox.refresh();

                  if (checkBox.checked === false) {
                      loadMoreButton.classList.add("show");
            }

            else {loadMoreButton.classList.remove("show")} 

            return images.totalHits;
        }
        return
    }

async function smoothScroll() {
    
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
    return;
}

async function infiniteScroll() {
      if (checkBox.checked === true && ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) ) {
            callImages(`scroll`);
    }
}