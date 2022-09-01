/* file structure:

- global variables

- assignments

- calls

- functions

- events */

/* ---------- global variables ---------- */

const urlApi = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const quizzpage = document.querySelector(".c-quizzpage");
let quizzAnswersLi = [];

/* ---------- assignments ---------- */

/* ---------- calls ---------- */

listQuizzes();

/* ---------- functions ---------- */

// Homepage

function listQuizzes() {
    const quizzListElement = document.querySelector(".c-quizzes-list");
    quizzListElement.innerHTML = "";

    axios
        .get(urlApi)
        .then((res) => {
            res.data.forEach((quizz) => {
                quizzListElement.innerHTML += `
                    <li
                        class="c-quizzes-list__item"
                        onclick="openQuizz(this)"
                        data-id="${quizz.id}"
                    >
                        <img
                            src="${quizz.image}"
                        />
                        <div class="c-quizzes-list__gradient"></div>
                        <h2>${quizz.title}</h2>
                    </li>
                `;
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

function getAndSortAnswers(question) {
    question.answers.forEach((option) => {
        quizzAnswersLi.push(`
        <li class="c-question__answer">
            <img src="${option.image}" alt="Representação da opção de resposta">
            <p>${option.text}</p>
        </li>
        `);
    });

    quizzAnswersLi.sort(() => Math.random() - 0.5);
}

function openQuizz(quizz) {
    const quizzId = quizz.dataset.id;

    const homepage = document.querySelector(".c-homepage");
    homepage.classList.add("is-inactive");

    quizzpage.classList.remove("is-inactive");

    quizzpage.innerHTML = "";

    axios
        .get(`${urlApi}/${quizzId}`)
        .then((res) => {
            quizzpage.innerHTML += `
                <header class="c-quizzpage__header">
                    <img src="${res.data.image}" alt="Capa do quizz" />
                    <div class="c-quizzpage__header__foreground"></div>
                    <h2>${res.data.title}</h2>
                </header>
            `;

            res.data.questions.forEach((question) => {
                getAndSortAnswers(question);

                quizzpage.innerHTML += `
                <div class="c-question">
                    <div class="c-question__title">
                        <h3>${question.title}</h3>
                    </div>
                    <ul class="c-question__options">
                        ${quizzAnswersLi}
                    </ul>
                </div>
                `;

                quizzAnswersLi = [];
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

/* ---------- events ---------- */
