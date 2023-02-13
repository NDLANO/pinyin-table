/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

createAndFillTable();
var active_id = '';
var sounds = [new Audio(), new Audio(),new Audio(),new Audio()];

// global navigation parameters/variables
var start_cell = document.getElementById('start_cell');
var accent_cell = null;
let accent_index = 0;
start_cell.parentElement.previousElementSibling.focus();
start_cell.focus();
start_cell.style.backgroundColor = 'gray';
start_cell.style.color = 'white';


// When the user clicks on <div>, open the popup
function toggleShow(e,id, notClick = false) {
  if(e.target.id != "parent" && !notClick){
    return;
  }
  if( active_id === id){ // 
    var popup = document.getElementById(id);
    popup.classList.toggle("show");
    active_id = '';
    return;
  } 
  sounds.map( (a,i) => a.src='lyder/'+id+(i+1)+'.mp3');
  if(active_id !== ''){
    var old_popup = document.getElementById(active_id);
    old_popup.classList.toggle("show");
    var popup = document.getElementById(id);
    popup.classList.toggle("show");
    active_id= id;
  } else {
    var popup = document.getElementById(id);
    popup.classList.toggle("show");
    active_id= id;
  }
  
  popup_cell = document.getElementById(`start_cell-${id}-0`) 
  popup_cell.focus()
  popup_cell.style= 'background-color:#696969;';
  accent_cell = popup_cell;
}

function createAndFillTable() {
    document.getElementById("TABLE").innerHTML = createColumnHeaders(header) + createRows(data, header) 
}

function createColumnHeaders(header){
    let html = "<tr class='farge'><th>&nbsp;</th>"
    header.columnHeaders.forEach((key,index) => {
        html += "<th "+ getColumnColorHeader(index+1, header) +">" + key + "</th>"
    })
    html += "</tr>"
    return html
}

function createRows(data_objects, header) {
    let rows = ""
    let current_row_index = -1
    Object.entries(data_objects).forEach(([key,cellData]) => {

        let row_index = Number.parseInt(key.split('-')[0])
        let column_index = Number.parseInt(key.split('-')[1])

        let new_row = column_index == 0 
        if(new_row) current_row_index += 1

        rows += new_row && current_row_index !== 0 ? "</tr>" : ""
        rows += new_row ?  "<tr>" : ""
        rows += createCell(cellData, column_index, row_index, header)
    })
    return rows;
}

function createCell(cellData, column_index, row_index, header) {
    let text = ""
    if(column_index == 0) return "<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>"
    if(cellData){
        
        bottom = row_index >= 19 ? 'popup_bottom ' : 'popup '
        kursiv = column_index >= 35 && column_index <= 38 ? "kursiv" : ""
        first = column_index == 1 && row_index == 1 ? "id='start_cell'" : ''

        text += "<td "+ getColumnColor(column_index, header)+ first + " key='"+ cellData.key + "' >"
        text +=    "<button type='button' class='" + bottom  + kursiv +"' onclick=toggleShow(event,'"+ cellData.key + "') id='parent'>"
        text +=        cellData.key
        text +=        "<div class='popuptext' id='"+cellData.key+"'>"
        text +=            createAccentTab(cellData.accents, cellData.key)
        text +=        "</div>"
        text +=    "</button>"
        text += "</td>"
    } else {
        text += "<td "+ getColumnColor(column_index, header) + ">&nbsp;</td>"
    }
    return text
}

function createAccentTab(accents, key) {
    let html = ""
    accents.forEach((accent,index ) => {
        html += "<input type='submit' id='start_cell-" + key + "-"+ index +"' class='popup-item' onclick=sounds["+index+"].play() value='" + accent  + "'/>"
    })
    return html
}

function getColumnColorHeader(column_index, header){
    let html = "scope='col'"
    color = getColumnColor(column_index, header)
    html += color.includes("class") ? color + "style='color:black'" : color
    return html
}

function getColumnColor(column_index, header){
    let color = ""
    if(header.brownColumns.includes(column_index) ){
        color += "class='brown'"
    }else if(header.blueColumns.includes(column_index) ){
        color += "class='blue'"
    }else if(header.redColumns.includes(column_index) ){
        color += "class='red'"
    } else {
        color += ""
    }
    return color
}

/** Navigtaion handling */

function moveSelectionTable(sibling) {
  if (sibling != null) {
    start_cell.focus();
    start_cell.style.backgroundColor = '';
    start_cell.style.color = '';
    sibling.focus();
    sibling.style.backgroundColor = 'gray';
    sibling.style.color = 'white';
    start_cell = sibling;
  }
}

function moveSelectionAccent(sibling){
    if (sibling != null) {
        accent_cell.focus();
        accent_cell.style.backgroundColor = '';
        accent_cell.style.color = '';
        sibling.focus();
        sibling.style.backgroundColor = 'gray';
        sibling.style.color = 'white';
        accent_cell = sibling;
      }
}

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  let childNotNull = accent_cell !== null
  if (childNotNull) {
    navigateAccents(e)
  } else {
    navigateTable(e)
  }
  
}

function navigateTable(e){
    if (e.keyCode == '38') {
        // up arrow
        if(!start_cell.parentElement.previousElementSibling.previousElementSibling) return
        var idx = start_cell.cellIndex;
        var nextrow = start_cell.parentElement.previousElementSibling;
        if (nextrow != null) moveSelectionTable(nextrow.cells[idx]);
      } else if (e.keyCode == '40') {
        // down arrow
        var idx = start_cell.cellIndex;
        var nextrow = start_cell.parentElement.nextElementSibling;
        if (nextrow != null) moveSelectionTable(nextrow.cells[idx]);

      } else if (e.keyCode == '37') {
        // left arrow
        if(start_cell.cellIndex == 1) return
        var sibling = start_cell.previousElementSibling;
        moveSelectionTable(sibling);
        document.getElementById("SCROLL").scrollLeft -= 50;
      } else if (e.keyCode == '39') {
        // right arrow
        var sibling = start_cell.nextElementSibling;
        moveSelectionTable(sibling);
        document.getElementById("SCROLL").scrollLeft += 50;
      } else if (e.key === "Enter"){
        if(start_cell.getAttribute('key')) toggleShow(e,start_cell.getAttribute('key'), true);
      }
}

function navigateAccents(e){
    if (e.keyCode == '38') {
        // up arrow
        accent_index = mod(accent_index-1,4)
        moveSelectionAccent(accent_cell.parentElement.children[accent_index])
    } else if (e.keyCode == '37' || e.keyCode == '27') {
        // left arrow or escape
        if(start_cell.getAttribute('key')) toggleShow(e,start_cell.getAttribute('key'), true);
        accent_cell = null;
    } else if (e.keyCode == '40') {
        // down arrow
        accent_index = mod(accent_index+1,4)
        moveSelectionAccent(accent_cell.parentElement.children[accent_index])
    }
}

function mod(n, m) {
    return ((n % m) + m) % m;
  }