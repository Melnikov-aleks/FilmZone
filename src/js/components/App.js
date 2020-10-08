import Films from './Films.js';
import Header from './Header.js';
import Search from './Search.js';
import Content from './Content';
import Genres from '../constants/Genres';

import {} from './../constants/root.js';

class App {
    async render() {
        // this.addEventWindow();
        console.log('render');
        // Genres.set();
        Header.render();
        Content.render();

        // Films.render();
        // Content.render();
        // Footer.render();
        // Films.renderMain();
        // Films.renderSearch();
    }
    // addEventWindow() {
    //     console.log('added');
    //     window.addEventListener('popstate', () => {
    //         console.log('update');
    //         // url = new URL(document.location.href);
    //         this.render();
    //     });
    // }
}

export default new App();
