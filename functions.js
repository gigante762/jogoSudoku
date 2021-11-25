
let GAME_SUDOKU;



function gerarJogo(arrjogo, tds)
{

    segundos = 0;
    minutos = 0;
    let tdi = 0;

    /* Faz a comparação de cada item */
    for (let i = 0; i < 81; i++) {
        
        tds[i].classList.remove('wrong');
        
    }
    
    for (const linha of arrjogo) {
        for (const n of linha) {
            if (n==0)
            { 
                tds[tdi++].innerText = ' ';
            }
            else
            {
                tds[tdi].setAttribute('fix',true);
                tds[tdi].classList.add('td-fix');
                tds[tdi].classList.remove('td-nofix');
                tds[tdi++].innerText = n;
            }
        }
    }
    

}

function gerarJogoBtn()
{
    let sudoku = new Sudoku( Number(dificultEle.value) )
    sudoku.generate();
    /* let jogoAleatorio = (new Sudoku).generate().getBoard() */
    gerarJogo(sudoku.getBoard(), tds);
    GAME_SUDOKU  = sudoku;
    document.querySelector('.geragame').innerHTML = ''

    playTempo();
    
    
}

function playTempo()
{ 
    timerTimer = setInterval(() => {
        segundos++;
        if (segundos == 60)
        { 
            minutos++;
            segundos=0;
        }

        let tmin = (minutos < 10) ? ('0' + minutos) : minutos;
        let tseg = (segundos < 10) ? ('0' + segundos) : segundos;
        timer.innerText = `${tmin}:${tseg} `;
    }, 1000);
}

function pausarTempo()
{ 
    if (pauseBtn.innerText == '||')
    { 
        clearInterval(timerTimer);
        pauseBtn.innerText = '|>'
    }
    else if(pauseBtn.innerText == '|>')
    { 
        playTempo()
        pauseBtn.innerText = '||'
    }
}

function validarJogo()
{
    // pegar todos os dados e jogar pra array
    let arr = [];

    for (const td of tds) {
        arr.push(Number(td.innerText))
    }

    /* faz o unpack da solução */
    let gameSolve = []
    let gameSol = GAME_SUDOKU.getSolution();

    for (let j = 0; j < 9; j++) {
        gameSolve.push(  ...gameSol[j] )
    }

    
    /* Faz a comparação de cada item */
    for (let i = 0; i < 81; i++) {
        
        if (gameSolve[i] != arr[i])
        { 
            tds[i].classList.add('wrong');
        }
        
    }


    //
    let main = document.querySelector('.geragame');

    if (main.innerHTML != '')
        return;

    main.innerHTML += `
    <p>Escolha a dificuldade e clique em gerar jogo.</p>
    <button class='checkGame' onclick="gerarJogoBtn()">Gerar Jogo</button>
    `

}




