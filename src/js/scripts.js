import '../styles/style.scss';
import '../../node_modules/slick-carousel/slick/slick.scss';

import App from './components/App.js';

window.addEventListener('popstate', () => App.render());
App.render();
