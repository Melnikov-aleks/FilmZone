import { BODY } from '../constants/root';

import Slider from './Slider';
import Tabs from './Tabs';
import Films from './Films';

class Content {
    render() {
        const url = new URL(document.location.href);

        console.warn('Content render');

        if (!document.querySelector('.main')) {
            const Main = document.createElement('main');
            Main.classList.add('main');

            Main.insertAdjacentHTML(
                'afterbegin',
                '<div class="main__container container"></div>'
            );

            BODY.append(Main);
        }

        switch (url.searchParams.get('do')) {
            case 'details':
                this.deleteSlider();
                this.clearMain();

                Films.renderDetails();
                break;
            case 'search':
                this.deleteSlider();
                this.clearMain();

                Films.renderCards();
                break;
            default:
                this.deleteSlider();
                this.clearMain();

                Slider.render();
            // Tabs.render();
            // Films.renderCards();
        }
    }
    deleteSlider() {
        while (document.querySelector('.slider')) {
            document.querySelector('.slider').remove();
        }
    }
    clearMain() {
        while (document.querySelector('.main__container').firstChild) {
            document.querySelector('.main__container').firstChild.remove();
        }
    }
}

export default new Content();
