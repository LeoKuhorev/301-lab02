/* eslint-disable semi */
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

Image.readJson = () => {
  $.getJSON('../data/page-1.json')
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
  imageClone.addClass(this.keyword);
};

Image.loadImages = () => {
  Image.allImages.forEach((element)=> element.render());
};

Image.prototype.renderOption = function() {
  if (!Image.keywords.includes(this.keyword)){
    Image.keywords.push(this.keyword);
    $('select').append(`<option value = ${this.keyword}>${this.keyword}</option>`);
  }
};

Image.loadOptions = () => {
  Image.allImages.forEach((element) => element.renderOption());
  $('select').on('change', filterImage);
};

function filterImage() {
  let $selectEl = $(this).val();
  let $divEls = $('div');
  $divEls.detach();
  Image.allImages.forEach((element) => {
    if($selectEl === element.keyword || $selectEl === 'default') {
      element.render();
    }
  })
  // $(`div[class="${$selectEl}"]`).show();
}



// EXECUTING CODE ON PAGE LOAD

$(() => {
  Image.readJson();
});



