import { BODY, LOGO_SVG } from './../constants/root.js';
import Search from './Search.js';

class Header {
    render() {
        if (document.querySelector('.header')) return;

        const wrapperHtml = document.createElement('header');

        let innerHtml = `
		<div class="header__container container">
			<div class="header__product-use"></div>
			<a class="header__logo" href="http://localhost:3001/">
				${LOGO_SVG}
			</a>
		</div>
		`;

        wrapperHtml.classList.add('header');
        wrapperHtml.insertAdjacentHTML('afterbegin', innerHtml);

        BODY.prepend(wrapperHtml);

        Search.render();
        Search.addEvent();
    }
}

export default new Header();
