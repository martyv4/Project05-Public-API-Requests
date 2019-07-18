
$(document).ready(() => {
  //array to store Person objects created
  let people = [];
  //store the current index of person displayed in the modal dialog
  let curPersonIdx = -1;

  //adds a click event to open the modal representing the current Person's card
  //set the global curPersonIdx to param idx, add the modal dialog to the DOM
  //and then draw the panel inside for the param person
  const addClickEvent = ($elements, person, idx) => {
    $elements.on('click', () => {
        curPersonIdx = idx;
        addModalDialogToBody();
        drawModalPanel(person);
    });
  };

  /*
  AJAX action: get JSON response from the randomuser URI for 12 people, nationality US
  (as required for searching) - if response is success, build Person, add to array and add their cards to
  the gallery
  */
  $.ajax({
      url: 'https://randomuser.me/api/?results=12&nat=us',
      dataType: 'json',
      success: (json) => {
        
        //console.log(json);   
        //console.log(JSON.stringify(json.results, null, 4));     // beautify the text, 4 is 4 spaces per level
        const $galleryDiv = $("#gallery");
        $.each(json.results, (idx, result) => {                 // foreach loop, idx means index, result means each object to each element in the results json array
          const person = new Person(result.name, result.picture.medium, result.email, result.cell, result.location, result.dob.date);
          people.push(person);
          const $cardDiv = person.addCardToGallery($galleryDiv);
          addClickEvent($cardDiv.find('h3, .card-text, .card-name, .card-img'), person, idx);
        });
      }
    });

    //search FORM element to be added to document
    const searchHtml = `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;

    const $searchElement = $(searchHtml);
    $('.search-container').append($searchElement);

    //click event listener for FORM's button - run the search on click
    $('#search-submit').on('click', () => {
      const searchTerm = $('#search-input').val();
      $cards = $('.card');
      for(let idx = 0; idx < $cards.length; idx++){
        const $curCard = $cards.eq(idx);
        if (people[idx].name.toLowerCase().includes(searchTerm.toLowerCase()))
        {
          $curCard.show();
        }
        else
        {
          $curCard.hide();
        }
      }
    });

    /**
     * removeModalPanel - delete the modal panel from the DOM
     *  
     */
    const removeModalPanel = () => {
      $(".modal").remove();
    };

    /**
     * drawModalPanel - append details for a person to the modal dialog
     *  
     * @param: person - the Person object to draw the panel for
     */
    const drawModalPanel = (person) => {
      //find the PREV and NEXT buttons in the modal dialog
      const $prevButton = $(".modal-prev");
      const $nextButton = $(".modal-next");

      //hide PREV button if you're on idx 0 (first item)
      if (curPersonIdx == 0)
      {
        $prevButton.hide();
      }
      else
      {
        $prevButton.show();  
      }

      //hide NEXT button if you're on idx people.length-1 (last item)
      if (curPersonIdx == people.length-1)
      {
        $nextButton.hide();
      }
      else
      {
        $nextButton.show();
      }

      //modal person panel interior wiht strings inserted into key points
      let baseHtml = `<div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
          <img class="modal-img" src="${person.image}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${person.name}</h3>
          <p class="modal-text">${person.email}</p>
          <p class="modal-text cap">${person.citystate}</p>
          <hr>
          <p class="modal-text">${person.cell}</p>
          <p class="modal-text">${person.address}</p>
          <p class="modal-text">Birthday: ${person.birthday}</p>
      </div>
      </div>`;

      /*
      //make replacements in the modal interior HTML
      baseHtml = baseHtml.replace("{PERSON_IMAGE}", person.image);
      baseHtml = baseHtml.replace("{PERSON_NAME}", person.name);
      baseHtml = baseHtml.replace("{PERSON_EMAIL}", person.email);
      baseHtml = baseHtml.replace("{PERSON_CITYSTATE}", person.citystate);
      baseHtml = baseHtml.replace("{PERSON_CELL}", person.cell);
      baseHtml = baseHtml.replace("{PERSON_ADDRESS}", person.address);
      baseHtml = baseHtml.replace("{PERSON_BIRTHDAY}", person.birthday);
      */

      //create jQuery DOM element from baseHtml string
      const $modalElement = $(baseHtml);

      //event listner: close the modal when clicking the X
      $modalElement.find('.modal-close-btn').on('click', () => {
        removeModalPanel();
        removeModalDialogFromBody();
        curPersonIdx = -1;
      });

      //$modalElement.attr('display', 'block');
      //add the person panel to the modal container
      $('.modal-container').prepend($modalElement);
    };

     /**
     * addModalDialogToBody - append modal dialog frame to DOM
     *  
     */
    const addModalDialogToBody = () => {
      //modal dialog is the modal-container and a container with two buttons
      //a panel per-person will reside inside of the modal container, above the button panel
      let baseHtml = `<div class="modal-container"><div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div></div>`;

      //create jQuery DOM element from baseHtml string
      const $modalElement = $(baseHtml);

      //$modalElement.attr('display', 'block');
      $('body').append($modalElement);

      //add click events for the PREV and NEXT buttons
      const $prevButton = $(".modal-prev");
      const $nextButton = $(".modal-next");

      $prevButton.on('click', () => {
        curPersonIdx -= 1;
        removeModalPanel();
        drawModalPanel(people[curPersonIdx]);
      });

      $nextButton.on('click', () => {
        curPersonIdx += 1;
        removeModalPanel();
        drawModalPanel(people[curPersonIdx]);
      });
    };

    /**
     * removeModalDialogFromBody - remove the entire modal dialog from the view (return to cards)
     *  
     */
    const removeModalDialogFromBody = () => {
      $('.modal-container').remove();
    };

});
  

/*
$.each(json.results, (idx, result) => {});

jQuery forEach example using JavaScript

  for (let idx = 0; idx < json.results.length; idx++) {
      const result = json.results[idx];
      
  }
*/