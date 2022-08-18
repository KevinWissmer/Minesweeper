
let fields = [];
let fieldsize = 16;
let bombCount = 20;

function generateFieldsArray() {
    for (let col = 0; col < fieldsize; col++) {
        for (let row = 0; row < fieldsize; row++) {
            fields.push({
                'row': row,
                'col': col,
                'bomb': false,
                'bombCount': 0,
                'revealed': false,
                'flag' : false
            });
        }
    }
    fillFieldWBombs();
}

function fillFieldWBombs() {
    for (let i = 0; i < bombCount; i++) {
        index = setSingelBomb();
        updateSurroundingFieldsBombcount(index);
    }
    drawFields();
}

function updateSurroundingFieldsBombcount(x, y) {
    for (let d_row = -1; d_row < 2; d_row++) {
        for (let d_col = -1; d_col < 2; d_col++) {
            if (validIndex(index, d_row, d_col)) {
                increaseBombCount(getNewIndex(index, d_row, d_col));
            }

        }
    }
}

function getArrayIndex(row,col){
    return (row * fieldsize) + col;
}

function getNewIndex(index, d_row, d_col){
    return index + d_row + (d_col * fieldsize)
}

//check if coordinates are inside of the field
function validIndex(index, d_row, d_col) {
    let rowCheck = fields[index].row + d_row < fieldsize && fields[index].row + d_row >= 0;
    let colCheck = fields[index].col + d_col < fieldsize && fields[index].col + d_col >= 0;
    return rowCheck && colCheck;
}

function getSurroundingIndices(index) {

}

function increaseBombCount(index) {
    if (fields[index]) {
        if (!fields[index].bomb) {
            fields[index].bombCount++;
        }
    }
}

function setSingelBomb() {
    let index = getRandomIndex();
    let stop = 0;
    while (fields[index].bomb && stop <= 15) {
        index = getRandomIndex();
        stop++;
    }
    fields[index].bomb = true;
    fields[index].bombCount = "B";
    return index;
}

function init() {
    generateFieldsArray();
    drawFields();
}

function getRandomIndex() {
    let x = Math.floor(Math.random() * (fieldsize * fieldsize));
    return x + 1;
}

function drawFields() {
    let fieldContainer = document.getElementById("field");
    fieldContainer.innerHTML = "";
    for (let row = 0; row < fieldsize; row++) {
        createRow(row);
    }
}

function createRow(row) {
    let fieldContainer = document.getElementById("field");
    fieldContainer.innerHTML += fullLineOpenTemplate(row);
}

function fullLineOpenTemplate(row) {
    let htmlCode = "";
    for (let col = 0; col < fieldsize; col++) {
        let index = getArrayIndex(row, col)
        htmlCode += singleFieldOpenTemplate(index);
    }
    return singleLineWrapperTemplate(htmlCode, row)
}

function singleFieldOpenTemplate(index) {
    return `<div oncontextmenu="setFlag(${index});return false;" onclick="checkField(${index})" id="field_${index}" class="singleField"></div>`;
}

function singleLineWrapperTemplate(content, row) {
    return `<div id="line_${row}" class="singleFieldLine">${content}</div>`;
}



function setFlag(index){
    if(!fields[index].revealed){
        fields[index].flag = !fields[index].flag;
        document.getElementById(`field_${index}`).classList.toggle('flag');
    }
}



function checkField(index) {
    switch (true) {
        case fields[index].bombCount == 0:
            checkAllFieldsAround(index);
            break;
        case fields[index].bomb:
            toggleFieldBg(index, 'bomb', '');
            gameLost();
            break;
        default:
            toggleFieldBg(index, 'bomb_near', fields[index].bombCount);
            break;
    }
    checkForWin();
}

function gameLost(){
    document.getElementById('game_status').innerHTML ='game lost';
    console.log('game lost');
}

function checkAllFieldsAround(index){
    for (let d_row = -1; d_row < 2; d_row++) {
        for (let d_col = -1; d_col < 2; d_col++) {
            let newIndex = getNewIndex(index, d_row, d_col);
            if (validIndex(index, d_row, d_col)) {
                if(!fields[newIndex].revealed){
                    revealField(newIndex);
                }
            }
        }
    }
}


function revealField(index) {
    switch (true) {
        case fields[index].bombCount == 0:
            toggleFieldBg(index, 'empty', '');
            checkAllFieldsAround(index);
            break;
        case fields[index].bomb:
            toggleFieldBg(index, 'bomb', '');
            break;
        default:
            toggleFieldBg(index, 'bomb_near', fields[index].bombCount);
            break;
    }
    
}

function containsClass(index, classValue) {
    return document.getElementById(`field_${index}`).classList.contains(`${classValue}`);
}


function toggleFieldBg(index, color, content) {
    fields[index].revealed = true;
    let contentBox = document.getElementById(`field_${index}`);
    contentBox.innerHTML = content;
    contentBox.classList.add(`${color}_bg`);
}

function checkForWin(){
    let won = true;
    for (let index = 0; index < fields.length; index++) {
        if(!fields[index].revealed && !fields[index].bomb){
            won = false;  
        } 
    }
    if(won) {
        document.getElementById('game_status').innerHTML = "winner, winner, chicken dinner";
        console.log("winner, winner, chicken dinner");
    }
}