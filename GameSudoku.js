// API, essa classe não é minha.
class Sudoku {
    constructor(hints, limit) {
      this.hints = hints
      this.limit = limit || 10000
  
      this._logs = {
        raw: [],
        incidents: {
          limitExceeded: 0,
          notValid: 0,
          noNumbers: 0
        }
      }
  
      this.success = null

      this.numbers = () =>
        new Array(9)
          .join(" ")
          .split(" ")
          .map((num , i) => i + 1)

      /*
        Will be used in initial map. Each row will be
        consisted of randomly ordered numbers
      */
      this.randomRow = () => {
        var row = []
        var numbers = this.numbers()
        while (row.length < 9) {
          var index = Math.floor(Math.random() * numbers.length)
          row.push(numbers[index])
          numbers.splice(index, 1)
        }

        return row
      }

      /*
        This is the dummy placeholder for the
        final results. Will be overridden through the
        backtracking process, and at the and, this will
        be the real results.
      */
      this.result = new Array(9 * 9)
        .join(" ")
        .split(" ")
        .map(entry => null)

      /*
        Will be used as the nodeTree in the
        process of backtracking. Each cell has 9 alternative
        paths (randomly ordered).
      */
      this.map = new Array(9 * 9)
        .join(" ")
        .split(" ")
        .map(path => this.randomRow())

      /*
        Will be used as history in the backtracking
        process for checking if a candidate number is valid.
      */
      this.stack = []

      return this
    }
  
    toRows(arr) {
      var row = 0
      var asRows = new Array(9)
        .join(" ")
        .split(" ")
        .map(row => [])
  
      for (let [index, entry] of arr.entries()) {
        asRows[row].push(entry)

        if ( !((index + 1) % 9) ) {
          row += 1
        }
      }

      return asRows
    }

    no(path, index, msg) {
      var number = path[path.length - 1]
      this._logs.raw.push(`no: @${index} [${number}] ${msg} ${path} `)
    }

    yes(path, index) {
      this._logs.raw.push(`yes: ${index} ${path}`)
    }
  
    finalLog() {
      console.groupCollapsed('Raw Logs')
      console.groupCollapsed(this._logs.raw)
      console.groupEnd()
      console.groupEnd()
      console.groupCollapsed('Incidents')
      console.groupCollapsed(this._logs.incidents)
      console.groupEnd()
      console.groupEnd()
    }

    getBoard() {
      return this.toRows(this.substractCells())
    }

    getSolution() {
      return this.toRows(this.result)
    }

    substractCells() {
      var _getNonEmptyIndex = () => {
        var index = Math.floor(Math.random() * _result.length)
        return _result[index] ? index : _getNonEmptyIndex()
      }

      var _result = this.result.filter(() => true)

      while (
        _result.length - this.hints >
        _result.filter(n => !n).length
      ) {
        _result[_getNonEmptyIndex()] = ''
      }

      return _result
    }
  
    validate(map, number, index) {
      var rowIndex = Math.floor(index / 9)
      var colIndex = index % 9

      var row = map.slice(
        rowIndex * 9, 9 * (rowIndex + 1)
      )

      var col = map.filter((e, i) =>
        i % 9 === colIndex
      )

      var boxRow = Math.floor(rowIndex / 3)
      var boxCol = Math.floor(colIndex / 3)

      var box = map.filter((e, i) =>
        Math.floor(Math.floor(i / 9) / 3) === boxRow &&
        Math.floor((i % 9) / 3) === boxCol
      )

      return {
        row: {
          first: row.indexOf(number),
          last: row.lastIndexOf(number)
        },
        col: {
          first: col.indexOf(number),
          last: col.lastIndexOf(number)
        },
        box: {
          first: box.indexOf(number),
          last: box.lastIndexOf(number)
        }
      }
    }

