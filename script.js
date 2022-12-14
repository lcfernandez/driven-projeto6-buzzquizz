/* file structure:

- global variables

- assignments

- calls

- functions

- events */

/* ---------- global variables ---------- */

const urlApi = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const quizzpage = document.querySelector(".c-quizzpage");
const homepage = document.querySelector(".c-homepage");
const createPage = document.querySelector(".c-create-quizz");
let lastQuizz = {};
let quizzAnswers = [];
let quizzAnswersUl = "";
let answeredQuestions = 0;
let numberOfQuestions = 0;
let quizzData = {};
let pontuation = 0;
let quantityLevelsCreation = 0;
let createQuizzData = {
    title: "",
    image: "",
    questions: [],
    levels: [],
};
let userQuizzes = [];

/* ---------- assignments ---------- */

/* ---------- calls ---------- */

listQuizzes();

/* ---------- functions ---------- */

// Homepage

function startLoading() {
    document.querySelector(".c-loading").classList.remove("is-inactive");
    document.querySelector(".c-homepage").classList.add("is-inactive");
    document.querySelector(".c-create-quizz").classList.add("is-inactive");
}

function endLoading() {
    document.querySelector(".c-loading").classList.add("is-inactive");
    document.querySelector(".c-homepage").classList.remove("is-inactive");
    document.querySelector(".c-create-quizz").classList.remove("is-inactive");
}

function listYourQuizzes() {
    const yourQuizzesSerialized = localStorage.getItem("userQuizzes");
    const yourQuizzes = JSON.parse(yourQuizzesSerialized);

    let yourQuizzesList = "";

    const yourQuizzesElement = document.querySelector(
        ".c-homepage__your-quizzes"
    );
    yourQuizzesElement.innerHTML = "";

    if (yourQuizzes === null || yourQuizzes.length === 0) {
        yourQuizzesElement.innerHTML = `
            <div class="create-quizz">
                <span>Você não criou nenhum quizz ainda :(</span>
                <button class="create-quizz__button" onclick="criarQuizz()">
                    Criar Quizz
                </button>
            </div>
        `;
        endLoading();
        document.querySelector(".c-create-quizz").classList.add("is-inactive");
    } else {
        let promise = {};

        yourQuizzes.forEach((quizz) => {
            promise = axios
                .get(`${urlApi}/${quizz.id}`)
                .then((res) => {
                    yourQuizzesList += `
                        <li
                            class="lista-quizz__item"
                            onclick="openQuizz(this)"
                            data-id="${res.data.id}"
                        >
                            <img src="${res.data.image}" alt="Capa do quizz" />
                            <div class="c-quizzes-list__gradient"></div>
                            <h2>${res.data.title}</h2>
                        </li>
                    `;
                    {/* <nav class="lista-quizz__nav">
                        <ion-icon
                            name="create-outline"
                            onclick="editQuizz()"
                        ></ion-icon>
                        <ion-icon
                            name="trash-outline"
                            onclick="deleteQuizz()"
                        ></ion-icon>
                    </nav> */}
                })
                .catch((err) => {
                    console.error(err);
                });
        });

        setTimeout(() => {
            yourQuizzesElement.innerHTML += `
                <div class="your-quizzes__content">
                    <div class="your-quizzes">
                        <div class="your-quizzes__title">
                            <span>Seus Quizzes</span>
                            <ion-icon
                                name="add-circle"
                                onclick="criarQuizz()"
                            ></ion-icon>
                        </div>
                        <ul class="lista-quizz">
                            ${yourQuizzesList}
                        </ul>
                    </div>
                </div>
            `;
            endLoading();
            document.querySelector(".c-create-quizz").classList.add("is-inactive");
        }, 400);
    }
}

function listQuizzes() {
    startLoading();

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

    listYourQuizzes();
}

// Quizzpage

