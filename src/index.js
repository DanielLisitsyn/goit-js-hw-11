import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery')
const btnEl = document.querySelector('.load-more');

formEl.addEventListener('submit', handleSubmit);
btnEl.addEventListener('click', handleLoadMoreBtn)


const API_KEY = '33085585-9ffaa73370f38d57c609e57e3';
const BASE_URL = 'https://pixabay.com/api/';
btnEl.style.display = 'none';

let page = 1;

async function handleSubmit(event) { 
    page = 1;
    event.preventDefault();
    console.log(inputEl.value)

    if (inputEl.value.trim() === '') {
        galleryEl.innerHTML = '';
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return
    }

    try {
        const {data} = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                q: inputEl.value,
                image_type: 'photo',
                orientation: 'horizontal',
                sefesearch: true,
                per_page: 40,
                page: page,
                
            }

            
            
        }) 

        
        
        if (data.hits.length > 39){
          btnEl.style.display = 'flex';
            galleryEl.innerHTML = createMarkup(data.hits);
       
            new SimpleLightbox('.gallery a');
        
            
        } else if (data.hits.length <= 39) {
            btnEl.style.display = 'none';
            galleryEl.innerHTML = createMarkup(data.hits);
       
            new SimpleLightbox('.gallery a');
        } 
            else {
                Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
                galleryEl.innerHTML = '';
            }
    } 
    catch(error) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    }
   
}


async function handleLoadMoreBtn(event) {
   
    page += 1;
const {data} = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                q: inputEl.value,
                image_type: 'photo',
                orientation: 'horizontal',
                sefesearch: true,
                per_page: 40,
                page: page,
                
    }     
    
}).catch(err => {
    if (err) {
        btnEl.style.display = 'none';
    }
})
    
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(data.hits))
           
}



function createMarkup(photosArray)  {
    const markup = photosArray.map(
        (photos) => {
            return `
            
                  
                  <div class="photo-card">
                  <a class="" href="${photos.largeImageURL}">
                    <img class="gallery_img" src="${photos.webformatURL}" alt="${photos.tags}" loading="lazy" />
        </a>
                    <div class="info">

                    <div class ="text">
                    <h2 class="title">Likes</h2>
                        <p class="info-item">
                        <b>${photos.likes}</b>
                        </p>
                        </div>

                        <div class ="text">
                        <h2 class="title">Views</h2>
                        <p class="info-item">
                        <b>${photos.views}</b>
                        </p>
                        </div>
                        <div class ="text">
                        <h2 class="title">Comments</h2>
                        <p class="info-item">
                        <b>${photos.comments}</b>
                        </p>
                        </div>
                        <div class ="text">
                        <h2 class="title">Downloads</h2>
                        <p class="info-item">
                        <b>${photos.downloads}</b>
                        </p>
                        </div>
                    </div>
                    </div>
                    
                
        `
        }).join('');
    return markup;


}
    
