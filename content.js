console.log("Hello from content.js");
const nicknames = {
    "JIAN YU": "JIAN (ANDREW) YU",
    "PAUL DU": "JIANBO (PAUL) DU",
    "SOL PARAJON PUENZO": "SOL PUENZO",
    "EDWARD AHRENS": "ED AHRENS",
    "ALEXANDRE STOYKOV": "ALEX STOYKOV",
    "RAYMAND BUYCO": "RAY BUYCO",
    "JULIE KEIFFER-LEWIS": "JULIE LEWIS",
    "BEN KLINE": "BENJAMIN KLINE",
    "SO KAM LEE": "SO LEE",
    "RODERIC TAYLOR": "RODERIC (RICK) TAYLOR",
    "CHRISTIE TSUJI": "CHRIS TSUJI",
    "VICKY ANNEN": "VICKIE ANNEN",
    "ROBERT KALPIN": "BOB KALPIN",
    "LAKSHMIKANTA SENGUPTA": "SENGUPTA LAKSHMIKANTA",
    "SCOTT OSBORNE": "L. SCOTT OSBORNE",
    "LAURI HAMMOND": "HAMMOND LAURIE",
    "JEFFREY WEST": "JEFF WEST",
    "ROBERT SLATE": "BOB SLATE",
    "TONY SANTA ANA": "ANTHONY SANTA ANA",
    "BENETT ZUSSMAN:": "BENNET ZUSSMAN",
    "JAMES SCHNEIDER": "JAMES SCHNEIDER",
    "JAMES CLIFFORD JR": "JAMES CLIFFORD",
    "RUSTY JOHNSON": "MARK JOHNSON",
    "CLARE NGUYEN": "UYEN (CLARE) NGUYEN",
    "NGUYEN VINH KHA": "VINH NGUYEN",
    "ZACK JUDSON": "ZACHARY JUDSON",
    "MO GERAGHTY": "MAURICE GERAGHTY"
}

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

async function main(){
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

                if (name in nicknames){
                    name = nicknames[name];
                }

                professors.push(name);
                console.log("Injecting data for: " + name);

                var pDataObject = await read(name);
                injectRating(tableSpot[7], pDataObject);

            }
        }
    }   
}

async function injectRating(body, pDataObj){

    // Getting the professor object from the the Chrome Local Storage
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

        //console.log(`\n${profName}'s rating is: ${pRating}`);
        //console.log(`\n${profName}'s URL is: ${pURL}`);

        var displayInfo = document.createElement('a');
        displayInfo.innerHTML = "\n" + pRating + "/5.0"
        displayInfo.href = pURL;
        displayInfo.setAttribute('target', '_blank');
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

                if (numRatings == 0){
                    continue;
                }

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

setTimeout(main, 750);