function getAndSortAnswers(question) {
    quizzAnswers = [];
    question.answers.forEach((option) => {
        quizzAnswers.push(`
        <li
            class="c-question__answer"
            data-isCorrectAnswer="${option.isCorrectAnswer}"
            onclick="answerQuestion(this)"
        >
            <img src="${option.image}" alt="Representação da opção de resposta">
            <div class="c-question__foreground is-inactive"></div>
            <p>${option.text}</p>
        </li>
        `);
    });

    quizzAnswers.sort(() => Math.random() - 0.5);

    quizzAnswersUl = "";
    quizzAnswers.forEach((answer) => {
        quizzAnswersUl += answer;
    });
}

function openQuizz(quizz) {
    lastQuizz = quizz;
    const quizzId = quizz.dataset.id;
    let renderedQuestions = 0;
    pontuation = 0;
    answeredQuestions = 0;

    quizzpage.innerHTML = "";

    startLoading();
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
                    <div class="c-quizzpage__title">
                        <h3>${question.title}</h3>
                    </div>
                    <ul class="c-question__options">
                        ${quizzAnswersUl}
                    </ul>
                </div>
                `;

                renderedQuestions++;
                const questionTitleElement = quizzpage
                    .querySelector(
                        `.c-question:nth-of-type(${renderedQuestions})`
                    )
                    .querySelector(".c-quizzpage__title");
                questionTitleElement.style.backgroundColor = question.color;
            });

            numberOfQuestions = res.data.questions.length;
            quizzData = res.data;

            endLoading();
            homepage.classList.add("is-inactive");
            createPage.classList.add("is-inactive");
            quizzpage.classList.remove("is-inactive");
        })
        .catch((err) => {
            console.error(err);
        });
}

function endQuizz() {
    pontuation = Math.round((pontuation / numberOfQuestions) * 100);
    let bestLevel = {};

    quizzData.levels.forEach((level) => {
        const pontuationHigherThanLevel = pontuation >= level.minValue;
        const firstLevelChecked = bestLevel.minValue === undefined;
        const levelHigherThanCurrentBest = bestLevel.minValue < level.minValue;

        if (
            pontuationHigherThanLevel &&
            (firstLevelChecked || levelHigherThanCurrentBest)
        ) {
            bestLevel = level;
        }
    });

    quizzpage.innerHTML += `
        <div class="c-quizzpage__result">
            <div class="c-quizzpage__title">
                <h3>
                    ${pontuation}% de acerto: ${bestLevel.title}
                </h3>
            </div>
            <div class="c-quizzpage__img-text">
                <img src="${bestLevel.image}" alt="Representação do seu nível no quizz" />
                <p>${bestLevel.text}</p>
            </div>
        </div>
        <button class="c-next-step" onclick="openQuizz(lastQuizz)">Reiniciar Quizz</button>
        <button class="c-return-home" onclick="returnHome()">Voltar para home</button>
    `;

    document.querySelector(".c-quizzpage").scrollIntoView({
        block: "end",
        behavior: "smooth",
        inline: "start",
    });
}

function scrollToNextQuestion() {
    const nextQuestion = quizzpage.querySelector(
        `.c-question:nth-of-type(${answeredQuestions + 1})`
    );

    if (nextQuestion !== null) {
        nextQuestion.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
}

function answerQuestion(selected) {
    const eachOptionElement = Object.values(selected.parentNode.children);

    // add foreground to the images and red to the text
    const allOptions = selected.parentNode;
    allOptions.classList.add("is-answered");

    eachOptionElement.forEach((optionElement) => {
        optionElement.setAttribute("onclick", "");

        // change the color of the correct answer to green
        const isCorrectAnswer =
            optionElement.dataset.iscorrectanswer === "true";
        if (isCorrectAnswer) {
            optionElement.classList.add("is-correct");
        }

        // remove the foreground of the selected option
        const wasSelected = optionElement === selected;
        if (wasSelected) {
            optionElement.classList.add("is-selected");
        }
    });

    // score if correct
    if (selected.classList.contains("is-correct")) {
        pontuation++;
    }

    // scroll to next question or end quizz
    answeredQuestions++;
    if (numberOfQuestions === answeredQuestions) {
        setTimeout(endQuizz, 2000);
    } else {
        setTimeout(scrollToNextQuestion, 2000);
    }
}

function returnHome() {
    homepage.classList.remove("is-inactive");

    const inactivate = function (element) {
        if (!element.classList.contains("is-inactive")) {
            element.classList.add("is-inactive");
        }
    };

    inactivate(quizzpage);
    inactivate(createPage);
    inactivate(createPage.querySelector(".c-create-success__content"));

    document.querySelector(".c-homepage__your-quizzes").scrollIntoView({
        block: "center",
    });

    listQuizzes();
}

// Create Quizz

function criarQuizz() {
    const paginaInicial = document.querySelector(".c-homepage");
    paginaInicial.classList.add("is-inactive");

    const abaCriarQuizz = document.querySelector(".c-create-quizz");
    abaCriarQuizz.classList.remove("is-inactive");
    abaCriarQuizz
        .querySelector(".c-create-quizz__content")
        .classList.remove("is-inactive");
}

function openLevel(button) {
    const levelNumber = button.parentNode;
    const sectionLevel = levelNumber.parentNode;

    levelNumber.querySelector("img").remove();

    sectionLevel.innerHTML += `
        <div class="c-fields">
            <input type="text" placeholder="Texto do nível"/>
            <input type="number" placeholder="% de acerto mínima"/>
            <input type="text" placeholder="URL da imagem do nível"/>
            <textarea style="resize: vertical" placeholder="Descrição do nível"></textarea>
        </div>
        <!-- c-fields -->
    `;
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
                <input type="text" placeholder="Resposta correta"/>
                <input type="text" placeholder="URL da imagem"/>
            </div>
            <!-- c-fields -->
        </section>

        <section class="s-wrong-answers">
            <h2>Respostas incorretas</h2>

            <div class="c-fields">
                <input type="text" placeholder="Resposta incorreta 1"/>
                <input type="text" placeholder="URL da imagem 1"/>
            </div>
            <!-- c-fields -->

            <div class="c-fields">
                <input type="text" placeholder="Resposta incorreta 2"/>
                <input type="text" placeholder="URL da imagem 2"/>
            </div>
            <!-- c-fields -->

            <div class="c-fields">
                <input type="text" placeholder="Resposta incorreta 3"/>
                <input type="text" placeholder="URL da imagem 3"/>
            </div>
            <!-- c-fields -->
        </section>
    `;
}

