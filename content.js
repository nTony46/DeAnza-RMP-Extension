console.log("Hello from content.js");

class Professor{
    constructor(firstName, lastName, teacherID, numRatings, averageRating){
        this.firstName = firstName;
        this.lastName = lastName;
        this.teacherID = teacherID;
        this.numRatings = numRatings;
        this.averageRating = averageRating;
    }
}

// HAVE THE DATA, HAVE THE NAME
// TODO: INJECT INFO INTO PAGE

function timeout(){
    professors = []
    var table = document.getElementsByClassName("table table-schedule table-hover mix-container")[0];
    var tableBody = table.getElementsByTagName('tbody')[0];
    var tableRow = tableBody.getElementsByTagName('tr');

    for (var t = 0; t < tableRow.length; t++){
        var a = tableRow[t].getElementsByTagName('a');
        for (var i = 0; i < a.length; i++){         
            if (i == 2){
                // Some new/temp professors have commas in between first and last name
                var name = a[i].innerHTML.replace(',', '');
                name = name.toUpperCase();
                console.log(name);
                professors.push(name);
            }
        }
    }

    for (var i = 0; i < professors.length; i++){
        console.log(i + ", " + professors[i] + " length is " + professors[i].length);
    }
    getProfessorData();
}

function getProfessorData(){
    // Getting the total number of professors from the first page of the JSON file.
    var totalProfessors;
    (async () => {
        p=1
        let r = await fetch("https://www.ratemyprofessors.com/filter/" +
                            "professor/?&page=" + p.toString() + "&filter=total_number_of_ratings_i+desc&queryoption=TEACHER&queryBy=schoolId&sid=1967");
        const data_json = await r.json();
        totalProfessors = data_json.searchResultsTotal;
    })();

    // Going through all RMP pages and parsing the data into a Professor object
    (async () => {
        totalPages = Math.ceil(totalProfessors/20);

        for (let i = 1; i < totalPages+1; i++){
            let r = await fetch("https://www.ratemyprofessors.com/filter/" +
                            "professor/?&page=" + i.toString() + "&filter=total_number_of_ratings_i+desc&queryoption=TEACHER&queryBy=schoolId&sid=1967");
            const data = await r.json();
            
            // Now saving the data needed from the professors
            for(let j = 0; j < data.professors.length; j++){
                cur_prof = data.professors[j];
                firstName = cur_prof.tFname;
                lastName = cur_prof.tLname;
                teacherID = cur_prof.tid;
                numRatings = cur_prof.tNumRatings;
                averageRating = cur_prof.overall_rating;

                fullName = (firstName + " " + lastName).toUpperCase();

                console.log(`${firstName} ${lastName} ${teacherID} ${numRatings} ${averageRating}`);
                professor = new Professor(firstName, lastName, teacherID, numRatings, averageRating);
                
                // Saving all professor data to chrome storage
                dataObj = {};
                dataObj[fullName] = professor;
                chrome.storage.local.set(dataObj, function(){
                    console.log("Value is set to: " + professor);
                });
            }
        }
    })();
}

function get(key){
    chrome.storage.local.get(key, function(result){
        console.log("Retrieved: ", result);
        return result;
    })
}


setTimeout(timeout, 500);
