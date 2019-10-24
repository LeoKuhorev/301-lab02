'use strict';

function Image(object) {
  this.title = object.title;
  this.url = object.image_url;
  this.description = object.description;
  this.keyword = object.keyword;
  this.horns = object.horns;
}

Image.allImages = [];
Image.keywords = [];

//get data from file, instantiate images
Image.readJson = () => {
  $.getJSON('./data/page-1.json')
    .then(data => {
      data.forEach(element => {
        Image.allImages.push(new Image(element));
      });
    })
    .then(() => {
      Image.loadImages();
      Image.loadOptions();
    });
};

//render each individual picture to the screen
Image.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let imageClone = $('.clone');
  let imageHtml = $('#photo-template').html();

  imageClone.html(imageHtml);
  imageClone.find('h2').text(this.title);
  imageClone.find('img').attr('src', this.url);
  imageClone.find('img').attr('alt', this.keyword);
  imageClone.find('p.horns').text(`Horns: ${this.horns}`);
  imageClone.find('p:not(.horns)').text(this.description);
  imageClone.removeClass('clone');
  imageClone.addClass(`image ${this.keyword}`);

  Image.renderedElements.push(this);
};

//call render for every available image
Image.loadImages = () => {
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
  Image.allImages.forEach((element) => element.renderOption());
  $('select[class="keyword"]').on('change', filterImages);
};

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

//remove all images and renderElements array
function removeAllImages() {
  let $divEls = $('div.image');
  $divEls.detach();
  Image.renderedElements = [];
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
    removeAllImages();
    renderedTitles.forEach(title => {
      Image.allImages.forEach(element => {
        if(title === element.title) {
          element.render();
        }
      });
    });
  } else if ($selectEl === 'sort-low-to-high'
  || $selectEl === 'sort-high-to-low') {
    const tmpRenderedElenemts = Image.renderedElements;
    //get unique number of horns
    const uniqueHorns = [renderedHorns[0]];
    for (let i = 1; i < renderedHorns.length; i++) {
      if(renderedHorns[i] !== renderedHorns[i-1]) {
        uniqueHorns.push(renderedHorns[i]);
      }
    }
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

// EXECUTING CODE ON PAGE LOAD
$(() => {
  Image.readJson();
  $('select[class="sort"]').on('change', sortImages);
});
