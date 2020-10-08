class Credits {
    renderCrew(crews) {
        //режисер если джоб ===директор
        // сценаристы если джоб === ВОПРОС (департмент врайтинг)
        // продюсеры если джоб рабно продюсер и департмент продакшен

        // ДЛХ ПЯРОВЕРКА НА ПОВТОРЕНИЕ ИМЕН ПРИ ВЫВОДЕ

        console.warn(crews);
        let directors = '';
        let screenplays = '';
        let producers = '';
        let wrapperHtml = '';

        crews.forEach((person) => {
            person.job === 'Director'
                ? (directors += `<li class="film-details__directors-item directors-item" data-person_id=${person.id}>${person.name}</li>`)
                : '';
        });
        console.warn(directors);

        crews.forEach((person) => {
            switch (person.job) {
                case 'Screenplay':
                case 'Author':
                case 'Novel':
                case 'Writer':
                case 'Scenario Writer':
                case 'Story':
                case 'Co-Writer':
                    screenplays += `<li class="film-details__screenplays-item screenplays-item" data-person_id=${person.id}>${person.name}</li>`;
            }
        });

        crews.forEach((person) => {
            person.job.toLowerCase().includes('producer') &&
            person.department === 'Production'
                ? (producers += `<li class="film-details__producers-item producers-item" data-person_id=${person.id}>${person.name}</li>`)
                : '';
        });

        directors
            ? (wrapperHtml += `<h2 class="film-details__label">Режисер</h2>
			<ul class="film-details__desc film-details__directors-list directors-list">${directors}</ul>
			`)
            : false;

        screenplays
            ? (wrapperHtml += `<h2 class="film-details__label">Сценарист</h2>
			<ul class="film-details__desc film-details__screenplays-list screenplays-list">${screenplays}</ul>
			`)
            : false;

        producers
            ? (wrapperHtml += `<h2 class="film-details__label">Продюсер</h2>
			<ul class="film-details__desc film-details__producers-list producers-list">${producers}</ul>
			`)
            : false;
        return wrapperHtml;
        // console.group('Writing');
        // crews.forEach((person) =>
        //     person.department === 'Writing'
        //         ? console.warn(`${person.job} : ${person.name}`)
        //         : ''
        // );
        // console.groupEnd();

        // console.group('Directing');
        // crews.forEach((person) =>
        //     person.department === 'Directing'
        //         ? console.warn(`${person.job} : ${person.name}`)
        //         : ''
        // );
        // console.groupEnd();

        // console.group('Production');
        // crews.forEach((person) =>
        //     person.job.toLowerCase().includes('producer') &&
        //     person.department === 'Production'
        //         ? console.warn(`${person.job} : ${person.name}`)
        //         : ''
        // );
        // console.groupEnd();

        // console.group('Режиссеры');
        // directors.forEach((person) => {
        //     console.warn(`${person.job} : ${person.name}`);
        // });
        // console.groupEnd();

        // console.group('Сценаристы');
        // screenplays.forEach((person) => {
        //     console.warn(`${person.job} : ${person.name}`);
        // });
        // console.groupEnd();

        // console.group('Продюсеры');
        // producers.forEach((person) => {
        //     console.warn(`${person.job} : ${person.name}`);
        // });
        // console.groupEnd();
    }

    renderCasts(casts) {
        console.log(casts);

        let actors = [];
        let wrapperHtml = '';

        casts.forEach((person) => {
            if (person.order < 10)
                actors += `<li class=" film-details__actors-item actors-item" data-person_id=${
                    person.id
                }>${
                    person.name
                }<img class="film-details__actor-img actor-img hide" src="${
                    person.profile_path
                        ? `https://image.tmdb.org/t/p/w185/${person.profile_path}`
                        : `https://dummyimage.com/185x278.jpg&text=Изображение+отсутствует`
                }"></li>`;
            else return;
        });
        actors.length
            ? (wrapperHtml += `<h2 class="film-details__label">Актеры</h2>
			<ul class="film-details__desc film-details__actors-list actors-list">${actors}</ul>
			`)
            : false;

        return wrapperHtml;
    }
}

export default new Credits();