function returnArrayValues(array) {
    const newArray = [];

    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i].value);
    }

    return newArray;
}

function validateBasicInfo() {
    const quizTitle = document.querySelector(
        ".c-form-quizz input:nth-child(1)"
    ).value;
    const quizUrl = document.querySelector(
        ".c-form-quizz input:nth-child(2)"
    ).value;
    const quantityQuestions = document.querySelector(
        ".c-form-quizz input:nth-child(3)"
    ).value;
    const quantityLevels = document.querySelector(
        ".c-form-quizz input:nth-child(4)"
    ).value;

    const validateTitle = function () {
        if (quizTitle.length < 20 || quizTitle.length > 65) {
            return false;
        }

        return true;
    };

    const validateQuantityQuestions = function () {
        if (quantityQuestions < 3) {
            return false;
        }

        return true;
    };

    const validateQuantityLevels = function () {
        if (quantityLevels < 2) {
            return false;
        }

        return true;
    };

    if (
        !(
            validateTitle() &&
            validateURL(quizUrl) &&
            validateQuantityQuestions() &&
            validateQuantityLevels()
        )
    ) {
        alert("Preencha os dados corretamente!");
    } else {
        document
            .querySelector(".c-create-quizz__content")
            .classList.add("is-inactive");
        document
            .querySelector(".c-create-questions__content")
            .classList.remove("is-inactive");

        const cQuestions = document.querySelector(".c-questions");

        for (let i = 1; i <= quantityQuestions; i++) {
            cQuestions.innerHTML += `
                <div class="c-form-quizz">
                    <section class="s-question">
                        <div class="c-question__number">
                            <h2>Pergunta ${i}</h2> <img src="./img/far-fa-edit.svg" onclick="openQuestion(this)" class="b-open-question" />
                        </div>
                    </section>
                    <!-- s-question -->
                </div>
                <!-- c-form-quizz -->
            `;
        }

        openQuestion(document.querySelector(".b-open-question"));

        quantityLevelsCreation = quantityLevels;
        createQuizzData.title = quizTitle;
        createQuizzData.image = quizUrl;

        document.querySelector(".c-form-quizz input:nth-child(1)").value = "";
        document.querySelector(".c-form-quizz input:nth-child(2)").value = "";
        document.querySelector(".c-form-quizz input:nth-child(3)").value = "";
        document.querySelector(".c-form-quizz input:nth-child(4)").value = "";
    }
}

