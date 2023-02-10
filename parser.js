document.getElementById("TABLE").innerHTML = createColumnHeaders(header) + createRows(data, header) 

var active_id = '';
var sounds = [new Audio(), new Audio(),new Audio(),new Audio()];

// Navigation settings
var start = document.getElementById('start');
var child_start = null;
let child_index = 0;
start.parentElement.previousElementSibling.focus();
start.focus();
start.style.backgroundColor = 'gray';
start.style.color = 'white';


// When the user clicks on <div>, open the popup
function toggleShow(e,id, notClick = false) {
  if(e.target.id != "parent" && !notClick){
    return;
  }
  if( active_id === id){
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
  popup_start=document.getElementById(`start-${id}-0`)
  popup_start.focus()
  popup_start.style= 'background-color:#696969;';
  child_start = popup_start;
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
        first = column_index == 1 && row_index == 1 ? "id='start'" : ''

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
        html += "<input type='submit' id='start-" + key + "-"+ index +"' class='popup-item' onclick=sounds["+index+"].play() value='" + accent  + "'/>"
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



function moveSelectionTable(sibling) {
  if (sibling != null) {
    start.focus();
    start.style.backgroundColor = '';
    start.style.color = '';
    sibling.focus();
    sibling.style.backgroundColor = 'gray';
    sibling.style.color = 'white';
    start = sibling;
  }
}

function moveSelectionAccent(sibling){
    if (sibling != null) {
        child_start.focus();
        child_start.style.backgroundColor = '';
        child_start.style.color = '';
        sibling.focus();
        sibling.style.backgroundColor = 'gray';
        sibling.style.color = 'white';
        child_start = sibling;
      }
}

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  let childIsSat = child_start !== null
  if (childIsSat) {
    navigateAccents(e)
  } else {
    navigateTable(e)
  }
  
}

function navigateTable(e){
    if (e.keyCode == '38') {
        // up arrow
        if(!start.parentElement.previousElementSibling.previousElementSibling) return
        var idx = start.cellIndex;
        var nextrow = start.parentElement.previousElementSibling;
        if (nextrow != null) moveSelectionTable(nextrow.cells[idx]);
      } else if (e.keyCode == '40') {
        // down arrow
        var idx = start.cellIndex;
        var nextrow = start.parentElement.nextElementSibling;
        if (nextrow != null) moveSelectionTable(nextrow.cells[idx]);
      } else if (e.keyCode == '37') {
        // left arrow
        if(start.cellIndex == 1) return
        var sibling = start.previousElementSibling;
        moveSelectionTable(sibling);
      } else if (e.keyCode == '39') {
        // right arrow
        var sibling = start.nextElementSibling;
        moveSelectionTable(sibling);
      } else if (e.key === "Enter"){
        if(start.getAttribute('key')) toggleShow(e,start.getAttribute('key'), true);
      }
}

function navigateAccents(e){
    if (e.keyCode == '38') {
        // up arrow
        child_index = mod(child_index-1,4)
        moveSelectionAccent(child_start.parentElement.children[child_index])
    } else if (e.keyCode == '37' || e.keyCode == '27') {
        // left arrow or escape
        if(start.getAttribute('key')) toggleShow(e,start.getAttribute('key'), true);
        child_start = null;
    } else if (e.keyCode == '40') {
        // down arrow
        child_index = mod(child_index+1,4)
        moveSelectionAccent(child_start.parentElement.children[child_index])
    }
}


function mod(n, m) {
    return ((n % m) + m) % m;
  }