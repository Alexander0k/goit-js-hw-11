// Задание 11 - поиск изображений
// Создай фронтенд часть приложения поиска и просмотра изображений по ключевому слову. Добавь оформление элементов интерфейса.

// Форма поиска
// Форма изначально есть в HTML документе. Пользователь будет вводить строку для поиска в текстовое поле, а при сабмите формы необходимо выполнять HTTP-запрос.

// HTTP-запросы
// В качестве бэкенда используй публичный API сервиса Pixabay. Зарегистрируйся, получи свой уникальный ключ доступа и ознакомься с документацией.

// Галерея и карточка изображения
// Элемент div.gallery изначально есть в HTML документе, и в него необходимо рендерить разметку карточек изображений. При поиске по новому ключевому слову необходимо полностью очищать содержимое галереи, чтобы не смешивать результаты.

// Пагинация
// Pixabay API поддерживает пагинацию и предоставляет параметры page и per_page. Сделай так, чтобы в каждом ответе приходило 40 объектов (по умолчанию 20).

// Уведомление
// После первого запроса при каждом новом поиске выводить уведомление в котором будет написано сколько всего нашли изображений (свойство totalHits). Текст уведомления "Hooray! We found totalHits images."

import { fetchImages } from "./fetchImages";
import { Notify } from "notiflix";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

searchForm[1].addEventListener("click", search);
loadMoreBtn.addEventListener("click", loadMore);

const perPage = 40;
let searchPage = 1;
let searchValue;


async function search(event) {
    searchValue = searchForm[0].value;
    searchPage = 1;

    event.preventDefault();
    clearMarkup();

    if (!searchValue) {
        return;
    }

    const images = await loadImages(searchValue);

    if (images.totalHits) {
        Notify.success(`Hooray! We found ${images.totalHits} images.`);
    }
}



async function loadMore() {
    loadMoreBtn.style.display = "none";

    searchPage += 1;
    const images = await loadImages(searchValue, searchPage);

    if (images.totalHits) {
        const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
    }
}



async function loadImages(value, page = 1) {
    const images = await fetchImages({ value, page });

    if (!images.totalHits) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
        const totalImages = page * perPage;

        if (totalImages <= images.totalHits) {
            loadMoreBtn.style.display = "block";
        } else {
            Notify.info("We're sorry, but you've reached the end of search results.");
        }

        renderGallery(images.hits);
    }

    return images;
}


function renderGallery(images) {
    const markup = images
        .map(({ webformatURL, largeImageURL , tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
                <a href="${largeImageURL}">
                    <div><img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>${downloads}
                        </p>
                    </div>
                </a>
            </div>`;
            })
        .join("");
    
    gallery.innerHTML += markup;

    const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt',
    });
}

function clearMarkup() {
    gallery.innerHTML = "";
}