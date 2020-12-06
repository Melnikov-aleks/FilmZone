export default function titleUpdate(data) {
    const url = new URL(document.location.href);
    switch (url.searchParams.get('do')) {
        case 'details':
            document.title = data.title;
            break;
        case 'search':
            document.title = `Поиск "${url.searchParams.get('q')}"`;
            break;
        default:
            document.title = 'FilmZone';
    }
}
