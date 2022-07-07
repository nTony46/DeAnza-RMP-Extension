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
                var name = [a[i].innerHTML.replace(',', '')];     
                professors.push(name)
            }
        }
    }


    for (var i = 0; i < professors.length; i++){
        console.log(i + ", " + professors[i])
    }

    /*
    $(".table table-schedule table-hover mix-container").ready(function(){

        var instructors = [];
        var names = [];
        var i = 0;
        var j = 0;

        var table = document.getElementsByClassName("table table-schedule table-hover mix-container");


        while(($(".table table-schedule table-hover mix-container")).find("> tbody > tr > td") != undefined){
            names[i] = [];
            names.push[i];
            console.log(i);
            console.log(($(".table table-schedule table-hover mix-container")).find("> tbody > tr > td").get());
            i++;
            if(i == 50){
                break;
            }

        }
        return;
    });

    */

}

setTimeout(timeout, 2500);