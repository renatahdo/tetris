document.addEventListener('DOMContentLoaded', () => {
    let squares = Array.from(document.querySelectorAll('.grid div'))
    let grid = document.querySelector(".grid")
    const ancho = 10 // Ancho del grid, para que las piezas se dibujen en esos cuadros
    // const grid = document.querySelector('.grid') // Cuando se escriba grid, se hace un cambio en cualquier elemento que tenga la clase grid
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let nextRandom = 0;
    let timerId;
    let score = 0;

    const colores = [
        'url(images/bloque_azul.png)',
        'url(images/bloque_morado.png)',
        'url(images/bloque_verde.png)',
        'url(images/bloque_marino.png)',
        'url(images/bloque_rosa.png)'
    ]

    //Piezas y posiciones
    const lTetromino = [
        [1, ancho + 1, ancho * 2 + 1, 2],
        [ancho, ancho + 1, ancho + 2, ancho * 2 + 2],
        [1, ancho + 1, ancho * 2 + 1, ancho * 2],
        [ancho, ancho * 2, ancho * 2 + 1, ancho * 2 + 2]
    ]

    const zTetromino = [
        [0, ancho, ancho + 1, ancho * 2 + 1],
        [ancho + 1, ancho + 2, ancho * 2, ancho * 2 + 1],
        [0, ancho, ancho + 1, ancho * 2 + 1],
        [ancho + 1, ancho + 2, ancho * 2, ancho * 2 + 1]
    ]

    const tTetromino = [
        [1, ancho, ancho + 1, ancho + 2],
        [1, ancho + 1, ancho + 2, ancho * 2 + 1],
        [ancho, ancho + 1, ancho + 2, ancho * 2 + 1],
        [1, ancho, ancho + 1, ancho * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, ancho, ancho + 1],
        [0, 1, ancho, ancho + 1],
        [0, 1, ancho, ancho + 1],
        [0, 1, ancho, ancho + 1],
    ]

    const iTetromino = [
        [1, ancho + 1, ancho * 2 + 1, ancho * 3 + 1],
        [ancho, ancho + 1, ancho + 2, ancho + 3],
        [1, ancho + 1, ancho * 2 + 1, ancho * 3 + 1],
        [ancho, ancho + 1, ancho + 2, ancho + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    // Declarar una variable random para que dibuje cualquiera de los tetraminos
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][0] //La primera forma del tetramino seleccionado

    // Dibujar la primera rotación del tetramino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].style.backgroundImage = colores[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].style.backgroundImage = 'none'
        })
    }

    // Hacer que el tetramino se mueva cada segundo

    // Asignar funciones a las teclas de las flechas.
    function control(e) {
        if(e.keyCode === 37) { // Tecla izquierda
            moveLeft()
        } else if (e.keyCode === 38) { // Tecla arriba
            rotate();
        } else if (e.keyCode === 39) { // Tecla derecha
            moveRight()
        } else if (e.keyCode === 40) { // Tecla abajo
            moveDown()
        }
    }


    document.addEventListener('keydown', control)

    function moveDown() {
        undraw()
        currentPosition += ancho
        draw()
        freeze()
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + ancho].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // Dibujar nuevo tetramino
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw()
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        undraw()
        const bordeIzquierdo = current.some(index => (currentPosition + index) % ancho === 0)
        if(!bordeIzquierdo) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    function moveRight() {
        undraw()
        const bordeDerecho = current.some(index => (currentPosition + index) % ancho === ancho -1)

        if(!bordeDerecho) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    function rotate(){
        undraw();
        currentRotation++;
        if(currentRotation === current.length){
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation]
        draw();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominos = [
        [1, displayWidth+1,displayWidth*2+1,2],
        [0, displayWidth,displayWidth+1,displayWidth*2+1],
        [1, displayWidth,displayWidth+1,displayWidth+2],
        [0, 1,displayWidth,displayWidth+1],
        [1, displayWidth+1,displayWidth*2+1,displayWidth*3+1],
    ]

    function displayShape() {
        displaySquares.forEach((square) => {
            square.style.backgroundImage = 'none'
        });
        upNextTetrominos[nextRandom].forEach((index) => {
            displaySquares[displayIndex+index].style.backgroundImage = colores[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        }else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom  = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    })

    function addScore() {
        for(let i = 0; i<199; i+= ancho){
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
            const fullRow = row.every((index) => squares[index].classList.contains('taken'))

            if(fullRow){
                score+=10;
                scoreDisplay.innerHTML = score;
                row.forEach((index)=> {
                    squares[index].classList.remove('taken');
                    squares[index].style.backgroundImage = 'none'
                });
                const squaresRemoved = squares.splice(i,ancho);
                squares = squaresRemoved.concat(squares);
                squares.forEach((cell) => { grid.appendChild(cell)});
            }
        }
    }

    function gameOver() {
        const fullUpperRow = current.some((index) => squares[currentPosition+index].classList.contains('taken'));

        if(fullUpperRow) {
            scoreDisplay.innerHTML = 'End';
            clearInterval(timerId);
        }
    }

})
