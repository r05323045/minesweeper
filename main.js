 /**
 * GAME
 * 用來控制setInterval、state等變數
 * state分別有 尚未開始-initial => 尚未點擊格子-biginning => 點擊第一個格子後-firstClick => 遊戲結束-gameOver
 */
const GAME = {timer: ()=>{}, state: 'initial', difficulty: {height: 16, width: 30, mines: 99, custom: false}}
const view = {
    /**
     * displayFields()
     * 顯示踩地雷的遊戲版圖在畫面上，輸入的 rows 是指版圖的行列數。
     */
    displayFields(rows, cols) {
        document.querySelector('.status').style.background = `url('resource/status/continue.gif') center center / cover no-repeat`
        document.querySelector('.fields').innerHTML = Array.from(Array(rows * cols).keys()).map(index => `<div class="field" id="${index}"></div>`).join('')
        document.querySelector('.board').style.width = `${cols * 30 + 36}px`
        document.querySelector('.board').style.height = `${rows * 30 + 111}px`
        document.querySelector('.wrapper').style.width = `${cols * 30 + 6}px`
        document.querySelector('.fields').style.width = `${cols * 30 + 6}px`
    },
    /**
     * showFieldContent()
     * 更改單一格子的內容，像是顯示數字、地雷，或是海洋。
     */
    showFieldContent(field) {
        field = Number(field)
        if (model.isMine(field)) {
            document.getElementById(`${field}`).style.background = `url('resource/mine/normal.png') center center / cover no-repeat`
            document.getElementById(`${field}`).classList.add('show')
        } else {
            document.getElementById(`${field}`).style.background = `url('resource/field_number/${model.fields[field].number}.gif') center center / cover no-repeat`
            document.getElementById(`${field}`).classList.add('show')
        } 
    },
    /**
     * renderTime()
     * 顯示經過的遊戲時間在畫面上。
     */
    renderTime(time) {
        GAME.timer = setInterval(function() {
                        const now = new Date().getTime()
                        const distance = now - time
                        const seconds = Math.floor((distance / 1000))
                        const secondsList = seconds.toString().split('')
                        document.querySelector('.time .first').style.background = `url('resource/digital_number/${Number(secondsList[secondsList.length - 1])}.svg') center center / cover no-repeat`
                        if (seconds >= 10) {
                            document.querySelector('.time .second').style.background = `url('resource/digital_number/${Number(secondsList[secondsList.length - 2])}.svg') center center / cover no-repeat`
                        }
                        if (seconds >= 100) {
                            document.querySelector('.time .third').style.background = `url('resource/digital_number/${Number(secondsList[secondsList.length - 3])}.svg') center center / cover no-repeat`  
                        }
                    }, 1000)
    },
    renderFlagNumber() {
        const remainFlagsList = model.remainFlags.toString().split('')
        document.querySelector('.remain-flags .first').style.background = `url('resource/digital_number/${Number(remainFlagsList[remainFlagsList.length - 1])}.svg') center center / cover no-repeat`
        document.querySelector('.remain-flags .second').style.background = `url('resource/digital_number/0.svg') center center / cover no-repeat`
        document.querySelector('.remain-flags .third').style.background = `url('resource/digital_number/0.svg') center center / cover no-repeat`
        if (model.remainFlags < 0) {
            document.querySelector('.remain-flags .third').style.background = `url('resource/digital_number/minus.svg') center center / cover no-repeat`
        }
        if (Math.abs(model.remainFlags) >= 10) {
            document.querySelector('.remain-flags .second').style.background = `url('resource/digital_number/${Number(remainFlagsList[remainFlagsList.length - 2])}.svg') center center / cover no-repeat`
        }
        if (Math.abs(model.remainFlags) >= 100) {
            document.querySelector('.remain-flags .third').style.background = `url('resource/digital_number/${Number(remainFlagsList[remainFlagsList.length - 3])}.svg') center center / cover no-repeat`  
        }
    },
    /**
     * showMines()
     * 遊戲結束時將遊戲的全部炸彈顯示出來。
     */
    showMines(mineIdx) {
        document.querySelectorAll('.field').forEach(field => {
            if (model.isMine(field.id)) {
                view.showFieldContent(field.id)
            }  
        })
        document.getElementById(`${mineIdx}`).style.background = `url('resource/mine/explode.png') center center / cover no-repeat`
    }
  }