    _validate(map, index) {
      if (!map[index].length) {
        return false
      }

      this.stack.splice(index, this.stack.length)
  
      var path = map[index]
      var number = path[path.length - 1]
  
      var didFoundNumber = this.validate(this.stack, number, index)
  
      return (
        didFoundNumber.col.first === -1 &&
        didFoundNumber.row.first === -1 &&
        didFoundNumber.box.first === -1
      )
    }

    _generate(map, index) {
      if (index === 9 * 9) {
        return true
      }

      if (--this.limit < 0) {
        this._logs.incidents.limitExceeded++
        this.no(map[index], index, 'limit exceeded')
        return false
      }

      var path = map[index]

      if (!path.length) {
        map[index] = this.numbers()
        map[index - 1].pop()
        this._logs.incidents.noNumbers++
        this.no(path, index, 'no numbers in it')
        return false
      }

      var currentNumber = path[path.length - 1]

      var isValid = this._validate(map, index)
      if (!isValid) {
        map[index].pop()
        map[index + 1] = this.numbers()
        this._logs.incidents.notValid++
        this.no(path, index, 'is not valid')
        return false
      } else {
        this.stack.push(currentNumber)
      }

      for (let number of path.entries()) {
        if (this._generate(map, index + 1)) {
          this.result[index] = currentNumber
          this.yes(path, index)
          return true
        }
      }

      return false
    }

    generate() {
      if (this._generate(this.map, 0)) {
        this.success = true
      }

      //this.finalLog()

      return this
    }

}

/* Classe GameSudoku */
class GameSudoku{ 

    constructor(hints = 50, seed = null)
    {
        this.tab = [];
        this.sol = [];
        this.seed = seed;
        this.hints = hints;

        if (seed)
        { 
            this.generateGameBySeed();
        }
        else
        { 
            this.generateGame();
        }
    }

    getTAb()
    { 
      return this.tab;
    }

    getSolution()
    { 
      return this.sol;
    }

    generateGame()
    { 
      let sudoku = new Sudoku( this.hints )
      sudoku.generate();
      this.tab  = sudoku.getBoard();
      this.sol  = sudoku.getSolution();

      this.generateSeed();
    }

    generateSeed()
    { 
      let sol1d = [];
      for (let j = 0; j < 9; j++) {
          sol1d.push(  ...this.sol[j] )
      }

      let tab1d = [];
      for (let j = 0; j < 9; j++) {
          tab1d.push(  ...this.tab[j] )
      }

      tab1d = tab1d.map((n)=>(n=='') ?0:n);
     

      let key = Math.floor((Math.random()*100)) + 10

      let tabsolPlusKey = sol1d.map((n)=>n+key)
      let tabsolPlusHex = tabsolPlusKey.map((n)=>n.toString(16)).join(',');

      this.seed = `${key.toString(16)}:${tab1d.join('')}:${tabsolPlusHex}`;
    }

    getSeed()
    { 
      return this.seed;
    }

    generateGameBySeed()
    { 
      let parts = this.seed.split(':')
      //console.log(parts);

      let key = parseInt(parts[0], 16);
      //console.log(key);
      
      let tab = (parts[1].split('')).map((n)=> (parseInt(n, 16) ))
      //console.log(tab);
      
      let tabsol = parts[2].split(',').map((n)=> (parseInt(n, 16)- key ))
      //console.log(tabsol);

      /* linear to 2d */
      this.tab = [];
      this.sol = [];
      for (let i = 0; i < 9; i++) {
          let tmp = [];
          let tmp2 = [];
          for (let j = 0; j < 9; j++) {
              tmp.push(Number(tab[i*9+j]))
              tmp2.push(Number(tabsol[i*9+j]))
          }
          this.tab.push(tmp);
          this.sol.push(tmp2);
      }
      
    }

    /* Return an Array of objects with the x,y of the wrong positions */
    validateGame(tab2d)
    {
      let wrongPositions = [];

      for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              if(this.sol[i][j] !== tab2d[i][j])
              { 
                  wrongPositions.push({x:j,y:i})
              }
          }
      }
    
      return wrongPositions;
    }
    



}