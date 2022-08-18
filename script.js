
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
                'revealed': false
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
    drawField();
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
    drawField();
}

function getRandomIndex() {
    let x = Math.floor(Math.random() * (fieldsize * fieldsize));
    return x + 1;
}

function drawField() {
    let fieldContainer = document.getElementById("field");
    fieldContainer.innerHTML = "";
    for (let i = 0; i < fieldsize; i++) {
        drawLine(i);
    }
}

function drawLine(lineNum) {
    let fieldContainer = document.getElementById("field");
    fieldContainer.innerHTML += fullLineOpenTemplate(lineNum);
}

function fullLineOpenTemplate(lineNum) {
    let htmlCode = "";
    for (let i = 0; i < fieldsize; i++) {
        htmlCode += singleFieldOpenTemplate(lineNum, i);
    }
    return singleLineWrapperTemplate(htmlCode, lineNum)
}

function singleFieldOpenTemplate(lineNum, fieldNum) {
    return `<div onclick="checkField(${getArrayIndex(lineNum, fieldNum)})" id="field_${getArrayIndex(lineNum, fieldNum)}" class="singleField">${fields[((lineNum) * fieldsize) + fieldNum].bombCount}</div>`;
}

function singleLineWrapperTemplate(content, lineNum) {
    return `<div id="line_${lineNum}" class="singleFieldLine">${content}</div>`;
}








function checkField(index) {
    console.log("checkField:", index);
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
            toggleFieldBg(index, 'green');
            checkField(index);
            break;
        case fields[index].bomb:
            toggleFieldBg(index, 'red');
            break;
        default:
            toggleFieldBg(index, 'yellow');
            break;
    }
    
}

function containsClass(index, classValue) {
    return document.getElementById(`field_${index}`).classList.contains(`${classValue}`);
}


function toggleFieldBg(index, color) {
    fields[index].revealed = true;
    document.getElementById(`field_${index}`).classList.add(`${color}_bg`);
}