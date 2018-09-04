const GIPHYHOSTNAME = "https://api.giphy.com/v1/gifs/";
const GIPHYAPIKEY = "W7NRSStCHnOsDz7Ku7xMCdTcpmGt5UxY";
var giphyRating = "G";
var numImgs = 12;
var ratings = ["Y", "G", "PG", "PG-13", "R"];

function RandRating() {
  giphyRating = ratings[Math.floor(Math.random() * ratings.length)];
}

function Loaded() {
  document.getElementById("tbSearch").placeholder = "Input search";
}

//$(document).ready(Trending());
document.addEventListener("DOMContentLoaded", function() {
  Trending();
});

function Search() {
  if (document.getElementById("tbSearch").value.length == 0) {
    GifLoader("trending");
  } else {
    GifLoader("search");
  }
  console.log("Search()");
}

function Trending() {
  document.getElementById("tbSearch").value = "";
  GifLoader("trending");
  console.log("Trending()");
}

function SearchFun() {
  document.getElementById("tbSearch").value = "funny";
  GifLoader("search");
  console.log("SearchFun()");
}

function SearchSports() {
  document.getElementById("tbSearch").value = "sports";
  GifLoader("search");
  console.log("SearchSports()");
}

function Random() {
  document.getElementById("tbSearch").value = "";
  GifLoader("random");
  console.log("Random()");
}

function GifLoader(type) {
  RandRating();
  var srchStr = document.getElementById("tbSearch").value;

  switch (type) {
    case "random":
      console.log("Random");
      var queryURL =
        GIPHYHOSTNAME +
        "random?api_key=" +
        GIPHYAPIKEY +
        "&tag=&rating=" +
        giphyRating;
      break;
    case "trending":
      console.log("Trending");
      var queryURL =
        GIPHYHOSTNAME +
        "trending?api_key=" +
        GIPHYAPIKEY +
        "&limit=" +
        numImgs +
        "&rating=" +
        giphyRating;
      break;
    case "search":
      console.log("Search");
      var queryURL =
        GIPHYHOSTNAME +
        "search?q=" +
        srchStr +
        "&api_key=" +
        GIPHYAPIKEY +
        "&limit=" +
        numImgs +
        "&rating=" +
        giphyRating;
      break;
  }
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    data: {},
    method: "GET",
    crossDomain: true,
    //success: function(response) { addGif(response); },
    error: function() {
      alert("Failed!");
    }
  }).done(function(response) {
    addGif(response);
  });
}

var addGif = function(response) {
  $(".gifs").empty();
  var results = response.data;
  console.clear;
  console.log(results);
  results.map;
  if (results.length > 1) {
    for (var i = 0; i < results.length; i++) {
      var gifDiv = $("<div>");
      gifDiv.addClass("gif");
      var gifImage = $("<img>");
      gifImage.attr("src", results[i].images.fixed_height.url);
      gifDiv.append(gifImage);
      $(".gifs").append(gifDiv);
    }
  } else {
    var gifDiv = $("<div>");
    gifDiv.addClass("gif");
    var gifImage = $("<img>");
    gifImage.attr("src", results.images.original.url);
    gifDiv.append(gifImage);
    $(".gifs").append(gifDiv);
  }
};