import moment from './moment';
import { Genres } from './API';
import tabs from '../../img/tabs.sprite.svg';

export async function getDetailsHtml(film) {
    return `
	<h1 class="film-wrap__title">${film.title}</h1>
	<img class="film-wrap__poster" src="${
        film.poster_path
            ? `https://image.tmdb.org/t/p/w342${film.poster_path}`
            : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
    }">
	<div class="film-wrap__film-details film-details">
		${getDetailsRowHtml(film.tagline, 'tagline', 'Слоган')}
		${getDetailsRowHtml(film.genres, 'genre', 'Жанры')}
		${getCrewHtml(film.credits.crew)}
		${getDetailsRowHtml(moment(film.release_date).format('LL'), 'release', 'Релиз')}
		${getDetailsRowHtml(film.production_countries, 'country', 'Страна')}
		${getDetailsRowHtml('$' + film.budget.toLocaleString(), 'budget', 'Бюджет')}
		${getDetailsRowHtml('$' + film.revenue.toLocaleString(), 'revenue', 'Выручка')}
		${getDetailsRowHtml(film.runtime + ' минут', 'runtime', 'Длительность')}
		${getCastHtml(film.credits.cast)}
	</div>  
	
	<div class="film-wrap__description">
		<h2 class="film-wrap__subtitle">Описание</h2>
		<p class="film-wrap__description">${film.overview}</p>
	</div>
	${getVideosHtml(film.videos.results)}
	`;
}

function getDetailsRowHtml(value, name, rusName) {
    if (value) {
        if (typeof value === 'object') {
            value = value.map((item) => item.name).join(', ');
        }

        return `<h2 class="film-details__label">${rusName}</h2>
				<p class="film-details__desc film-details__${name}">${value}</p>`;
    }
    return '';
}
function getCrewHtml(crews) {
    let directors = [];
    let screenplays = [];
    let producers = [];
    const html = [];

    crews.forEach((person) => {
        switch (person.job) {
            case 'Screenplay':
            case 'Author':
            case 'Novel':
            case 'Writer':
            case 'Scenario Writer':
            case 'Story':
            case 'Co-Writer':
                screenplays.push(
                    `<li class="film-details__screenplays-item screenplays-item crew-item" data-person_id=${person.id}>${person.name}</li>`
                );
                break;
            case 'Director':
                directors.push(
                    `<li class="film-details__directors-item directors-item crew-item" data-person_id=${person.id}>${person.name}</li>`
                );
                break;
        }
        if (
            person.job.toLowerCase().includes('producer') &&
            person.department === 'Production'
        ) {
            producers.push(
                `<li class="film-details__producers-item producers-item crew-item" data-person_id=${person.id}>${person.name}</li>`
            );
        }
    });
    if (directors.length > 0) {
        html.push(`<h2 class="film-details__label">Режисер</h2>
					<ul class="film-details__desc film-details__directors-list directors-list crew-list">${directors.join(
                        ''
                    )}</ul>`);
    }
    if (screenplays.length > 0) {
        html.push(`<h2 class="film-details__label">Сценарист</h2>
		<ul class="film-details__desc film-details__screenplays-list screenplays-list crew-list">${screenplays.join(
            ''
        )}</ul>`);
    }
    if (producers.length > 0) {
        html.push(`<h2 class="film-details__label">Продюсер</h2>
		<ul class="film-details__desc film-details__producers-list producers-list crew-list">${producers.join(
            ''
        )}</ul>`);
    }
    return html.join('');
}
function getCastHtml(casts) {
    let actors = [];
    const html = [];

    casts.forEach((person) => {
        if (person.order < 10) {
            actors.push(
                `<li class=" film-details__actors-item actors-item cast-item" data-person_id=${
                    person.id
                }>${person.name}<img class="film-details__actor-img actor-img" src="${
                    person.profile_path
                        ? `https://image.tmdb.org/t/p/w185/${person.profile_path}`
                        : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
                }"></li>`
            );
        } else return;
    });

    if (actors.length > 0) {
        html.push(`<h2 class="film-details__label">Актеры</h2>
		<ul class="film-details__desc film-details__actors-list actors-list cast-list">${actors.join(
            ''
        )}</ul>`);
    }

    return html.join('');
}
function getVideosHtml(videos) {
    const frames = videos
        .filter((elem) => elem.type === 'Trailer')
        .map(
            (elem) =>
                `<div class="video__wrap">
				<iframe class="film-wrap__trailer" src="https://www.youtube.com/embed/${elem.key}?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
				</div>`
        );
    if (frames.length > 0)
        return `<div class="film-wrap__videos">
					<h2 class="film-wrap__subtitle">Трейлер${frames.length > 1 ? 'ы' : ''}</h2>
					${frames.join('')}
				</div>`;

    return '';
}

