(function () {

  const mainElement = document.querySelector("main");
  const navLinks = document.querySelectorAll("#mainnav ul li a");
  let filmData;
  let dataSet = "films";
  let url = 'https://ghibliapi.herokuapp.com/films';

  function setSort(arrary) {
    const sortOrder = document.getElementById("sortorder").value;
    switch (sortOrder) {
      case "title": arrary.sort((a, b) => (a.title > b.title) ? 1 : -1); break;
      case "release_date": arrary.sort((a, b) => (a.release_date > b.release_date) ? 1 : -1); break;
      case "rt_score": arrary.sort((a, b) => (parseInt(a.rt_score) > parseInt(b.rt_score)) ? -1 : 1); break;
    }
  }

  function addCards(array) {
    array.forEach(eachitem => {
      createCard(eachitem);
    });
  }

  function filmCardContents(data) {
    let html = `<h2>${data.title}</h2>`;
    html += `<p><strong>Director:</strong> ${data.director}</p>`;
    html += `<p><strong>Released:</strong> ${data.release_date}</p>`;
    html += `<p>${data.description}</p>`;
    html += `<p><strong>Rotten Tomatoes Score:</strong> ${data.rt_score}</p>`;
    return html;
  }

  async function createCard(data) {
    const card = document.createElement('article');
    switch (dataSet) {
      case 'films': card.innerHTML = filmCardContents(data); break;
      case 'people': card.innerHTML = await peopleCardContents(data); break;
      case 'locations': card.innerHTML = await locationCardContents(data); break;
      case 'species': card.innerHTML = await speciesCardContents(data); break;
      case 'vehicles': card.innerHTML = await vehiclesCardContents(data); break;
    }
    mainElement.appendChild(card);
  }

  async function peopleCardContents(data) {
    const thefilms = data.films;
    let filmtitles = [];
    for (eachFilm of thefilms) {
      const filmTitle = await indivItem(eachFilm, "title");
      filmtitles.push(filmTitle);
    }
    const species = await indivItem(data.species, 'name');
    let html = `<h2>${data.name}</h2>`;
    html += `<p><strong>Details:</strong> gender ${data.gender}, age ${data.age}, eye color ${data.eye_color}, hair color ${data.hair_color}</p>`;
    html += `<p><strong>Films:</strong> ${filmtitles.join(', ')}</p>`;
    html += `<p><strong>Species:</strong> ${species}</p>`;
    return html;
  }

  async function locationCardContents(data) {
    const regex = 'https?:\/\/';
    const theResidents = data.residents;
    let residentNames = [];
    for (eachResident of theResidents) {
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

  async function vehiclesCardContents(data) {
    let html = `<h2>${data.name}</h2>`;
    html += `<p><strong>Description:</strong> ${data.description}</p>`;
    html += `<p><strong>Vehicle Class:</strong> ${data.vehicle_class}</p>`;
    html += `<p><strong>Length:</strong> ${data.length} feet</p>`;
    html += `<p><strong>Pilot:</strong> ${await indivItem(data.pilot, 'name')}</p>`;
    html += `<p><strong>Film:</strong> ${await indivItem(data.films, 'title')}</p>`;
    return html;
  }

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

  async function getData(url) {
    const dataPromise = await fetch(url);
    const data = await dataPromise.json();
    if (dataSet === 'films') {
      mainElement.innerHTML = '';
      setSort(data);
      addCards(data);
      filmData = data;
      document.querySelector('nav form').style.visibility = "visible";
      document.getElementById('sortorder').removeAttribute('disabled');
    }
    else {
      mainElement.innerHTML = '';
      document.querySelector('nav form').style.visibility = "hidden";
      addCards(data);
    }
  }

  getData(url);

  document.getElementById("sortorder").addEventListener("change", function () {
    mainElement.innerHTML = "";
    setSort(filmData);
    addCards(filmData);
  });

  navLinks.forEach(function (eachLink) {
    eachLink.addEventListener('click', function (event) {
      event.preventDefault();
      const thisLink = event.target.getAttribute('href').substring(1);
      url = 'https://ghibliapi.herokuapp.com/' + thisLink;
      dataSet = thisLink;
      getData(url);
    });
  });
}());