const Handler = { 
    
    status : function (event) {
                if (event.target.matches('.status')) {
                    controller.createGame(GAME.difficulty.height, GAME.difficulty.width, GAME.difficulty.mines)
                    controller.resetTime()
                }    
            },
    difficulty : function (event) {
                    if (event.target.matches('.nav-link')) {
                        console.log(event.target.textContent)
                        switch (event.target.textContent){
                            case 'beginner':
                                GAME.difficulty.custom = false
                                GAME.difficulty.height = 9
                                GAME.difficulty.width = 9
                                GAME.difficulty.mines = 10
                                controller.createGame(GAME.difficulty.height, GAME.difficulty.width, GAME.difficulty.mines)
                                break;
                            case 'intermediate':
                                GAME.difficulty.custom = false
                                GAME.difficulty.height = 16
                                GAME.difficulty.width = 16
                                GAME.difficulty.mines = 40
                                controller.createGame(GAME.difficulty.height, GAME.difficulty.width, GAME.difficulty.mines)
                                break;
                            case 'expert':
                                GAME.difficulty.custom = false
                                GAME.difficulty.height = 16
                                GAME.difficulty.width = 30
                                GAME.difficulty.mines = 99
                                controller.createGame(GAME.difficulty.height, GAME.difficulty.width, GAME.difficulty.mines)
                                break;
                            case 'custom':
                                GAME.difficulty.custom = true
                                GAME.difficulty.height = document.querySelector('#pills-custom').querySelector('.height').value
                                GAME.difficulty.width = document.querySelector('#pills-custom').querySelector('.width').value
                                GAME.difficulty.mines = document.querySelector('#pills-custom').querySelector('.mines').value
                                break;
                        }
                    }
            },
    submitCustom : function(event) {
                    console.log(GAME.difficulty.custom)
                    if (event.target.matches('.confirm') && GAME.difficulty.custom === true) {
                        let inputHeight = document.querySelector('#pills-custom').querySelector('.height').value
                        let inputWidth = document.querySelector('#pills-custom').querySelector('.width').value
                        let inputMines = document.querySelector('#pills-custom').querySelector('.mines').value
                        if (isNaN(inputHeight) || inputHeight < 9) {
                            inputHeight = 9
                        } else if (inputHeight > 16) {
                            inputHeight = 16
                        }
                        if (isNaN(inputWidth) || inputWidth < 9) {
                            inputWidth = 9
                        } else if (inputWidth > 30) {
                            inputHeight = 30
                        }
                        if (isNaN(inputMines)) {
                            inputMines = Math.floor(Math.random() * (inputHeight * inputWidth - 1) + 1)
                        } else if (inputMines < 1) {
                            inputMines = 1
                        } else if (inputMines > (inputHeight * inputWidth - 1)) {
                            inputMines = (inputHeight * inputWidth - 1)
                        }
                        console.log(inputHeight, inputWidth, inputMines)
                        GAME.difficulty.height = inputHeight
                        GAME.difficulty.width = inputWidth
                        GAME.difficulty.mines = inputMines
                        document.querySelector('#pills-custom').querySelector('.height').value = inputHeight
                        document.querySelector('#pills-custom').querySelector('.width').value = inputWidth
                        document.querySelector('#pills-custom').querySelector('.mines').value = inputMines
                        controller.createGame(GAME.difficulty.height, GAME.difficulty.width, GAME.difficulty.mines)
                    }
                    $("#difficulty").modal("hide"); 
                },
    fieldClick : function (event) {
                    if (event.target.matches('.field')) {
                        switch (GAME.state) {
                            case 'beginning':
                                controller.dig(event.target.id)
                                const startTime = new Date().getTime()
                                view.renderTime(startTime)
                                break;
                            case 'firstClick':
                                controller.dig(event.target.id)
                                break;
                            case 'gameOver':
                                break;
                        }
                    }  
                },
    fieldContextmenu : function (event) {
                            event.preventDefault()
                            const fieldIdx = Number(event.target.id)
                            if (event.target.matches('.field') && model.fields[field].isDigged === false) {
                                switch (GAME.state) {
                                    case 'beginning':
                                    case 'firstClick':
                                        if (document.getElementById(`${fieldIdx}`).matches('.flag')) {
                                            document.getElementById(`${fieldIdx}`).style.background = ""
                                            document.getElementById(`${fieldIdx}`).classList.remove('flag')
                                            model.remainFlags += 1
                                            view.renderFlagNumber()
                                        } else {
                                            document.getElementById(`${fieldIdx}`).style.background = `url('resource/flag.gif') center center / cover no-repeat`
                                            document.getElementById(`${fieldIdx}`).classList.add('flag')
                                            model.remainFlags -= 1
                                            view.renderFlagNumber()
                                        }
                                        break;
                                    case 'gameOver':
                                        break;
                                } 
                            }    
                        },
}

