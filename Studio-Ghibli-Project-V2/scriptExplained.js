//In this project I've have taken data available through a free API (Studio Ghibili), processed it with JavaScript (JS), and then used asynchronous functions to manipulate the DOM and display the data on a web page. 

//Note: This is a single html project. There isn't any links to seperate html files in the index.html file. This single web page project displays film infromation data cards depending upon which tab users clicks on the webpage (e.g., films,  people,  location, etc).

//Note:The Studio Ghibli API provides data for Films, People, Locations, Species, and Vehicles.

/// *Resources Used*:
// GitHub Public APIs: https://github.com/public-apis/public-apis
// Studio Ghibli API: https://ghibliapi.herokuapp.com/#section/Studio-Ghibli-API
// Studio Ghibli film data URL endpoint: https://ghibliapi.herokuapp.com/films
// Studio Ghibli film data URL endpoint: https://ghibliapi.herokuapp.com/people
// Studio Ghibli film data URL endpoint: https://ghibliapi.herokuapp.com/locations
// Studio Ghibli film data URL endpoint: https://ghibliapi.herokuapp.com/species
// Studio Ghibli film data URL endpoint: https://ghibliapi.herokuapp.com/vehicles

//<----------------------------------/***Start Of Script***/---------------------------------->//

//This selects the "main" html element on the index.html file
const mainElement = document.querySelector("main");

//The navLinks variable gets all of the anchor tags in order to access them so I can access the associated urls and change the page based on which link is clicked.
const navLinks = document.querySelectorAll("#mainnav ul li a");

//Empty variable that will have data added to it later in the script.
let filmData;
//Dataset is initially going to be set to films, but when you click on "People", it should get changed to people. 
let dataSet = "films";
//URL which is initially set to films. But when you click on "People" or any other link, it will change to that.
let url = 'https://ghibliapi.herokuapp.com/films';


//This function fetches the data using the Ghibli API
async function getData(url) {
  const dataPromise = await fetch(url);
  const data = await dataPromise.json();
  //console.log(films);

  // Update the getFilms() function with the addCards() function, instead of the forEach loop that adds all the cards. Pass in the films array. Then assign that same films array to the filmData variable created in the global scope. 
  //setSort(films);
  //addCards(films);
  //filmData = films;

  //In this If-Else statment, if the dataSet is the same as films, then I'll empty out the innerHTML, set the sort to data, add the cards, pass in data (not films anymore), filmData is set to data, and I'm removing that disabled attribute . Then I'll have an else statment that's going to handle all the other types of cards, that'll have the main HTML that's set to empty, then I'll add the cards. 
  if (dataSet === 'films') {
    mainElement.innerHTML = '';
    setSort(data);
    addCards(data);
    filmData = data;
    document.querySelector('nav form').style.visibility = "visible"; ////This will make the sort drop down menu visable on the web page if the user is on the films tab.
    document.getElementById('sortorder').removeAttribute('disabled');
  }
  else {
    mainElement.innerHTML = '';
    document.querySelector('nav form').style.visibility = "hidden"; //This will hide the sort drop down menu on the web page if the user is not on the films tab.
    addCards(data);
  }

  //It is possible, although unlikely, that a user could try to use the sort order select list before the data has loaded from the API. This would run the addCard() function, which passes in the filmData array, which would be empty at this time, therefore throwing an error. After the all the data is collected fromt the API, the sortorder id will then be enabled and the user will be able to use that form to sort the data. 
  document.getElementById("sortorder").removeAttribute("disabled");

  // Below I'm using the sort function on the films variable to pass in an anonymous function w/ a turnery operator at the end of it. This function will compare each element in the array to the next element in the array (I'm taking the first element, A,  and its title, and comparing it to B's title). If A is greater than B then this is true and I'm going to give it a 1. If it's not true, I'm going to give it a -1. This will move it up if it's true or move it down if it's false. These films will then get sorted alphabetically by their title. 
  //films.sort((a, b) => (a.title > b.title) ? 1 : -1);

  //Run the setSort function here, make sure to pass in the films array object.
  //setSort(films);

  //Since the data that was collected is arrary object, I used a forEach loop to loop through each film collected from the data source, pass it through the createCard function below, and then display it on the page.  
  //films.forEach(eachfilm => {
  //createCard(eachfilm);
  //}); 

  //addCard(films);

  //filmData = films;


}

