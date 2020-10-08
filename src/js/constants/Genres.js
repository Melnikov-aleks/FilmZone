import { API_KEY } from './api.js';

class Genres {
    async set() {
        if (this.state) return;

        const response = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ru`
        );

        const data = await response.json();

        this.getGenre = {};
        data.genres.forEach((genre) => {
            this.getGenre[genre.id] = genre.name;
        });
        this.state = 'ok';
    }
    async renderGenres(genres) {
        if (!genres.length) return '';

        let innerHtml = '',
            wrapperHtml = '';

        if (typeof genres[0] === 'number') {
            for (const id of genres) {
                const genreName = await this.getById(id);
                innerHtml += `<li class="film-card__genre-item genre-item" data-genre=${id}>${genreName}</li>`;
            }
            wrapperHtml = `<ul class="film-card__genre-list genre-list">${innerHtml}</ul>`;
        } else {
            genres.forEach((genreObj) => {
                innerHtml += `<li class="film-details__genre-item genre-item" data-genre=${genreObj.id}>${genreObj.name}</li>`;
            });
            wrapperHtml = `<h2 class="film-details__label">Жанр</h2>
			<ul class="film-details__desc film-details__genre-list genre-list">${innerHtml}</ul>
			`;
        }

        return wrapperHtml;
    }
    async getById(id) {
        if (!this.state) {
            await this.set();
        }
        return this.getGenre[id];
    }
}

export default new Genres();