const controller = {
      
    /**
     * createGame()
     * 根據參數決定遊戲版圖的行列數，以及地雷的數量
     */
    createGame(numberOfRows, numberOfCols, numberOfMines) {
        GAME.state = 'beginning'
        //1. 避免重複監聽
        clearInterval(GAME.timer)
        document.querySelector('.nav-pills').removeEventListener('click', Handler.difficulty, false)
        document.querySelector('.card-footer').removeEventListener('click', Handler.submitCustom, false)
        document.querySelector('.nav-pills').addEventListener('click', Handler.difficulty)
        document.querySelector('.card-footer').addEventListener('click', Handler.submitCustom)
        //2. 顯示遊戲畫面
        view.displayFields(numberOfRows, numberOfCols)
        //3. 避免重複監聽
        document.querySelector('.wrapper').removeEventListener('click', Handler.status, false)
        document.querySelector('.fields').removeEventListener('click', Handler.fieldClick, false)
        document.querySelector('.fields').removeEventListener('contextmenu', Handler.fieldContextmenu, false)
        //3. 遊戲計時
        document.querySelector('.wrapper').addEventListener('click', Handler.status)
        //4. 埋地雷
        controller.setMinesAndFields(numberOfRows, numberOfCols, numberOfMines)
        view.renderFlagNumber()
        //5. 綁定事件監聽器到格子上
        document.querySelector('.fields').addEventListener('click', Handler.fieldClick)
        document.querySelector('.fields').addEventListener('contextmenu', Handler.fieldContextmenu)
    },
    
    /**
     * setMinesAndFields()
     * 設定格子的內容，以及產生地雷的編號。
     */
    setMinesAndFields(numberOfRows, numberOfCols, numberOfMines) {

        //1. 產生地雷編號
        model.mines = utility.getRandomNumberArray(numberOfRows, numberOfCols, numberOfMines)
        //2. 產生空格子
        model.fields = Array(numberOfRows * numberOfCols).fill().map(el => {return {number: el, isDigged: false}}) //要用map的原因https://stackoverflow.com/questions/35578478/array-prototype-fill-with-object-passes-reference-and-not-new-instance
        //3. 設定格子內容
        model.fields.forEach((el, idx) => {controller.getFieldData(idx)})
        //4. 設定旗子數量
        model.remainFlags = model.mines.length
        //5. 後台檢查
        utility.deBug()
        
    },
    
    /**
     * getFieldData()
     * 取得單一格子的內容，決定這個格子是海洋還是號碼，
     * 如果是號碼的話，算出這個號碼是幾號。
     * （計算周圍地雷的數量）
     */
    getFieldData(fieldIdx) {
        const numberOfRows = GAME.difficulty.height
        const numberOfCols = GAME.difficulty.width
        if (model.isMine(fieldIdx)) {
            model.fields[fieldIdx]['number'] = '*'
        } else {
            const fieldRow = Math.floor(fieldIdx / numberOfCols)
            const fieldCol = fieldIdx % numberOfCols
            const range = []
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    const row = fieldRow + i
                    const col = fieldCol + j
                    if (row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols) { 
                        range.push(row * numberOfCols + col)
                    }
                }
            }
            let count = 0
            range.forEach(index => {
                count = model.isMine(index) ?  count + 1 : count
            })
            model.fields[fieldIdx]['number'] = count
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
        field = Number(field)
        model.fields[field].isDigged = true
        const numberOfRows = GAME.difficulty.height
        switch (GAME.state) {
            case 'beginning':
                GAME.state = 'firstClick'
                if (model.isMine(field)) {
                    controller.createGame(GAME.difficulty.height, GAME.difficulty.width, GAME.difficulty.mines)
                    controller.dig(field)
                } 
                else if (model.fields.filter(field => field.isDigged).length === model.fields.length - model.mines.length) {
                    controller.victory()
                } 
                else if (model.fields[field].number === 0){
                    controller.spreadOcean(field)
                }
                view.showFieldContent(field) 
                break;
            case 'firstClick':
                view.showFieldContent(field)
                if (model.isMine(field)) {
                    controller.gameOver(field) 
                } 
                else if (model.fields.filter(field => field.isDigged).length === model.fields.length - model.mines.length) {
                    controller.victory()
                } 
                else if (model.fields[field].number === 0){
                    controller.spreadOcean(field, numberOfRows)
                } 
                break;
            }
        
    },
    /**
     * spreadOcean()
     * 使用遞迴方式挖十字型的格子
     */
    spreadOcean(field) {
        field = Number(field)
        const numberOfRows = GAME.difficulty.height
        const numberOfCols = GAME.difficulty.width
        const fieldRow = Math.floor(field / numberOfCols)
        const fieldCol = field % numberOfCols
        const range = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (Math.abs(i) !== Math.abs(j)) {
                    const row = fieldRow + i
                    const col = fieldCol + j
                    if (row >= 0 && row < numberOfRows && col >= 0 && col < numberOfCols) { 
                        range.push(row * numberOfCols + col)
                    }
                } 
            }
        }
        range.forEach(index => {
            if (model.fields[index].isDigged === false) {
                controller.dig(index)
            }
        })
    },
    /**
     * victory()
     * 跳出勝利alert
     */
    victory() {
        document.querySelector('.status').style.background = `url('resource/status/vicotory.gif') center center / cover no-repeat`
        GAME.state = 'gameOver'
        document.querySelectorAll('.field').forEach(field => {
            if (model.isMine(field.id)) {
                document.getElementById(`${field.id}`).style.background = `url('resource/flag.gif') center center / cover no-repeat`
            }  
        })
        model.remainFlags = 0
        view.renderFlagNumber()
        setTimeout(()=>{clearInterval(GAME.timer)}, 500)
    },
    /**
     * gameOver()
     * 跳出遊戲結束alert
     */
    gameOver(field) {
        document.querySelector('.status').style.background = `url('resource/status/gameover.gif') center center / cover no-repeat`
        view.showMines(field)
        clearInterval(GAME.timer)
        GAME.state = 'gameOver'
        //使用SweetAlert套件http://lipis.github.io/bootstrap-sweetalert/
        /*
        swal({
            title: "Game Over",
            button: "restart",
        })
        .then(() => {
            controller.createGame(9, 10)
        })
        */
    },
    resetTime() {
        clearInterval(GAME.timer)
        document.querySelector('.time .first').style.background = `url('resource/digital_number/0.svg') center center / cover no-repeat`
        document.querySelector('.time .second').style.background = `url('resource/digital_number/0.svg') center center / cover no-repeat`
        document.querySelector('.time .third').style.background = `url('resource/digital_number/0.svg') center center / cover no-repeat`  
    },
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

    remainFlags: Number,
  
    /**
     * isMine()
     * 輸入一個格子編號，並檢查這個編號是否是地雷
     */
    isMine(fieldIdx) {
        fieldIdx = Number(fieldIdx)
        return this.mines.includes(fieldIdx)
    }
  }
  
const utility = {
    /**
     * getRandomNumberArray(len, height, width)
     * 取得一個範圍從 0 到 height, width參數、長度為 len參數的數字陣列。
     * 例如：
     *   getRandomNumberArray(2, 4, 4)
     *     - [3, 1]
    */
    getRandomNumberArray(height, width, len) {
        console.log(height, width)
        const number = []
        for (let i = 0; i < len; i++) {
            const random = Math.floor(Math.random() * height * width)
            
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
        const numberOfRows = GAME.difficulty.height
        const numberOfCols = GAME.difficulty.width
        const check = []
        Array.from(Array(numberOfRows).keys()).forEach(i => check.push(model.fields.slice(i * numberOfCols, (i+1) * numberOfCols).map(i => i.number)))
        console.table(check)
    }
  }

controller.createGame(9, 9, 10)