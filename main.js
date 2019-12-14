 /**
 * Timer
 * 用來控制view.renderTime的setInterval函式
 */
let Timer
const view = {
    /**
     * displayFields()
     * 顯示踩地雷的遊戲版圖在畫面上，輸入的 rows 是指版圖的行列數。
     */
    displayFields(rows) {
        document.querySelector('.fields').innerHTML = Array.from(Array(Math.pow(rows, 2)).keys()).map(index => `<div class="field" id="${index}"><i></i></div>`).join('')
        document.querySelector('.fields').style.width = `${rows * 30}px`
    },
    /**
     * showFieldContent()
     * 更改單一格子的內容，像是顯示數字、地雷，或是海洋。
     */
    showFieldContent(field) {
        field = Number(field)
        if (model.isMine(field)) {
            document.getElementById(`${field}`).innerHTML =  `<i class="fas fa-bomb"></i>`
        } else {
            document.getElementById(`${field}`).innerHTML =  `<i>${model.fields[field].number}</i>`
            document.getElementById(`${field}`).classList.add('show')
        } 
    },
    /**
     * renderTime()
     * 顯示經過的遊戲時間在畫面上。
     */
    renderTime(time) {
        /*
        Timer = setInterval(function() {
                    const now = new Date().getTime()
                    const distance = now - time
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000)
                    document.querySelector('.time').innerHTML = `你已經用了  ${hours}h ${minutes}m ${seconds}s`
                }, 1000)
        */
       document.querySelector('.time .first').style.background = "url('../img/0.svg')"
    },
    /**
     * showBoard()
     * 遊戲結束時將遊戲的全部格子內容顯示出來。
     */
    showBoard() {
        document.querySelectorAll('.field').forEach(field => {view.showFieldContent(field.id)})
    }
  }
  
  const controller = {
    /**
     * createGame()
     * 根據參數決定遊戲版圖的行列數，以及地雷的數量
     */
    createGame(numberOfRows, numberOfMines) {
        //1. 顯示遊戲畫面
        view.displayFields(numberOfRows)
        //2. 遊戲計時
        const startTime = new Date().getTime()
        view.renderTime(startTime)
        //3. 埋地雷
        controller.setMinesAndFields(numberOfRows, numberOfMines)
        //4. 綁定事件監聽器到格子上
        document.querySelectorAll('.field').forEach(field => {
            field.addEventListener('click', event => {
                if (event.target.matches('.field')) {
                    controller.dig(event.target.id)
                } else if (event.target.matches('.fas')) {
                    controller.dig(event.target.parentElement.id)
                }
            })
            field.addEventListener('contextmenu', event => {
                event.preventDefault()
                if (event.target.matches('.field')) {
                    const field = Number(event.target.id)
                    if (model.fields[field].isDigged === false) {
                        document.getElementById(`${field}`).children[0].className = 'fas fa-flag'
                    }
                } 
            })
        })
    },
    
    /**
     * setMinesAndFields()
     * 設定格子的內容，以及產生地雷的編號。
     */
    setMinesAndFields(numberOfRows, numberOfMines) {

        //1. 產生地雷編號
        model.mines = utility.getRandomNumberArray(numberOfMines, numberOfRows)
        //2. 產生空格子
        model.fields = Array(Math.pow(numberOfRows, 2)).fill().map(el => {return {number: el, isDigged: false}}) //要用map的原因https://stackoverflow.com/questions/35578478/array-prototype-fill-with-object-passes-reference-and-not-new-instance
        //3. 設定格子內容
        model.fields.forEach((el, idx) => {controller.getFieldData(idx)})
        //4. 後台檢查
        utility.deBug()
        
    },
    
    /**
     * getFieldData()
     * 取得單一格子的內容，決定這個格子是海洋還是號碼，
     * 如果是號碼的話，算出這個號碼是幾號。
     * （計算周圍地雷的數量）
     */
    getFieldData(fieldIdx) {
        const numberOfRows = Math.sqrt(model.fields.length)
        if (model.isMine(fieldIdx)) {
            model.fields[fieldIdx]['number'] = '*'
        } else {
            const fieldRow = Math.floor(fieldIdx / numberOfRows)
            const fieldCol = fieldIdx % numberOfRows
            const range = []
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    const row = fieldRow + i
                    const col = fieldCol + j
                    if (row >= 0 && row < numberOfRows && col >= 0 && col < numberOfRows) { 
                        range.push(row * numberOfRows + col)
                    }
                }
            }
            let count = 0
            range.forEach(index => {
                count = model.isMine(index) ?  count + 1 : count
            })
            model.fields[fieldIdx]['number'] = count > 0 ? count : ''
        }
        
    },
    /**
     * dig()
     * 使用者挖格子時要執行的函式，
     * 會根據挖下的格子內容不同，執行不同的動作，
     * 如果是號碼或海洋 => 顯示格子
     * 如果是地雷      => 遊戲結束
     */
    dig(field) {
        const numberOfRows = Math.sqrt(model.fields.length)
        field = Number(field)
        model.fields[field].isDigged = true
        view.showFieldContent(field)
        if (model.isMine(field)) {
            controller.gameOver()
        } else if (model.fields.filter(field => field.isDigged).length === model.fields.length - model.mines.length) {
            controller.victory()
        } else if (model.fields[field].number === ''){
            controller.spreadOcean(field, numberOfRows)
        } 
    },
    /**
     * spreadOcean()
     * 使用遞迴方式挖十字型的格子
     */
    spreadOcean(field) {
        field = Number(field)
        const numberOfRows = Math.sqrt(model.fields.length)
        const fieldRow = Math.floor(field / numberOfRows)
        const fieldCol = field % numberOfRows
        const range = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (Math.abs(i) !== Math.abs(j)) {
                    const row = fieldRow + i
                    const col = fieldCol + j
                    if (row >= 0 && row < numberOfRows && col >= 0 && col < numberOfRows) { 
                        range.push(row * numberOfRows + col)
                    }
                } 
            }
        }
        range.forEach(index => {
            if (model.fields[index].isDigged === false) {
                controller.dig(index, numberOfRows)
            }
        })
    },
    /**
     * victory()
     * 跳出勝利alert
     */
    victory() {
        //使用SweetAlert套件http://lipis.github.io/bootstrap-sweetalert/
        swal({
            title: "Victory",
            button: "play again",
        })
        .then(() => {
            controller.createGame(9, 10)
        })
        clearInterval(Timer)
    },
    /**
     * gameOver()
     * 跳出遊戲結束alert
     */
    gameOver() {
        view.showBoard()
        //使用SweetAlert套件http://lipis.github.io/bootstrap-sweetalert/
        swal({
            title: "Game Over",
            button: "restart",
        })
        .then(() => {
            controller.createGame(9, 10)
        })
        clearInterval(Timer)
    }
  }
  
  const model = {
    /**
     * mines
     * 存放地雷的編號（第幾個格子）
     */
    mines: [],
    /**
     * fields
     * 存放格子內容，資料型態：
     * {number: 1, isDigged: false}
     */
    fields: [],
  
    /**
     * isMine()
     * 輸入一個格子編號，並檢查這個編號是否是地雷
     */
    isMine(fieldIdx) {
        return this.mines.includes(fieldIdx)
    }
  }
  
  const utility = {
    /**
     * getRandomNumberArray(len, count)
     * 取得一個範圍從 0 到 count參數、長度為 len參數的數字陣列。
     * 例如：
     *   getRandomNumberArray(2, 4)
     *     - [3, 1]
    */
    getRandomNumberArray(len, count) {
        const number = []
        for (let i = 0; i < len; i++) {
            const random = Math.floor(Math.random() * Math.pow(count, 2))
            if (number.includes(random) === false) {
                number.push(random)
            } else { i -= 1}
        }
        return number
    },
    /**
     * deBug()
     * 將array轉換成matrix
    */
    deBug() {
        const numberOfRows = Math.sqrt(model.fields.length)
        const check = []
        Array.from(Array(numberOfRows).keys()).forEach(i => check.push(model.fields.slice(i * numberOfRows, (i+1) * numberOfRows).map(i => i.number)))
        console.table(check)
    }
  }

controller.createGame(9, 10)