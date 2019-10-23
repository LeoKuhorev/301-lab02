'use strict';
function Image(object) {
  this.title = object.title;
  this.url = object.image_url;
  this.description = object.description;
  this.keyword = object.keyword;
  this.horns = object.horns;
}

Image.allImages = [];

Image.readJson = () => {
  $.getJSON('../data/page-1.json')
    .then(data => {
      data.forEach(element => {
        Image.allImages.push(new Image(element));
      });
    })
    .then(()=>{
      Image.loadImages();
      console.table(Image.allImages);
    });
};

Image.prototype.render = function(){
  $('main').append('<div class="clone"></div>');
  let imageClone = $('.clone');

  let imageHtml = $('#photo-template').html();

  imageClone.html(imageHtml);

  imageClone.find('h2').text(this.title);
  imageClone.find('img').attr('src',this.url);
  imageClone.find('p').text(this.description);
  imageClone.removeClass('clone');
};
Image.loadImages = () => {
  Image.allImages.forEach((element)=> element.render());
console.log('Load iImage');
};

$(() => {
  Image.readJson();
  console.log('Hello');
});



