document.getElementById("TABLE").innerHTML = createColumnHeaders(header) + createRows(data, header) 

var active_id = '';
var sounds = [new Audio(), new Audio(),new Audio(),new Audio()];

// When the user clicks on <div>, open the popup
function toggleShow(e,id) {
  if(e.target.id != "parent"){
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
}

function createColumnHeaders(header){
    let html = "<tr class='farge' ><th>&nbsp;</th>"
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
        rows += createCell(cellData, column_index, row_index ,header)
    })
    return rows;
}

function createCell(cellData, column_index, row_index ,header) {
    let text = ""
    if(column_index == 0) return "<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>"
    if(cellData){
        bottom = row_index >= 19 ? 'popup_bottom ' : 'popup '
        onclicke = "onclick=toggleShow(event,'"+ cellData.key + "')"
        kursiv = column_index >= 35 && column_index <= 38 ? "kursiv" : ""
        text += "<td "+ getColumnColor(column_index, header)+ ">"
        text +=    "<div class='" + bottom  + kursiv +"' "+ onclicke +" id='parent'>"
        text +=        cellData.key
        text +=        "<div class='popuptext' id='"+cellData.key+"'>"
        text +=            createAccentTab(cellData.accents)
        text +=        "</div> "
        text +=    "</div>"
        text += "</td>"
    } else {
        text += "<td "+ getColumnColor(column_index, header) + ">&nbsp;</td>"
    }
    return text
}

function createAccentTab(accents) {
    let html = ""
    accents.forEach((accent,index ) => {
        html += "<div class='popup-item'onclick= sounds["+index+"].play()>" + accent  + "</div>"
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