//Run the getFilms function.
getData(url);

//Add an event listener that will listen for when this form changes here (e.g., if somebody chooses release date or rotten tomatoes score).
document.getElementById("sortorder").addEventListener("change", function () {
  mainElement.innerHTML = ""; //This will clear out the html in the mainElement variable.
  //getFlims(); //Run the getFilms functiona again.

  ////Instead of running getFilms and getting the films all over again, use the filmData variable. Sort it with setSort(filmData), then add the cards with filmData by using addCards(filmdata) to add the cards after emptying out the cards that were there before and changing the sort. That'll set the sort and then add the cards, but it's doing it from filmData rather than going back to the API out on the Internet and getting it again from there.
  setSort(filmData);
  addCards(filmData);
});

//This click handler goes through all the nav links and for each one adds an event handler to it, as well as a prevent default behavior, so that it wont reload the page everytime. The variable "thisLink", which is the event target, gets an attribute "href" and a substring "1". It's going to remove the "#"" at the beginning of the href so that when you click on people, you'll just get people, not #people or If you click on vehicles, you'll get vehicles not #vehicles.
navLinks.forEach(function (eachLink) {
  eachLink.addEventListener('click', function (event) {
    event.preventDefault();
    const thisLink = event.target.getAttribute('href').substring(1);
    //Down here in this click handler when you click on these links, I need to change these two variables that I've set up at the top of the script. If you click on "Films", this link is going to be films. If it's people, then it needs to be set to people. The URL is going to be set to this URL + "thisLink" at the end. URL + "thisLink" at the end and the dataset are to this link. Then I'm going to run a function called getData. I'm going to pass in URL as its only parameter. This function "getData" is really going to be a rebranded version of the "getFilms" function. I'm going to change this to "getData" because it's no longer just getting the films, it's now going to be getting data because the data may not only be films, it could be people or location or something else.
    url = 'https://ghibliapi.herokuapp.com/' + thisLink;
    dataSet = thisLink;
    getData(url);
  });
});

//The functionc setSort, takes an array of items and sorts them based on if the user selects a different criteria in the nav bar. The variable "sortOrder" is going to get the value of whatever is selected in the nav bar and set the value to that. Then I'm going to use a switch statement to check the value of sortOrder here and switch it to whatever value was selected by the user (e.g., title, release_date, or rt_score).
function setSort(arrary) {
  const sortOrder = document.getElementById("sortorder").value;
  switch (sortOrder) {
    case "title": arrary.sort((a, b) => (a.title > b.title) ? 1 : -1); break;
    case "release_date": arrary.sort((a, b) => (a.release_date > b.release_date) ? 1 : -1); break;
    case "rt_score": arrary.sort((a, b) => (parseInt(a.rt_score) > parseInt(b.rt_score)) ? -1 : 1); break; // parseInt will will convert these two strings into numbers. At the end of this, I swap the order so I'm going to put -1 first and 1 last, so they populate in reverse order (100-0).
  }
}

