/* TODO: 
   - only call getProfessorData() on browser startup instead of inside timeout()
   - change injection destination; from tableSpot[7] to something else, not injecting in
     some cases
   - load the rest of the content script (apart form getProfessorData()) onyl when
     it is at a De Anza college Schedule website
   - Be able to look for associated nicknames inside database
*/

console.log("Hello from content.js");

class Professor{
    constructor(firstName, lastName, teacherID, numRatings, averageRating){
        this.firstName = firstName;
        this.lastName = lastName;
        this.teacherID = teacherID;
        this.numRatings = numRatings;
        this.averageRating = averageRating;
        this.url = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + teacherID.toString();

    }
}


// Getting the total number of professors from the first page of the JSON file.
var totalProfessors;
(async () => {
    p=1
    let r = await fetch("https://www.ratemyprofessors.com/filter/" +
                            "professor/?&page=" + p.toString() + "&filter=total_number_of_ratings_i+desc&queryoption=TEACHER&queryBy=schoolId&sid=1967");
    const data_json = await r.json();
    totalProfessors = data_json.searchResultsTotal;
})();


function timeout(){
    getProfessorData();

    professors = []
    var table = document.getElementsByClassName("table table-schedule table-hover mix-container")[0];
    var tableBody = table.getElementsByTagName('tbody')[0];
    var tableRow = tableBody.getElementsByTagName('tr');

    for (var t = 0; t < tableRow.length; t++){
        var a = tableRow[t].getElementsByTagName('a');
        for (var i = 0; i < a.length; i++){         
            if (i == 2){

                tableSpot = tableRow[t].getElementsByTagName('td');

                // Some new/temp professors have commas in between first and last name
                var name = a[i].innerHTML.replace(',', '');
                name = name.toString().toUpperCase();
                professors.push(name);
                console.log("LOOKING FOR: " + name);
                
                injectRating(tableSpot[7], name);

            }
        }
    }   
}


async function injectRating(body, profName){

    // Getting the professor object from the the Chrome Local Storage
    var pDataObj = await read(profName);
    pDataObj = JSON.stringify(pDataObj)

    if (pDataObj == JSON.stringify({})){
        console.log("Could not find a pDataObj for: " + profName);
    }
    else{
        console.log("pdataObj is: " + pDataObj);

        var pos = pDataObj.indexOf("averageRating") + 16;
        var pRating = pDataObj.substring(pos, pos+3);
        var pos_URL = pDataObj.indexOf("url") + 6;
        var pURL = pDataObj.slice(pos_URL, -3);

        console.log(`\n${profName}'s rating is: ${pRating}`);
        console.log(`\n${profName}'s URL is: ${pURL}`);

        var displayInfo = document.createElement('a');
        displayInfo.innerHTML = "\n" + pRating + "/5.0"
        displayInfo.href = pURL;
        displayInfo.style.fontWeight = "bold";

        switch(true)
        {
            case(pRating >= 4.0):
                displayInfo.style.color = "#0eba83";
                break;
            case(pRating >= 3.0):
                displayInfo.style.color = "#9b8b00";
                break;
            case(pRating >= 0.0):
                displayInfo.style.color = "#a50000";
                break;
        }

        // temp for a space between the professor name and rating when injecting the rating
        var temp = document.createElement('a');
        temp.innerHTML = " ";

        body.appendChild(temp);
        body.appendChild(displayInfo);
    }
}


function getProfessorData(){
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

                fullName = (firstName + " " + lastName).toString().toUpperCase();

                //console.log(`${fullName} ${teacherID} ${numRatings} ${averageRating}`);
                professorObj = new Professor(firstName, lastName, teacherID, numRatings, averageRating);
                
                // Saving all professor data to chrome storage
                dataObj = {};
                dataObj[fullName] = professorObj;
                chrome.storage.local.set(dataObj, function(){
                    console.log("Value is set to: " + professorObj);
                });
            }
        }
    })();
}


function read(key){
    return new Promise((resolve, reject) => {
        if (key != null) {
            chrome.storage.local.get(key, function (obj) {
                resolve(obj);
            });
        } else {
            reject(null);
        }
    });
}


setTimeout(timeout, 3500);
