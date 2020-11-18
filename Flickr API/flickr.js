/*global $*/
(function () {
  "use strict";

  const picContainerElem = $("#picContainer");
  let sourceIndex = 0;
  //const carousel = $("#carousel");
  //carousel.hide();
  picContainerElem.hide();

  $("#searchButton").click(function () {
    picContainerElem.empty();
    let searchVal = $("#searchBox").val();
    $("#searchBox").val("");
    picContainerElem.show();
    getData(searchVal, 20);
  });
    //Plan to add ability to adjust number of returned images. Not possible with Free Flickr API
    function getData(searchVal, amount){
      $.getJSON(
        `https://api.flickr.com/services/feeds/photos_public.gne?tags=${searchVal}&format=json&jsoncallback=?`,
        function (data) {
          $("#modal").hide();
          $("#carouselContainer").show();
          let picArray = data.items;
          picArray.forEach((imgObject,index) => {
            $(`<div ><img src=${imgObject.media.m}></div>`)
              .appendTo(picContainerElem).click(()=>{
                document.getElementById(
                  "carousel"
                ).style.backgroundImage = `url(${imgObject.media.m})`;
                sourceIndex = index;
              });
              //.append($(`<span class="pictureTitle">${imgObject.title}</span>`));
            console.log(imgObject);
          });
          const rightArrow = $("#rightArrow");
          const leftArrow = $("#leftArrow");
  
         // console.log("clicked");
          document.getElementById(
            "carousel"
          ).style.backgroundImage = `url(${picArray[sourceIndex].media.m})`;
  
          rightArrow.click(function () {
            if (sourceIndex === picArray.length - 1) {
              sourceIndex = -1;
            }
  
            document.getElementById("carousel").style.backgroundImage = `url(${
              picArray[++sourceIndex].media.m
            })`;
          });
          leftArrow.click(function () {
            if (sourceIndex === 0) {
              sourceIndex = picArray.length;
            }
            document.getElementById("carousel").style.backgroundImage = `url(${
              picArray[--sourceIndex].media.m
            })`;
          });
        }
      );
    }
    
 

  
})();
