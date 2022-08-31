/* file structure:

- global variables

- assignments

- calls

- functions

- events */

/* ---------- global variables ---------- */

const urlApi = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const quizzpage = document.querySelector(".c-quizzpage");
let quizzAnswersLi = "";

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

function getAnswers(answer) {
    answer.forEach(()=>{
        console.log(answer)
        /* quizzAnswersLi += `
            <li class="c-question__answer">
                <img src="${answer.image}" alt="Representação da opção de resposta">
                <p>${answer.text}</p>
            </li>
        `; */
    });
}

function openQuizz(quizz) {
    const quizzId = quizz.dataset.id;

    const homepage = document.querySelector(".c-homepage");
    homepage.classList.add("is-inactive");

    quizzpage.classList.remove("is-inactive");

    quizzpage.innerHTML = "";
    quizzAnswersLi = "";

    axios
        .get(`${urlApi}/${quizzId}`)
        .then((res) => {
            console.log(res.data);

            quizzpage.innerHTML = `
            <header class="c-quizzpage__header">
                <img src="${res.data.image}" alt="Capa do quizz" />
                <div class="c-quizzpage__header__foreground"></div>
                <h2>${res.data.title}</h2>
            </header>
        `;

            res.data.questions.forEach((answer) => {
                getAnswers(answer.answers);
            });

            res.data.questions.forEach((question) => {
                quizzpage.innerHTML += `
                <div class="c-question">
                    <div class="c-question__title">
                        <h3>${question.title}</h3>
                    </div>
                    <ul class="c-question__options">
                `;

                question.answers.forEach(renderAnswers);

                quizzpage.innerHTML += `
                    </ul>
                </div>
            `;
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

// Create Quizz

function validateBasicInfo() {
    const quizTitle = document.querySelector(".c-basic-info input:nth-child(1)").value;
    const quizUrl = document.querySelector(".c-basic-info input:nth-child(2)").value;
    const quantityQuestions = document.querySelector(".c-basic-info input:nth-child(3)").value;
    const quantityLevels = document.querySelector(".c-basic-info input:nth-child(4)").value;

    const validateTitle = function() {
        if (quizTitle.length < 20 || quizTitle.length > 65) {
            return false;
        }
    
        return true;
    };

    const validateURL = function() {
        let test;
            
        try {
            test = new URL(quizUrl);
        } catch (_) {
            return false;
        }
          
        return test.protocol === "http:" || test.protocol === "https:";
    };

    const validateQuantityQuestions= function() {
        if (quantityQuestions < 3) {
            return false;
        }
    
        return true;
    };

    const validateQuantityLevels = function() {
        if (quantityLevels < 2) {
            return false;
        }
    
        return true;
    };

    if (!(validateTitle() && validateURL() && validateQuantityQuestions() && validateQuantityLevels())) {
        alert("Preencha os dados corretamente!");
    } else {
        const objectQuizz = {
            title: quizTitle,
            image: quizUrl,
            questions: quantityQuestions,
            levels: quantityLevels
        }

        console.log(objectQuizz);
    }
}

/* ---------- events ---------- */