function validateLevels() {
    const forms = document.querySelectorAll(".c-levels .c-form-quizz");

    const validateInfo = function () {
        const levelsMinValues = [];

        for (let i = 0; i < forms.length; i++) {
            const levelText = forms[i].querySelector(
                ".s-level input:nth-child(1)"
            ).value;
            const levelPercentage = Number(
                forms[i].querySelector(".s-level input:nth-child(2)").value
            );
            const levelURL = forms[i].querySelector(
                ".s-level input:nth-child(3)"
            ).value;
            const levelDescription =
                forms[i].querySelector(".s-level textarea").value;

            const validateLevelText = (element) => element.length >= 10;
            const validateLevelPercentage = (element) =>
                element >= 0 &&
                element <= 100 &&
                !levelsMinValues.includes(element);
            const validateLevelDescription = (element) => element.length >= 30;

            if (
                validateLevelText(levelText) &&
                validateLevelPercentage(levelPercentage) &&
                validateURL(levelURL) &&
                validateLevelDescription(levelDescription)
            ) {
                levelsMinValues.push(levelPercentage);

                const objectLevel = {
                    title: levelText,
                    image: levelURL,
                    text: levelDescription,
                    minValue: levelPercentage,
                };

                createQuizzData.levels.push(objectLevel);
            } else {
                return false;
            }
        }

        return levelsMinValues.includes(0) ? true : false;
    };

    if (validateInfo()) {
        startLoading();

        const quizzSuccessPosition = document.querySelector(".c-success ul");
        quizzSuccessPosition.innerHTML = "";

        const promise = axios.post(urlApi, createQuizzData);
        promise.then((res) => {
            createQuizzData = {
                title: "",
                image: "",
                questions: [],
                levels: [],
            };

            const userQuizz = res.data;
            const serializedUserQuizzes = localStorage.getItem("userQuizzes");
            let userQuizzes = [];

            if (serializedUserQuizzes) {
                userQuizzes = JSON.parse(serializedUserQuizzes);
            }

            userQuizzes.push(userQuizz);

            const userQuizzesSerialized = JSON.stringify(userQuizzes);

            localStorage.setItem("userQuizzes", userQuizzesSerialized);

            quizzSuccessPosition.innerHTML += `
                <li
                    class="c-quizzes-list__item"
                    onclick="openQuizz(this)"
                    data-id="${userQuizz.id}"
                >
                    <img
                        src="${userQuizz.image}"
                    />
                    <div class="c-quizzes-list__gradient"></div>
                    <h2>${userQuizz.title}</h2>
                </li>
            `;

            forms.forEach((element) => element.remove());

            endLoading();
            document.querySelector(".c-homepage").classList.add("is-inactive");
            document
                .querySelector(".c-create-levels__content")
                .classList.add("is-inactive");
            document
                .querySelector(".c-create-success__content")
                .classList.remove("is-inactive");
        });

        promise.catch((err) => {
            console.error(err);
        });
    } else {
        alert("Preencha as informações corretamente!");
        createQuizzData.levels = [];
    }
}

function successBackHome() {
    document
        .querySelector(".c-create-success__content")
        .classList.add("is-inactive");
    document
        .querySelector(".c-create-quizz__content")
        .classList.remove("is-inactive");
    document.querySelector(".c-create-quizz").classList.add("is-inactive");
    document.querySelector(".c-homepage").classList.remove("is-inactive");

    listQuizzes();
}

