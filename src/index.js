import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';

const lightBox = new SimpleLightbox(`.gallery div a`, { captionsData: `alt`, captionDelay: 250 });

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
const checkBox = document.querySelector(`#infiniteScroll`)

searchForm.addEventListener(`submit`, callImages)
loadMoreButton.addEventListener(`click`, callImages)

async function fetchImages(url) {
    const response = await fetch(`${url}&page=${page}`);
    const images = await response.json();
    page += 1;
    return images;
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
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchParameter}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${safeSearch}&per_page=${perPage}`
    const fetch = await fetchImages(url)
    const imagesMarkup = await makeImages(fetch)
    const totalHits = await imagesMarkup;
    if (gallery.children.length < 500) {
        Notify.success(`Hooray! We found ${totalHits} images.`)
    }
        smoothScroll()
    }
    catch {}
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

    loadMoreButton.classList.add("show");

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
        return;
        }
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            loadMoreButton.classList.remove("show")
            callImages()
            return;
        }
    }