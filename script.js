/* file structure:

- global variables

- assignments

- calls

- functions

- events */

/* ---------- global variables ---------- */

const urlApi = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

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
            console.log(res.data);
            res.data.forEach((quizz) => {
                console.log(quizz);
                quizzListElement.innerHTML += `
                    <li class="c-quizzes-list__item" onclick="openQuizz(this)">
                        <img
                            src="${quizz.image}"
                        />
                        <div class="c-quizzes-list__gradient"></div>
                        <p>${quizz.title}</p>
                    </li>
                `;
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

function openQuizz(quizz) {
    const homepage = document.querySelector(".c-homepage");
    homepage.classList.add("is-inactive");
}

/* ---------- events ---------- */
