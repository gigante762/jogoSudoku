
let GAME_SUDOKU;

function gerarJogo(arrjogo, tds)
{
    segundos = 0;
    minutos = 0;

    /* Reseta todas as tds */
    /* Gera os espaços no tabuleiro e as casas fixas */
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            
            let index = i*9+j

            tds[index].classList.remove('td-fix');
            tds[index].classList.remove('td-nofix');
            tds[index].classList.remove('wrong');

            tds[index].removeAttribute('fix')
            
            if (arrjogo[i][j]==0)
            { 
                tds[index].classList.add('td-nofix');
                tds[index].innerText = ' ';
            }
            else
            {
                tds[index].setAttribute('fix',true);
                tds[index].classList.add('td-fix');
                tds[index].innerText = arrjogo[i][j];
            }


        }
    }
}


function gerarJogoBtn()
{
    GAME_SUDOKU = new GameSudoku(Number(dificultEle.value));
    gerarJogo(GAME_SUDOKU.getTAb(), tds);

    let tabseed = GAME_SUDOKU.getSeed();
    
    document.getElementById('seedtext').innerText = tabseed;
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

function get2DTabAtual(){ 
    
    let arr = [];
    for (let i = 0; i < 9; i++) {
        let tmp = [];
        for (let j = 0; j < 9; j++) {
            tmp.push(Number(tds[i*9+j].innerText))
        }
        arr.push(tmp);
    }
    return arr;
}

function criarJogoPelaSeed(strseed)
{
    document.getElementById('seedtext').innerText = strseed;
    GAME_SUDOKU = new GameSudoku(Number(dificultEle.value), strseed);

    gerarJogo(GAME_SUDOKU.tab, tds);

    document.getElementById('seedtext').innerText = tabseed;
    document.querySelector('.geragame').innerHTML = '';

    playTempo();
}


function validarJogo()
{
    clearInterval(timerTimer);
    
    // pegar todos os dados do tabuleiro e faz as verificações;
    let wrongPositions  = GAME_SUDOKU.validateGame(get2DTabAtual());
    
    /* Itera sobre de cada item */
    for (const wrongPosition of wrongPositions) {
        let span = document.createElement('span');
        span.innerText = GAME_SUDOKU.sol[wrongPosition.y][wrongPosition.x]
        span.classList.add('nsol');

        tds[wrongPosition.y*9 + wrongPosition.x].classList.add('wrong');
        tds[wrongPosition.y*9 + wrongPosition.x].appendChild(span);
        
        
    }


    let geragame = document.querySelector('.geragame');

    if (geragame.innerHTML != '')
        return;

    geragame.innerHTML  = geragamebkp

}




