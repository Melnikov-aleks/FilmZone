import getDataAPI from '../utils/getDataAPI.js';
import generateUrlAPI from '../utils/generateUrlAPI.js';
import Films from './Films.js';
import Content from './Content';

// let inputSearch = null;

class Search {
    render() {
        let innerHtml = `
			<input
				class="search-box__search-txt search-txt"
				id="search"
				type="search"
				name="search"
				autocomplete="off"
				placeholder="Найти фильм..."
			/>
			<div
				class="search-box__search-button search-button"
				id="goSearch"
			></div>
		`;

        const wrapperHtml = document.createElement('div');
        wrapperHtml.classList.add('header__search-box', 'search-box');
        wrapperHtml.insertAdjacentHTML('afterbegin', innerHtml);

        document.querySelector('.header__container').append(wrapperHtml);
    }
    async renderDropList(query) {
        const data = await getDataAPI.getData(generateUrlAPI.generate(query));
        console.log(data);

        let innerHtml = '';

        data.results.forEach((film, i) => {
            if (i > 5) return;

            innerHtml += `
			<li class="search-list__search-item search-item">
				<p class="search-item__title">${film.title}</p> 
				<span class="search-item__release">${film.release_date}</span>
			</li>
			`;
        });

        const wrapperHtml = document.createElement('ul');
        wrapperHtml.classList.add('search-box__search-list', 'search-list');
        wrapperHtml.insertAdjacentHTML('afterbegin', innerHtml);
        document.querySelector('.search-box').append(wrapperHtml);
    }
    addEvent() {
        let inputSearch = document.getElementById('search');
        const url = new URL(document.location);

        inputSearch.addEventListener('input', () => {
            while (document.querySelector('.search-list')) {
                document.querySelector('.search-list').remove();
            }
            if (inputSearch.value.trim().length < 3) return;
            this.renderDropList(inputSearch.value.trim());
        });

        inputSearch.addEventListener('blur', () => {
            if (document.querySelector('.search-list')) {
                document.querySelector('.search-list').classList.add('hide');
            }
        });
        inputSearch.addEventListener('focus', () => {
            if (document.querySelector('.search-list')) {
                document.querySelector('.search-list').classList.remove('hide');
            }
        });

        document.getElementById('goSearch').addEventListener('click', () => {
            if (inputSearch.value.trim().length < 3) return;
            console.log(url);
            url.searchParams.set('do', 'search');
            url.searchParams.set('q', inputSearch.value.trim());
            url.searchParams.delete('page');
            url.searchParams.delete('id');
            history.pushState(null, null, url);
            Content.render();
        });
    }
    // addEventBtn() {
    //     inputSearch = document.getElementById('search');
    //     const url = new URL(document.location);

    //     document.getElementById('goSearch').addEventListener('click', () => {
    //         if (inputSearch.value.trim().length < 3) return;
    //         console.log(url);
    //         url.searchParams.set('do', 'search');
    //         url.searchParams.set('q', inputSearch.value.trim());
    //         url.searchParams.delete('page');
    //         url.searchParams.delete('id');
    //         history.pushState(null, null, url);
    //         Films.renderCards();
    //     });
    // }
}

export default new Search();
