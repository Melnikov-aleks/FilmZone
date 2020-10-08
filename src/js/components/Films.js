import 'slick-carousel';
import moment from '../utils/moment';

import Content from './Content';

import getDataAPI from '../utils/getDataAPI.js';
import generateUrlAPI from '../utils/generateUrlAPI.js';
import Genres from '../constants/Genres.js';
import Credits from './Credits';

class Films {
    constructor() {
        this.container = document.querySelector('.main__container');
    }
    async renderCards() {
        if (document.querySelector('.films-wrap')) {
            document.querySelector('.films-wrap').classList.add('loading');
        }

        this.data = await getDataAPI.getData(generateUrlAPI.generate());

        while (document.querySelector('.films-wrap')) {
            document.querySelector('.films-wrap').remove();
        }
        let innerHtml = '';

        for (const film of this.data.results) {
            innerHtml += `
			<div class="films-wrap__film-card film-card" data-id="${film.id}">
				<div class="film-card__poster-wrap">
					<img class="film-card__poster" src="${
                        film.poster_path
                            ? `https://image.tmdb.org/t/p/w185${film.poster_path}`
                            : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
                    }" alt="${film.title}">
				</div>
				<h2 class="film-card__title">${film.title}</h2>
				<p class="film-card__year">${moment(film.release_date).calendar()}</p>
				${await Genres.renderGenres(film.genre_ids)}
				<p class="film-card__score">${film.vote_average}</p>
			</div>
			`;
        }

        const wrapperHtml = document.createElement('div');
        wrapperHtml.classList.add('main__films-wrap', 'films-wrap');
        wrapperHtml.insertAdjacentHTML('afterbegin', innerHtml);
        this.container.append(wrapperHtml);

        this.addEventCards();
        this.renderPage();
        console.log(Genres);
    }

    addEventCards() {
        const url = new URL(document.location.href);
        document.querySelector('.films-wrap').childNodes.forEach((elem) => {
            elem.addEventListener('click', () => {
                url.searchParams.set('do', 'details');
                url.searchParams.set('id', elem.getAttribute('data-id'));
                url.searchParams.delete('page');
                url.searchParams.delete('q');
                history.pushState(null, null, url);
                Content.render();
            });
        });
    }

    renderPage() {
        if (this.data.total_pages < 2) {
            return;
        }

        while (document.querySelector('.page-list')) {
            document.querySelector('.page-list').remove();
        }

        const pagesList = document.createElement('ul');
        pagesList.classList.add('main__page-list', 'page-list');
        pagesList.insertAdjacentHTML(
            'afterbegin',
            this.generatePages(+this.data.total_pages, +this.data.page)
        );

        document.querySelector('.films-wrap').after(pagesList);

        this.addEventPages();
    }

    generatePages(totalPages, currentPages) {
        let listHTML = '',
            startNum = 1,
            endNum = totalPages,
            endString = '';
        console.log('total', totalPages, 'cur', currentPages);
        if (currentPages > 1) {
            listHTML += `<li class="page-list__page-item page-item" data-page="${
                currentPages - 1
            }"><</li>`;
        }

        if (totalPages > 9) {
            if (currentPages > 5) {
                startNum =
                    currentPages < totalPages - 4 ? currentPages - 2 : totalPages - 6;

                listHTML += `<li class="page-list__page-item page-item" data-page="1">1</li><li class="page-list__page-item page-item page-item__more">...</li>`;
            }
            if (currentPages < totalPages - 4) {
                endNum = currentPages > 4 ? currentPages + 2 : 7;

                endString += `<li class="page-list__page-item page-item page-item__more">...</li><li class="page-list__page-item page-item" data-page="${totalPages}">${totalPages}</li>`;
            } else {
                endNum = totalPages;
            }
        }

        for (let i = startNum; i <= endNum; i++) {
            listHTML +=
                i === currentPages
                    ? `<li class="page-list__page-item page-item page-item_active">${i}</li>`
                    : `<li class="page-list__page-item page-item" data-page="${i}">${i}</li>`;
        }

        listHTML += endString;

        if (currentPages < totalPages) {
            listHTML += `<li class="page-list__page-item page-item" data-page="${
                currentPages + 1
            }">></li>`;
        }
        return listHTML;
    }

    addEventPages() {
        document.querySelector('.page-list').childNodes.forEach((elem) => {
            if (elem.hasAttribute('data-page')) {
                const url = new URL(document.location);
                elem.addEventListener('click', () => {
                    elem.getAttribute('data-page') === '1'
                        ? url.searchParams.delete('page')
                        : url.searchParams.set('page', elem.getAttribute('data-page'));

                    history.pushState(null, null, url);
                    this.renderCards();
                });
            }
        });
    }

    async renderDetails() {
        this.data = await getDataAPI.getData(generateUrlAPI.generate());

        console.log(this.data);

        let innerHtml = `
		<div class="film-wrap__film-details film-details">
			<h1 class="film-details__title">${this.data.title}</h1>
			${
                this.data.tagline
                    ? `<h2 class="film-details__label">Слоган</h2>
					<h2 class="film-details__desc film-details__tagline">${this.data.tagline}</h2>
					`
                    : ''
            }
			${await Genres.renderGenres(this.data.genres)}
			${Credits.renderCrew(this.data.credits.crew)}
			<h2 class="film-details__label">Релиз</h2>
			<h2 class="film-details__desc film-details__release">
			${moment(this.data.release_date).format('LL')}
			</h2>
			
			<h2 class="film-details__label">Страна</h2>
			<h2 class="film-details__desc film-details__country">
			${this.data.production_countries
                .map((item) => {
                    return item.name;
                })
                .join(', ')}
			</h2>
			
			${
                this.data.budget
                    ? `<h2 class="film-details__label">Бюджет</h2>
					<h2 class="film-details__desc film-details__budget">
					$${this.data.budget.toLocaleString()}
					</h2>
					`
                    : ''
            }
			${
                this.data.revenue
                    ? `<h2 class="film-details__label">Выручка</h2>
					<h2 class="film-details__desc film-details__revenue">
					$${this.data.revenue.toLocaleString()}
					</h2>
					`
                    : ''
            }
			${
                this.data.runtime
                    ? `<h2 class="film-details__label">Длительность</h2>
					<h2 class="film-details__desc film-details__runtime">
					${this.data.runtime} min
					</h2>
					`
                    : ''
            }
			${Credits.renderCasts(this.data.credits.cast)}
		</div>  
		<img class="film-wrap__poster" src="${
            this.data.poster_path
                ? `https://image.tmdb.org/t/p/w185${this.data.poster_path}`
                : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
        }">
		<p class="film-wrap__description">${this.data.overview}</p>
		<div class="film-wrap__videos">${this.getVideos()}</div>
		`;

        const wrapperHtml = document.createElement('div');
        wrapperHtml.classList.add('main__film-wrap', 'film-wrap');
        wrapperHtml.insertAdjacentHTML('afterbegin', innerHtml);
        this.container.append(wrapperHtml);

        await this.renderSlider('recommendations');
        await this.renderSlider('similar');
    }

    async renderSlider(type) {
        const url = new URL(document.location.href);

        this.dataSlide = await getDataAPI.getData(
            `https://api.themoviedb.org/3/movie/${url.searchParams.get(
                'id'
            )}/${type}?api_key=9c7b675f9aa1962d9049582aa1d2321c&language=ru`
        );

        if (!this.dataSlide.results.length) return;

        let innerHtml = '';

        for (const film of this.dataSlide.results) {
            innerHtml += `
			<div class="slider-${type}__item" data-id="${film.id}">
				<div class="slider-${type}__poster-wrap">
					<img class="slider-${type}__poster" src="${
                film.poster_path
                    ? `https://image.tmdb.org/t/p/w185${film.poster_path}`
                    : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
            }" alt="${film.title}">
				</div>
				<h2 class="slider-${type}__title">${film.title}</h2>
				<p class="slider-${type}__year">${moment(film.release_date).calendar()}</p>
				${await Genres.renderGenres(film.genre_ids)}
			</div>
			`;
        }

        const wrapperHtml = document.createElement('div');
        wrapperHtml.classList.add(`main__slider-${type}`, `slider-${type}`);

        wrapperHtml.insertAdjacentHTML('afterbegin', innerHtml);

        this.container.append(wrapperHtml);

        $(`.slider-${type}`).slick({
            infinite: true,
        });
    }

    getVideos() {
        let html = '';
        this.data.videos.results
            .filter((elem) => elem.type === 'Trailer')
            .forEach((elem, i) => {
                i === 0 ? (html += '<p>Трейлер</p>') : false;
                html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${elem.key}?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`;
            });
        return html;
    }
}

export default new Films();
