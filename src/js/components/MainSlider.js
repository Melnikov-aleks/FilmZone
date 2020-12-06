import { getDataAPI } from '../utils/API';
import { SliderMy } from './Slider';

export default class MainSlider {
    constructor(element, updateCallback) {
        this.elem = element;
        this.update = updateCallback;
    }
    async render() {
        if (document.querySelector('.section-slider')) return;
        this.data = await getDataAPI(
            'https://api.themoviedb.org/3/movie/popular?api_key=9c7b675f9aa1962d9049582aa1d2321c&language=ru'
        );

        if (!this.data) return;
        const html = [];

        this.data.results.forEach((film, i) => {
            html.push(`
			<div class="slider-main__slide slide" data-id="${film.id}">
				<img class="slide__poster" loading="lazy" alt="${film.title}" data-src-mobile="${
                film.poster_path
                    ? `https://image.tmdb.org/t/p/w185${film.poster_path}`
                    : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
            }" data-src-desktop="${
                film.backdrop_path
                    ? `https://image.tmdb.org/t/p/w780${film.backdrop_path}`
                    : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
            }">
				<h2 class="slide__title">${film.title}</h2>
			</div>
			`);
        });
        this.elem.insertAdjacentHTML(
            'beforebegin',
            `
		<section class="section section-slider slider-main">
					${html.join('')}
		</section>`
        );
        this.slider = new SliderMy('.slider-main', this.update, {
            slideOffset: 0.8,
            startAt: 4,
            slidesToShow: 4,
            slidesToShowMobile: 1,
            backgroundTrack: true,
        });
        this.slider.init();
    }
    delete() {
        while (document.querySelector('.slider-main')) {
            this.slider.delete();
            document.querySelector('.slider-main').remove();
        }
    }
}
