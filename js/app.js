'use strict';

// ***GLOBAL VARIABLES***
const pageOne = './data/page-1.json';
const pageTwo = './data/page-2.json';

// ***CONSTRUCTOR FUNCTION***
function Image(object) {
  for(let key in object) {
    this[key] = object[key];
  }
}

//get data from file, instantiate objects, render images
Image.readJson = (json) => {
  $.getJSON(json)
    .then(data => {
      Image.allImages = [];
      data.forEach(element => {
        Image.allImages.push(new Image(element));
      });
      Image.allImages = Image.allImages.sort( (a, b) => (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0);
    })
    .then(() => {
      Image.loadImages();
      Image.loadOptions();
    });
};

//render each individual picture to the screen from a template
Image.prototype.render = function() {
  let divEl = $('<div class = "image"></div>');
  $('main').append(divEl);

  let templateScript = $('#template').html();
  let template = Handlebars.compile(templateScript);
  let templateHTML = template(this);
  divEl.html(templateHTML);
  divEl.on('click', imgZoom);

  Image.renderedElements.push(this);
};

//call render for every available image
Image.loadImages = () => {
  removeAllImages();
  Image.renderedElements = [];
  Image.allImages.forEach((element) => {
    element.render();
  });
};

//render each individual option element if keyword is unique
Image.prototype.renderOption = function() {
  if (!Image.keywords.includes(this.keyword)){
    Image.keywords.push(this.keyword);
    $('select[class="keyword"]').append(`<option value = ${this.keyword}>${this.keyword}</option>`);
  }
};

//render all option elements
Image.loadOptions = () => {
  $('.keyword').children().slice(1).remove();
  Image.keywords = [];

  Image.allImages.forEach((element) => element.renderOption());
  $('select[class="keyword"]').on('change', filterImages);
};

// ***HELPER FUNCTIONS***
//remove all images and renderElements array
function removeAllImages() {
  let $divEls = $('div.image');
  $divEls.detach();
  Image.renderedElements = [];
}

//getting only unique elements from a sorted array
function getUnique(sortedArray) {
  const uniqueArray = [sortedArray[0]];
  for (let i = 1; i < sortedArray.length; i++) {
    if(sortedArray[i] !== sortedArray[i-1]) {
      uniqueArray.push(sortedArray[i]);
    }
  }
  return uniqueArray;
}

// ***EVENT HANDLERS***
//filter rendered images basing on user selection
function filterImages() {
  let $selectEl = $(this).val();
  removeAllImages();
  Image.allImages.forEach((element) => {
    if($selectEl === element.keyword || $selectEl === 'default') {
      element.render();
    }
  });
  $('.sort').val('default');
}

function imgZoom() {
  //find object for current picture
  let imgSrc = $(this).find('img').attr('src');
  let thisObject;
  Image.allImages.forEach(element => {
    if(imgSrc === element.image_url) {
      thisObject = element;
    }
  });

  //render modal
  $('.modal').remove();
  let $divEl = $('<div class="modal">');
  let templateScript = $('#modal').html();
  let template = Handlebars.compile(templateScript);
  let templateHTML = template(thisObject);
  $divEl.html(templateHTML);
  $('body').append($divEl);

  //close modal when clicked on close or outside of it's content
  $('.close').on('click', e => {
    if (e.target.className === 'close') {
      $divEl.fadeOut(300);
    }
  });

  $(window).on('click', e => {
    if (e.target.className === 'modal') {
      $divEl.fadeOut(300);
    }
  });
}

//sort images by title or number of horns
function sortImages() {
  let $selectEl = $(this).val();

  //get titles and horns of rendered images sorted ascending
  const renderedTitles = Image.renderedElements.map(element => element.title).sort();
  const renderedHorns = Image.renderedElements.map(element => element.horns).sort((a, b) => a - b);

  //if sort descending selected - reverse values
  if($selectEl === 'sort-descending') {
    renderedTitles.reverse();
  } else if($selectEl === 'sort-high-to-low') {
    renderedHorns.sort((a, b) => b - a);
  }

  //render elements basing on user selection
  if ($selectEl === 'sort-ascending'
  || $selectEl === 'sort-descending') {
    const uniqueTitles = getUnique(renderedTitles);
    removeAllImages();
    uniqueTitles.forEach(title => {
      Image.allImages.forEach(element => {
        if(title === element.title) {
          element.render();
        }
      });
    });
  } else if ($selectEl === 'sort-low-to-high'
  || $selectEl === 'sort-high-to-low') {
    const tmpRenderedElenemts = Image.renderedElements;
    const uniqueHorns = getUnique(renderedHorns);
    removeAllImages();
    uniqueHorns.forEach(horn => {
      tmpRenderedElenemts.forEach(element => {
        if(horn === element.horns) {
          element.render();
        }
      });
    });
  }
}

//***EXECUTING CODE ON PAGE LOAD***
$(() => {
  Image.readJson(pageOne);
  $('select[class="sort"]').on('change', sortImages);

  $('#page-one').on('click', function(){
    Image.readJson(pageOne);
    $('.sort').val('default');
  });

  $('#page-two').on('click', function(){
    Image.readJson(pageTwo);
    $('.sort').val('default');
  });
});
