'use strict';
function Image(url, title, description, keyword, horns) {
  this.title = title;
  this.url = url;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
}

Image.allImages = [];

Image.readJson = () => {
  $.getJSON('../data/page-1.json')
    .then(data => {
      data.forEach(element => {
        Image.allImages.push(new Image(element));
      });
    },console.log('no JSON')
    );

  console.table(Image.allImages);
  //.then(Imgae.loadImage);
};

$(() => {
  Image.readJson();
  console.log('Hello');
});