function validateQuestions() {
    const forms = document.querySelectorAll(".c-questions .c-form-quizz");

    const validateInfo = function () {
        for (let i = 0; i < forms.length; i++) {
            const questionText = forms[i].querySelector(
                ".s-question input:nth-child(1)"
            ).value;
            const questionColor = forms[i].querySelector(
                ".s-question input:nth-child(2)"
            ).value;
            const rightAnswerText = forms[i].querySelector(
                ".s-right-answer input:nth-child(1)"
            ).value;
            const rightAnswerURL = forms[i].querySelector(
                ".s-right-answer input:nth-child(2)"
            ).value;
            const wrongAnswers = forms[i].querySelectorAll(
                ".s-wrong-answers .c-fields"
            );
            const wrongAnswersArray = [];

            const validateColor = /^#([0-9a-f]{3}){1,2}$/i;

            const validateQuestionText = (element) => element.length >= 20;
            const validateNotEmptyInput = (element) => element.length != "";

            const validateWrongAnswers = function () {
                for (let j = 0; j < 3; j++) {
                    const wrongAnswerText =
                        wrongAnswers[j].querySelector(
                            "input:nth-child(1)"
                        ).value;
                    const wrongAnswerURL =
                        wrongAnswers[j].querySelector(
                            "input:nth-child(2)"
                        ).value;

                    if (
                        validateNotEmptyInput(wrongAnswerText) &&
                        validateURL(wrongAnswerURL)
                    ) {
                        const wrongAnswer = {
                            text: wrongAnswerText,
                            image: wrongAnswerURL,
                            isCorrectAnswer: false,
                        };

                        wrongAnswersArray.push(wrongAnswer);
                    } else if (
                        !(wrongAnswerText === "" && wrongAnswerURL === "")
                    ) {
                        return false;
                    }
                }

                return wrongAnswersArray.length > 0 ? true : false;
            };

            if (
                validateQuestionText(questionText) &&
                validateColor.test(questionColor) &&
                validateNotEmptyInput(rightAnswerText) &&
                validateURL(rightAnswerURL) &&
                validateWrongAnswers()
            ) {
                const objectQuestion = {
                    title: questionText,
                    color: questionColor,
                    answers: [
                        {
                            text: rightAnswerText,
                            image: rightAnswerURL,
                            isCorrectAnswer: true,
                        },
                    ],
                };

                wrongAnswersArray.forEach((element) =>
                    objectQuestion.answers.push(element)
                );
                createQuizzData.questions.push(objectQuestion);
            } else {
                return false;
            }
        }

        return true;
    };

    if (validateInfo()) {
        document
            .querySelector(".c-create-questions__content")
            .classList.add("is-inactive");
        document
            .querySelector(".c-create-levels__content")
            .classList.remove("is-inactive");

        const cLevels = document.querySelector(".c-levels");

        for (let i = 1; i <= quantityLevelsCreation; i++) {
            cLevels.innerHTML += `
                <div class="c-form-quizz">
                    <section class="s-level">
                        <div class="c-level__number">
                            <h2>Nível ${i}</h2> <img src="./img/far-fa-edit.svg" onclick="openLevel(this)" class="b-open-level" />
                        </div>
                    </section>
                    <!-- s-level -->
                </div>
                <!-- c-form-quizz -->
            `;
        }

        openLevel(document.querySelector(".b-open-level"));

        forms.forEach((element) => element.remove());
    } else {
        alert("Preencha as informações corretamente!");
        createQuizzData.questions = [];
    }
}

function validateURL(url) {
    let test;

    try {
        test = new URL(url);
    } catch (_) {
        return false;
    }

    return test.protocol === "http:" || test.protocol === "https:";
}

function editQuizz(){
    alert("Funcionalidade em construção...");
    returnHome();
}

function deleteQuizz(){
    alert("Funcionalidade em construção...");
    returnHome();
}

/* ---------- events ---------- */
