//load the products.json file
let productsArray = [];
fetch(products)
    .then(response => response.json())
    .then(data => {
        productsArray = data;
    })
    .catch(error => {
        // Handle any errors that occur during the fetch request
        console.error('Error:', error);
    });

// go to the next step
let quiz = document.querySelectorAll('.quiz'),
    next_step = document.querySelectorAll('.quiz__next');

next_step.forEach(function (element) {
    element.addEventListener('click', function () {
        let step = +this.closest('.quiz').getAttribute('data-step');
        quiz.forEach(function (element) {
            element.style.display = 'none';
        });
        document.querySelector(`.quiz[data-step="${step + 1}"]`).style.display = 'block';
    });
});

//go to the prev step
let prev_step = document.querySelectorAll('.quiz__prev');

prev_step.forEach(function (element) {
    element.addEventListener('click', function () {
        let step = +this.closest('.quiz').getAttribute('data-step');
        quiz.forEach(function (element) {
            element.style.display = 'none';
        });
        document.querySelector(`.quiz[data-step="${step - 1}"]`).style.display = 'block';
    });
});

/* let answers = {
    type: ['Spirals', 'Straight'],
    concern: ['Curl care', 'Blonde care', 'Dry & frizzy'],
    style: ['Hair dryer', 'Straightener']
}; */

let answers = {
    type: [],
    concern: [],
    style: []
};

//function to fill the results array
function handleQuizStep(step, answer) {
    for (let key in answers) {
        if (step === key) {
            let index = answers[key].indexOf(answer);
            if (index > -1) {
                answers[key].splice(index, 1); // if the answer is already in the array then delete it
            } else {
                answers[key].push(answer); //adding answer to the array
            }
            break;
        }
    }
}

//click on the answer item
let quiz_answers = document.querySelectorAll('.quiz__answers-item');

quiz_answers.forEach(function (element) {
    element.addEventListener('click', function () {
        let step = this.closest('.quiz').getAttribute('data-question');
        let answer = this.getAttribute('data-answer');
        this.classList.toggle('active');
        handleQuizStep(step, answer);
    });
});

//click the result btn
let quiz_result = document.querySelectorAll('.quiz__result');
// function to render products on the results page
function renderProduct(productName) {
    // searching product by its Name
    const product = productsArray.find((p) => p.name === productName);

    // render
    const productHTML = `
    <div class="results__product">
      <div class="results__product-image">
           <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="row justify-content-between results__product-info">
           <div class="results__product-title">
               ${product.name}
           </div>
           <div class="results__product-price">
               ${product.price}
           </div>
      </div>
      <div class="btn btn--primary results__product-info">
               ADD TO CART
      </div>
    </div>
  `;

    // adding html render to the container
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = productsContainer.innerHTML + productHTML;
    }
}

quiz_result.forEach(function (element) {
    element.addEventListener('click', function () {
        //search for the matching products based on the answers array
        let matchingProducts = productsArray.filter(function (product) {
            for (let step in product.conditions) {
                let productAnswers = product.conditions[step];
                let stepAnswers = answers[step];
                if (!stepAnswers.some(answer => productAnswers.includes(answer))) {
                    return false;
                }
            }
            return true;
        });
        matchingProducts.forEach(function (product) {
            renderProduct(product.name);
        });
        //if the matchingProducts < 1 then show the empty block
        if (Object.keys(matchingProducts).length < 1) {
            document.querySelector('.quiz__results').remove();
            document.querySelector('.quiz__empty').style.display = 'block';
        }
    });
});

//restart the quiz
let restart = document.querySelectorAll('.quiz__restart');

restart.forEach(function (element) {
    element.addEventListener('click', function () {
        quiz.forEach(function (element) {
            element.style.display = 'none';
        });
        document.querySelector(`.quiz[data-step="0"]`).style.display = 'block';
        quiz_answers.forEach(function (element) {
            element.classList.remove('active');
            for (let key in answers) {
                answers[key] = [];
            }
        });
    });
});

//click on the progress bar step
let progress_stage = document.querySelectorAll('.quiz__progress-stage');

progress_stage.forEach(function (element) {
    element.addEventListener('click', function () {
        quiz.forEach(function (element) {
            element.style.display = 'none';
        });
        let new_step = this.getAttribute('data-stage');
        document.querySelector(`.quiz[data-step="${new_step}"]`).style.display = 'block';
    });
});


