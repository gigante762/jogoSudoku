/* sons */
let writeSound = new Audio("write.wav");
let eraseSound = new Audio("erase.wav");

/* Adiconar eventos das tabelas */
let tds = document.querySelectorAll('td');

// ultima div selecionada
let lasSelectedTd;

let dificultEle = document.getElementById('dificulty');
let pauseBtn = document.getElementById('pauseBtn');

/* variáveis de tempo */
let segundos = 0;
let minutos = 0;

let timer = document.getElementById('timer')
let timerTimer;

let geragamebkp = document.querySelector('.geragame').innerHTML;

tds.forEach((e)=>{

    e.classList.add('td-nofix');
    e.innerText = ' '
    
    e.addEventListener('click',()=>{
        lasSelectedTd.classList.remove('selected');
        e.classList.add('selected');
        lasSelectedTd = e;
    })
})
lasSelectedTd = tds[0];


/* Adiconar eventos dos botões */
let numbersButtons = document.querySelectorAll('.buttons  button.btn');
numbersButtons.forEach((e)=>{

    // da um atrubuto data
    e.setAttribute('data',e.innerText);

    e.addEventListener('click',()=>{

        if (!lasSelectedTd.getAttribute('fix') && lasSelectedTd.innerText == '')
        {
            writeSound.play();
            lasSelectedTd.innerText = e.getAttribute('data')
            //writeSound.currentTime=0;
            
        }

    })
})


// numbersButtons[0] botão de apagar
document.querySelector('.btnErase').addEventListener('click',()=>{

    if (!lasSelectedTd.getAttribute('fix') && !(lasSelectedTd.innerText == '') )
    {
        eraseSound.play();
        lasSelectedTd.innerText = ''
        //eraseSound.currentTime=0;
    }

})

