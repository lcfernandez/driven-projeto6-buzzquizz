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

// Create Quizz

function criarQuizz(){
    const caixaCriarQuizz = document.querySelector(".create-quizz")
    caixaCriarQuizz.classList.add("is-inactive");

    const paginaInicial = document.querySelector(".c-homepage__content");
    paginaInicial.classList.add("is-inactive");

    const abaCriarQuizz = document.querySelector(".c-create-quizz");
    abaCriarQuizz.classList.remove('is-inactive');
}

function openQuestion(button) {
    const questionNumber = button.parentNode;
    const sectionQuestion = questionNumber.parentNode;
    const formQuestion = sectionQuestion.parentNode;

    questionNumber.querySelector("img").remove();

    sectionQuestion.innerHTML += `
        <div class="c-fields">
            <input type="text" placeholder="Texto da pergunta"/>
            <input type="text" placeholder="Cor de fundo da pergunta"/>
        </div>
        <!-- c-fields -->
    `;

    formQuestion.innerHTML += `
        <section class="s-right-answer">
            <h2>Resposta correta</h2>

            <div class="c-fields">
                <input type="text" placeholder="Texto da pergunta"/>
                <input type="text" placeholder="Cor de fundo da pergunta"/>
            </div>
            <!-- c-fields -->
        </section>

        <section class="s-wrong-answers">
            <h2>Respostas incorretas</h2>

            <div class="c-fields">
                <input type="text" placeholder="Texto da pergunta"/>
                <input type="text" placeholder="Cor de fundo da pergunta"/>
            </div>
            <!-- c-fields -->

            <div class="c-fields">
                <input type="text" placeholder="Texto da pergunta"/>
                <input type="text" placeholder="Cor de fundo da pergunta"/>
            </div>
            <!-- c-fields -->

            <div class="c-fields">
                <input type="text" placeholder="Texto da pergunta"/>
                <input type="text" placeholder="Cor de fundo da pergunta"/>
            </div>
            <!-- c-fields -->
        </section>
    `;
}

function validateBasicInfo() {
    const quizTitle = document.querySelector(".c-form-quizz input:nth-child(1)").value;
    const quizUrl = document.querySelector(".c-form-quizz input:nth-child(2)").value;
    const quantityQuestions = document.querySelector(".c-form-quizz input:nth-child(3)").value;
    const quantityLevels = document.querySelector(".c-form-quizz input:nth-child(4)").value;

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
        document.querySelector(".c-create-quizz__content").classList.add("is-inactive");
        document.querySelector(".c-create-questions__content").classList.remove("is-inactive");

        const cQuestions = document.querySelector(".c-questions");

        for (let i = 1; i <= quantityQuestions; i++) {
            cQuestions.innerHTML += `
                <div class="c-form-quizz">
                    <section class="s-question">
                        <div class="c-question__number">
                            <h2>Pergunta ${i}</h2> <img src="./far-fa-edit.svg" onclick="openQuestion(this)" class="b-open-question" />
                        </div>
                    </section>
                    <!-- s-question -->
                </div>
                <!-- c-form-quizz -->
            `;
        }

        openQuestion(document.querySelector(".b-open-question"));

        const objectQuizz = {
            title: quizTitle,
            image: quizUrl,
            questions: quantityQuestions,
            levels: quantityLevels
        }

        console.log(objectQuizz);
    }
}

function validateQuestionsInfo() {
}

/* ---------- events ---------- */
