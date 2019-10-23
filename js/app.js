'use strict';

function Image(object) {
  this.title = object.title;
  this.url = object.image_url;
  this.description = object.description;
  this.keyword = object.keyword;
  this.horns = object.horns;
}

Image.allImages = [];
Image.renderedElements = [];
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
  imageClone.find('p').text(this.description);
  imageClone.removeClass('clone');
  imageClone.addClass(`image ${this.keyword}`);
};

//call render for every available image
Image.loadImages = () => {
  Image.renderedElements = [];
  Image.allImages.forEach((element) => {
    element.render();
    Image.renderedElements.push(element);
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
  Image.renderedElements = [];
  Image.allImages.forEach((element) => {
    if($selectEl === element.keyword || $selectEl === 'default') {
      element.render();
      Image.renderedElements.push(element);
    }
  });
  $('.sort').val('default');
}

function removeAllImages() {
  let $divEls = $('div.image');
  $divEls.detach();
}

//sort images by title
function sortImages() {
  // const renderedTitles = [];
  // for(let i = 0; i < Image.renderedElements.length; i++) {
  //   renderedTitles.push(Image.allImages[Image.renderedElements[i]].title);
  // }
  Image.renderedElements.sort();
  let $selectEl = $(this).val();
  if($selectEl === 'sort-ascending') {
    removeAllImages();
    renderedTitles.forEach(title => {
      Image.allImages.forEach(element => {
        if(title === element.title) {
          element.render();
        }
      });
    });
  } else if ($selectEl === 'sort-descending') {
    renderedTitles.reverse();
    removeAllImages();
    renderedTitles.forEach(title => {
      Image.allImages.forEach(element => {
        if(title === element.title) {
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