//Simple helper function here that will allow us to create these cards by looping through an array.
function addCards(array) {
  array.forEach(eachitem => {
    createCard(eachitem);
  });

  //The function createCard() takes as an input data and uses a variable called "card" that creates an article element. card.innerHTML is going to come from film contents, which brings in data. Then I'm going to append the card to the main element. Most of the actions are going to happen here and down here in filmCardContents. 
  // function createCard(data) {
  //   const card = document.createElement('article');
  //   card.innerHTML = filmCardContents(data);
  //   mainElement.appendChild(card);
  // }

  //In order to get this to work, I have to update the createCard() function so that it creates the right cards depending on which link is clicked. Based on the dataset, I use a switch statement to swap in the correct data based on that case. E.g., If it's films, then I add the filmCardContents and run the cards in the card that way. If it's people, I going to use await because that has the asynchronous functions in it, and do that one there. 
  async function createCard(data) {
    const card = document.createElement('article');
    switch (dataSet) {
      case 'films': card.innerHTML = filmCardContents(data); break;
      case 'people': card.innerHTML = await peopleCardContents(data); break;
    }
    mainElement.appendChild(card);
  }


  //Here is the updated createCard() function, and a filmCardContents() function that will create the guts of the card.  In this function, I'm going to use innerHTML to create all the guts of the card, instead of using this create element and text node approach that I did in the first version of this project. The "let html ="" variable creates an H2 element with the appropriate data, and then the "html +="  adds the paragraphs elements and its data to it. Then it returns that HTML at the end. 
  function filmCardContents(data) {
    let html = `<h2>${data.title}</h2>`;
    html += `<p><strong>Director:</strong> ${data.director}</p>`;
    html += `<p><strong>Released:</strong> ${data.release_date}</p>`;
    html += `<p>${data.description}</p>`;
    html += `<p><strong>Rotten Tomatoes Score:</strong> ${data.rt_score}</p>`;
    return html;
  }


  //This asynchronous function will create the guts for the people card, without the films (Those get added next).
  async function peopleCardContents(data) {

    //To get the films I need, I can use a loop since the films are in an array. I'm making a variable "theFilm" that's equal to data.film and it will be an array. Then I make empty array called "filmTitles". Then for each film of the films, I'm looping through using a four of loop. I'm going to make the variable "filmTitle", use await, and then I use the indivItem function to get the title of the film. Then I use push to append the film title into the array. At the end I have an array here of just film titles. 
    const thefilms = data.films;
    let filmtitles = [];
    for (eachFilm of thefilms) {
      const filmTitle = await indivItem(eachFilm, "title");
      filmtitles.push(filmTitle);
    }
    const species = await indivItem(data.species, 'name'); // The individual item function will take the URL for the species from the people data and go retrieve the name of the species from the ap. So here I am running that individual item data species of passing that in down here for the URL. And then and the item I want is the name. So it's going to go get that URL via fetch and get the promise Json data and return that thing for that particular item data. 
    let html = `<h2>${data.name}</h2>`;
    html += `<p><strong>Details:</strong> gender ${data.gender}, age ${data.age}, eye color ${data.eye_color}, hair color ${data.hair_color}</p>`;
    // Before species, I'm going to add more to the HTML: P strong film, strong film titles. I'm using the joining method which will put a comma and a space after each one of the film titles. If there's more than one.
    html += `<p><strong>Films:</strong> ${filmtitles.join(', ')}</p>`;
    html += `<p><strong>Species:</strong> ${species}</p>`;
    return html;
  }




  //In the data for individual people in the API, there's an array for films but there's also a URL for the species for that person. I need to be able to go into that URL and pull out the species of the person from that URL. And if I want to get the title, I'm going to have to use it in a loop because the title is in an array. So this helper function can be used to go get those URLS notice asynchronously. I'm going to get an individual item. I'm going to pass into URL the item that I want and thenIe go get that item and we return it. And again if I'm going to use this with the films, I have to use it in a loop in order to get that to work. But this is going to be a helpful little helper function that I can use over and over again in this project.
  // async function indivItem(url, item) {
  //   const itemPromise = await fetch(url);
  //   const data = await itemPromise.json();
  //   return data[item];
  // }


  //Updated version of the commented out function above.
  //To deal with errors that were occuring from the data in the API's database, I use the "try, catch and finally" methods. Here the function will "try" to get the data. If it fails (and it will 20 times because of all the ""residents": ["TODO"]," that is present in the https://ghibliapi.herokuapp.com/locations data), the "catch" will fire and set the variable "theItem" = “no data available”. Then "finally" runs and returns "theItem", which either has the name of a resident (in this case) or it has “no data available”.
  async function indivItem(url, item) {
    var theItem;
    try {
      const itemPromise = await fetch(url);
      const data = await itemPromise.json();
      theItem = data[item];
    } catch (err) {
      theItem = "no data available";
    } finally {
      return theItem;
    }
  }

}
//The function locationCardContents performs essentially the task as the peopleCardContents function but is specific to the locations data set from the API database.
async function locationCardContents(data) {

  // I'm using a regular expression to check to see if when I get this, if I'm getting something that matches the regular expression and if it doesn't, I'm going to set that to new data available.
  const regex = 'https?:\/\/';
  const theResidents = data.residents; // Data from the API.
  let residentNames = []; //Empty array
  for (eachResident of theResidents) {  //Loops through each one of piece of data to find matches or non-matches. If it find a match, it's going to get the name and append it to the "residentNames" list. If it doesn't mactch, then it's going to set "residentNames" zero to no data available.
    if (eachResident.match(regex)) {
      const resName = await indivItem(eachResident, 'name');
      residentNames.push(resName);
    }
    else {
      residentNames[0] = 'no data available';
    }
  }
  const thefilms = data.films;
  let filmtitles = [];
  for (eachFilm of thefilms) {
    const filmTitle = await indivItem(eachFilm, 'title');
    filmtitles.push(filmTitle);
  }
  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Details:</strong> climate ${data.climate}, terrain ${data.terrain}, surface water ${data.surface_water}%</p>`;
  html += `<p><strong>Residents:</strong> ${residentNames.join(', ')}</p>`;
  html += `<p><strong>Films:</strong> ${filmtitles.join(', ')}</p>`;
  return html;
}

//speciesCardContents function works very similary to that of the peopleCardContents function; We've got species card contents, people, people names, etc. I'm going to push those into the array, same thing down further down with the film titles data. Push that into the array and then print this stuff out using "html +=" and then I'm joining the people names and film titles and returning the HTML.
async function speciesCardContents(data) {
  const people = data.people;
  let peopleNames = [];
  for (eachPerson of people) {
    const personName = await indivItem(eachPerson, "name");
    peopleNames.push(personName);
  }

  const thefilms = data.films;
  let filmtitles = [];
  for (eachFilm of thefilms) {
    const filmTitle = await indivItem(eachFilm, "title");
    filmtitles.push(filmTitle);
  }

  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Classification:</strong> ${data.classification}</p>`;
  html += `<p><strong>Eye Colors:</strong> ${data.eye_color}</p>`;
  html += `<p><strong>Hair Colors:</strong> ${data.hair_color}</p>`;
  html += `<p><strong>People:</strong> ${peopleNames.join(', ')}</p>`;
  html += `<p><strong>Films:</strong> ${filmtitles.join(', ')}</p>`;
  return html;
}

//The vehiclesCardContents function is a lot shorter since there isnt much data for vehicles. I'm simplying "html +=" to generate the html with the vehicles data and then returning the HTML.
async function vehiclesCardContents(data) {
  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Description:</strong> ${data.description}</p>`;
  html += `<p><strong>Vehicle Class:</strong> ${data.vehicle_class}</p>`;
  html += `<p><strong>Length:</strong> ${data.length} feet</p>`;
  html += `<p><strong>Pilot:</strong> ${await indivItem(data.pilot, 'name')}</p>`;
  html += `<p><strong>Film:</strong> ${await indivItem(data.films, 'title')}</p>`;
  return html;
}

//<----------------------------------/***End Of Script***/---------------------------------->//