export async function getCardsHtml(films) {
    const html = [];
    for (const film of films) {
        html.push(`
		<div class="film-cards__film-card film-card" data-id="${film.id}">
			<img class="film-card__poster" loading="lazy" src="${
                film.poster_path
                    ? `https://image.tmdb.org/t/p/w342${film.poster_path}`
                    : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
            }" alt="${film.title}">
			<h2 class="film-card__title">${film.title}</h2>
			<p class="film-card__year">${moment(film.release_date).calendar()}</p>
			${await getGenresHtml(film.genre_ids, 'film-card')}
			<p class="film-card__score">${film.vote_average}</p>
		</div>
		`);
    }
    return html.join('');
}

export function getTabsHtml(parent) {
    return `
	<ul class="${parent}__tabs-wrap tabs-wrap">
		<li class="tabs-wrap__tab tab nav-tab" id="popular" data-section="popular">
			<svg class="tab__icon tab__icon-hot icon-hot icon"><use xlink:href="${tabs}#hot"/></svg>
			<span class="tab__title">Популярные</span>
		</li>
		<li class="tabs-wrap__tab tab nav-tab" id="last" data-section="last">
			<svg class="tab__icon tab__icon-new icon-new icon"><use xlink:href="${tabs}#new"/></svg>
			<span class="tab__title">Последние</span>
		</li>
		<li class="tabs-wrap__tab tab nav-tab" id="best" data-section="best">
			<svg class="tab__icon tab__icon-like icon-like icon"><use xlink:href="${tabs}#like"/></svg>
			<span class="tab__title">Лучшие</span>
		</li>
		<li class="tabs-wrap__tab tab nav-tab" id="watching" data-section="watching">
			<svg class="tab__icon tab__icon-play icon-play icon"><use xlink:href="${tabs}#playPause"/></svg>
			<span class="tab__title">Сейчас смотрят</span>
		</li>
		<li class="tabs-wrap__tab tab nav-tab" id="upcoming" data-section="upcoming">
			<svg class="tab__icon tab__icon-future icon-future icon"><use xlink:href="${tabs}#future"/></svg>
			<span class="tab__title">Ожидаются</span>
		</li>
	</ul>`;
}

export async function getSliderHtml(type, films, title = '') {
    const html = [];
    for (const film of films) {
        html.push(`
			<div class="slider-${type}__slide" data-id="${film.id}">
					<img class="slide__poster"  alt="${film.title}" data-src-mobile="${
            film.poster_path
                ? `https://image.tmdb.org/t/p/w185${film.poster_path}`
                : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
        }" data-src-desktop="${
            film.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${film.backdrop_path}`
                : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
        }">
				<h3 class="slide__title">${film.title}</h3>
				
				<p class="slide__release">${moment(film.release_date).calendar()}</p>
				${await getGenresHtml(film.genre_ids, 'slide')}
			</div>
			`);
    }

    return `<div class="slider-${type}-wrap">
				<h2 class="slider-${type}__title">${title}</h2>
				<div class="main__slider-${type} slider-${type}">
					${html.join('')}
				</div>
			</div>`;
}

async function getGenresHtml(genres, dest) {
    if (!genres.length) return '';
    const list = [];
    for (const id of genres) {
        list.push(
            `<li class="${dest}__genre-item genre-item" data-genre=${id}>${await Genres.getById(
                id
            )}</li>`
        );
    }
    return `<ul class="${dest}__genre-list genre-list">${list.join('')}</ul>`;
}

export function getPaginationHtml(totalPages, currentPages) {
    const html = [];

    if (totalPages > 9) {
        if (currentPages <= 5) {
            for (let i = 0; i < 7; i++) {
                html[i] =
                    i + 1 === currentPages
                        ? `<li class="page-list__page-item page-item page-item--active">${
                              i + 1
                          }</li>`
                        : `<li class="page-list__page-item page-item" data-page="${
                              i + 1
                          }">${i + 1}</li>`;
            }
            html.push(
                `<li class="page-list__page-item page-item page-item__more">...</li>`
            );
            html.push(
                `<li class="page-list__page-item page-item" data-page="${totalPages}">${totalPages}</li>`
            );
        } else if (currentPages >= totalPages - 4) {
            for (let i = 0; i < 7; i++) {
                html[6 - i] =
                    totalPages - i === currentPages
                        ? `<li class="page-list__page-item page-item page-item--active">${
                              totalPages - i
                          }</li>`
                        : `<li class="page-list__page-item page-item" data-page="${
                              totalPages - i
                          }">${totalPages - i}</li>`;
            }
            html.unshift(
                `<li class="page-list__page-item page-item page-item__more">...</li>`
            );
            html.unshift(
                `<li class="page-list__page-item page-item" data-page="1">1</li>`
            );
        } else {
            for (let i = 0; i < 5; i++) {
                html[i] =
                    i === 2
                        ? `<li class="page-list__page-item page-item page-item--active">${currentPages}</li>`
                        : `<li class="page-list__page-item page-item" data-page="${
                              currentPages - 2 + i
                          }">${currentPages - 2 + i}</li>`;
            }
            html.unshift(
                `<li class="page-list__page-item page-item page-item__more">...</li>`
            );
            html.unshift(
                `<li class="page-list__page-item page-item" data-page="1">1</li>`
            );
            html.push(
                `<li class="page-list__page-item page-item page-item__more">...</li>`
            );
            html.push(
                `<li class="page-list__page-item page-item" data-page="${totalPages}">${totalPages}</li>`
            );
        }
    } else {
        for (let i = 1; i <= totalPages; i++) {
            html[i] =
                i === currentPages
                    ? `<li class="page-list__page-item page-item page-item--active">${currentPages}</li>`
                    : `<li class="page-list__page-item page-item" data-page="${i}">${i}</li>`;
        }
    }
    if (currentPages > 1) {
        html.unshift(
            `<li class="page-list__page-item page-item" data-page="${
                currentPages - 1
            }"><</li>`
        );
    }

    if (currentPages < totalPages) {
        html.push(
            `<li class="page-list__page-item page-item" data-page="${
                currentPages + 1
            }">></li>`
        );
    }
    return html.join('');
}

export function getSearchHtml() {
    return `
	<div class="search-box">
		<form class="search-form">
			<input
				name="film"
				class="search-form__input input"
				id="search"
				type="text"
				name="search"
				autocomplete="off"
				placeholder="Найти фильм..."
			/>
			<button type="submit"
				class="search-form__btn btn"
				id="goSearch">
			</button>
		</form>
	</div>
	`;
}
