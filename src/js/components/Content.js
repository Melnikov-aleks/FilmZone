import MainSlider from './MainSlider';
import { FilmDetails, FilmCards } from './Films';

export default class Content {
    constructor(selector, updateCallback) {
        this.container = document.querySelector(selector);
        this.filmCards = new FilmCards(this.container, updateCallback);
        this.filmDetails = new FilmDetails(this.container, updateCallback);
        this.slider = new MainSlider(this.container, updateCallback);
    }
    render() {
        this.url = new URL(document.location.href);
        this.container.classList.add('loading');

        switch (this.url.searchParams.get('do')) {
            case 'details':
                this.slider.delete();
                this.filmDetails.render();
                break;
            case 'search':
                this.slider.delete();
                this.filmCards.render();
                break;
            default:
                this.slider.render();
                this.filmCards.render();
        }
    }
}
