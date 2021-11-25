
let GAME_SUDOKU = {};

GAME_SUDOKU.getSolution = function(){
    return GAME_SUDOKU.sol;
}



function gerarJogo(arrjogo, tds)
{

    segundos = 0;
    minutos = 0;
    let tdi = 0;

    /* Faz a comparação de cada item */
    for (let i = 0; i < 81; i++) {
        
        tds[i].classList.remove('wrong');
        tds[i].classList.remove('selected');
        tds[i].classList.remove('td-fix');
        tds[i].classList.remove('td-nofix');
        tds[i].removeAttribute('fix')

        tds[i].classList.add('td-nofix');
        
        //tds[i].classList.remove('td-nofix');

        
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
    GAME_SUDOKU.tab  = sudoku.getBoard();
    GAME_SUDOKU.sol  = sudoku.getSolution();

    let tabseed = generateTabSeed(OnedTabAtual(), GAME_SUDOKU.sol);
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

function OnedTabAtual(){ 
    let arr = [];

    for (const td of tds) {
        arr.push(Number(td.innerText))
    }

    return arr;
}

/* Gera um key desse jogo para ser compartilhada
*/
function generateTabSeed(oneDtab,tabsolution)
{
    let gameSol = [];

    for (let j = 0; j < 9; j++) {
        gameSol.push(  ...tabsolution[j] )
    }

    let key = Math.floor((Math.random()*100))

   /*  console.log(key);
    console.log(oneDtab);
    console.log(gameSol); */

    let tabsolPlusKey = gameSol.map((n)=>n+key)
    let tabsolPlusHex = tabsolPlusKey.map((n)=>n.toString(16)).join(',');

    return `${key.toString(16)}:${oneDtab.join('')}:${tabsolPlusHex}`;

}

function decodeTabSeed(strseed)
{ 
    let parts = strseed.split(':')
    console.log(parts);

    let key = parseInt(parts[0], 16);
    console.log(key);
    
    let tab = (parts[1].split('')).map((n)=> (parseInt(n, 16) ))
    console.log(tab);
    
    let tabsol = parts[2].split(',').map((n)=> (parseInt(n, 16)-key ))
    console.log(tabsol);

    return [tab,tabsol];
}

function criarJogoPelaSeed(strseed)
{
    document.getElementById('seedtext').innerText = strseed;
    let r = decodeTabSeed(strseed);

    let tab2d = [];
    let tabSol = [];

    for(let i = 0; i<9;i++)
    {  
        let tmp = []
        for(let j = 0; j<9;j++)
        { 
            tmp.push(r[1].shift())
        }
        tabSol.push(tmp);
    }

    for(let i = 0; i<9;i++)
    {  
        let tmp = []
        for(let j = 0; j<9;j++)
        { 
            tmp.push(r[0].shift())
        }
        tab2d.push(tmp);
    }

    GAME_SUDOKU.sol = JSON.parse(JSON.stringify(tabSol))
    GAME_SUDOKU.tab = JSON.parse(JSON.stringify(tab2d))

    gerarJogo(GAME_SUDOKU.tab, tds);

    document.querySelector('.geragame').innerHTML = '';

    playTempo();
}


function validarJogo()
{
    pausarTempo();
    
    // pegar todos os dados e jogar pra array
    let arr = OnedTabAtual();
    

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

            <label for="">Seed Jogo</label>
            <textarea name="" id="seed" cols="30" rows="10"></textarea>
            <button onclick="criarJogoPelaSeed(seed.value)">Gerar pela seed</button>
    `

}




