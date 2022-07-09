console.log("yo\n")

function timeout(){

    professors = []

    var table = document.getElementsByClassName("table table-schedule table-hover mix-container")[0];
    var tableBody = table.getElementsByTagName('tbody')[0];
    var tableRow = tableBody.getElementsByTagName('tr');


    for (var t = 0; t < tableRow.length; t++){
        //console.log(tableRow[t].innerHTML);
        var a = tableRow[t].getElementsByTagName('a');

        for (var i = 0; i < a.length; i++){
            /* 
            We will filter out the results from a[i].html
            because right now it looks like this (with i position)

            0 - Class Name
            1 - Span Tagged Item
            2 - Professor Name
            0 - Class Name
            ...

            */          
            if (i == 2){

                // Some new/temp professors have commas in between first and last name
                var name = a[i].innerHTML.replace(',', '');
                var seperated_name = name.split(' ');

                professors.push(seperated_name)
            }
        }
    }


    for (var i = 0; i < professors.length; i++){
        console.log(i + ", " + professors[i] + " length is " + professors[i].length)
    }
    getProfessorRatings(professors)

}


function getProfessorRatings(professors){

    ratings = [];
    
    i = 0
    if (professors[i].length >= 3){
        var url = "https://www.ratemyprofessors.com/search/teachers?query="
                    + professors[i][0] +'%20'+ professors[i][1] +'%20'+ professors[i][2] + "&sid=U2Nob29sLTE5Njc=";
    }
    else {
        var url = "https://www.ratemyprofessors.com/search/teachers?query="
                    + professors[i][0] +'%20'+ professors[i][1] + "&sid=U2Nob29sLTE5Njc=";
    }


    (async () => {
        const response = await fetch("https://cors-anywhere.herokuapp.com/" + url);
        const template = await response.text();
        console.log(template);
    })();




}

setTimeout(timeout, 2500);