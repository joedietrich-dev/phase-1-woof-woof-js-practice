"use strict";

const dogBar = document.getElementById('dog-bar');
const dogDetails = document.getElementById('dog-info');
const filterButton = document.getElementById('good-dog-filter');

app()

async function app() {
  const res = await fetch('http://localhost:3000/pups');
  const dogData = await res.json();
  const dogs = dogData.map(dogDatum => new Dog(dogDatum));
  let areDogsFiltered = false;

  // Initial Render
  dogs.forEach(dog => dog.renderMenuItem(dogBar));
  addNavLinks();

  // Filter
  filterButton.addEventListener('click', (e) => {
    dogBar.innerHTML = '';
    dogDetails.innerHTML = '';
    if (areDogsFiltered) {
      filterButton.innerText = 'Filter good dogs: OFF';
      dogs.forEach(dog => dog.renderMenuItem(dogBar));
      addNavLinks();
      areDogsFiltered = false;
    } else {
      filterButton.innerText = 'Filter good dogs: ON';
      dogs.filter(dog => dog.isGoodDog === true).forEach(dog => dog.renderMenuItem(dogBar));
      addNavLinks();
      areDogsFiltered = true;
    }
  })

  function addNavLinks() {
    const dogLinks = document.querySelectorAll('.dog-link');
    dogLinks.forEach(dogLink => dogLink.addEventListener('click', (e) => {
      dogDetails.innerHTML = '';
      const dog = findDogFromName(e.target.innerText);
      dog.renderDetails(dogDetails, () => toggleGoodDog(dog));
    }));
  };

  function findDogFromName(name) {
    return dogs.find(dog => dog.name === name);
  }

  function toggleGoodDog(dog) {
    fetch(`http://localhost:3000/pups/${dog.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: dog.id, isGoodDog: !dog.isGoodDog }),
    })
      .then(res => res.json())
      .then(data => {
        dog.isGoodDog = !dog.isGoodDog;
        const button = document.querySelector('#good-dog-button')
        button.innerText = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      })

  }
}



class Dog {
  constructor({ id, name, isGoodDog, image }) {
    this.id = id;
    this.name = name;
    this.isGoodDog = isGoodDog;
    this.image = image;
  }

  renderMenuItem(parent) {
    const dogSpan = document.createElement('span');
    dogSpan.classList.add('dog-link')
    dogSpan.innerText = this.name;

    parent.append(dogSpan);
    return dogSpan;
  }

  renderDetails(parent, callback) {
    const dogImage = document.createElement('img');
    dogImage.src = this.image;

    const dogName = document.createElement('h2');
    dogName.innerText = this.name;

    const dogGood = document.createElement('button');
    dogGood.innerText = this.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
    dogGood.id = 'good-dog-button';
    dogGood.addEventListener('click', callback);

    parent.append(dogImage, dogName, dogGood);
    return dogGood;
  }
}