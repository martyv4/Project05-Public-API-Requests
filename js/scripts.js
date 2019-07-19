
/*
  $(document).ready(() => {
    https://learn.jquery.com/using-jquery-core/document-ready/
    Definition from w3schools: A page can't be manipulated safely until the document is "ready."
  let people = [];
    array to store Person objects created

  let cursorPersonIdx = -1;
    store the cursorrent index of person displayed in the modal dialog (0-11) set it to -1 when no one is being displayed
    We are maintaining the cursorrent position in the array of people.
    The initial page is -1

  const addClickEvent = ($elements, person, idx) => {
      Adds a click event listener to open the modal representing the current Person's card
      cursorPersonIdx = idx;
      .on
          https://www.w3schools.com/jquery/event_on.asp
          definition from w3schools:  "The on() method attaches one or more event handlers for the selected elements and child elements."
*/
$(document).ready(() => {

  let people = [];
  let cursorPersonIdx = -1;

   const addClickEvent = ($elements, person, idx) => {
    $elements.on('click', () => {
        cursorPersonIdx = idx;    //set the global cursorPersonIdx to param idx
        addModalDialogToBody();   //add the modal dialog to the DOM
        drawModalPanel(person);   //and then draw the panel inside for the param person
    });
  };

  /*
    jQuery AJAX action:
      get JavaScript Object Notation (JSON) response from the randomuser URI for 12 people, nationality US
      (as required for searching) - if response is success, build Person, add to array and add their cards to
      the gallery

      Create a callback function using jquery’s ajax method
          o	So the method takes on properties itself
          	I passed on a function
    Test: console.log(json);
    Test: console.log(JSON.stringify(json.results, null, 4));
          beautify the text, 4 is 4 spaces per level

    $.each(json.results, (idx, result) => {
        foreach loop, idx means index, result means each object to each element in the results json array

    addClickEvent($cardDiv, person, idx);
        add click event to entire cardDiv

    if instead to add events to employee attributes do this:
        addClickEvent($cardDiv.find('h3, .card-text, .card-name, .card-img'), person, idx);

    Converted jQuery:
        $.each(json.results, (idx, result) => {});

    Example of JavaScript
        for (let idx = 0; idx < json.results.length; idx++) {
              const result = json.results[idx];
        }
    success: (json) => { const $galleryDiv = $("#gallery");
        variable 'json' is the response from the URL, automatically cast as
        a JSON object.

    .push
        puts it to the end of the array
*/

  $.ajax({
      url: 'https://randomuser.me/api/?results=12&nat=us',
      dataType: 'json',
      success: (json) => {
         const $galleryDiv = $("#gallery");
         $.each(json.results, (idx, result) => {
            const person = new Person(result.name, result.picture.medium, result.email, result.cell, result.location, result.dob.date);
            people.push(person);
            const $cardDiv = person.addCardToGallery($galleryDiv);
            addClickEvent($cardDiv, person, idx);
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
    $("#noresults").remove();
    const searchTerm = $('#search-input').val();
    let resultsFound = 0;
    $cards = $('.card');
    for(let idx = 0; idx < $cards.length; idx++){
      const $cursorCard = $cards.eq(idx);
      if (people[idx].name.toLowerCase().includes(searchTerm.toLowerCase()))
      {
        $cursorCard.show();
        resultsFound += 1;
      }
      else
      {
        $cursorCard.hide();
      }
    }
    if (resultsFound == 0)
    {
      const noResultsMesg = '<h2 id="noresults">No results found</h2>';
      $("#gallery").append($(noResultsMesg));
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
    if (cursorPersonIdx == 0)
    {
      $prevButton.hide();
    }
    else
    {
      $prevButton.show();
    }

    //hide NEXT button if you're on idx people.length-1 (last item)
    if (cursorPersonIdx == people.length-1)
    {
      $nextButton.hide();
    }
    else
    {
      $nextButton.show();
    }
    //Here I need to convert the plain html to JavaScript.
    //modal person panel interior with strings inserted into key points
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

    //Use the new JavaScript variable created above and convert to a jQuery variable
    //create jQuery DOM element from baseHtml string
    const $modalElement = $(baseHtml);

    //I can use the jQuery variable $modalElement in the event listener
    //event listener: close the modal when clicking the X
    $modalElement.find('.modal-close-btn').on('click', () => {
      removeModalPanel();
      removeModalDialogFromBody();
      cursorPersonIdx = -1;
    });

    //$modalElement.attr('display', 'block');
    //add the person panel to the modal container
    $('.modal-container').prepend($modalElement);
    };

     /**
     * addModalDialogToBody - append modal dialog frame to DOM
     * let baseHtml - create a string containing the html for the modal dialog
     *
     *
     */
    const addModalDialogToBody = () => {
      //modal dialog is the modal-container and a container with two buttons
      //a panel per-person will reside inside of the modal container, above the button panel
      let baseHtml = `<div class="modal-container"><div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div></div>`;


      const $modalElement = $(baseHtml);         //create jQuery DOM element from baseHtml string
      $('body').append($modalElement);           //append the $modalElement to the body

      //add click events for the PREV and NEXT buttons
      const $prevButton = $(".modal-prev");
      const $nextButton = $(".modal-next");

      $prevButton.on('click', () => {
        cursorPersonIdx -= 1;
        removeModalPanel();
        drawModalPanel(people[cursorPersonIdx]);
      });

      $nextButton.on('click', () => {
        cursorPersonIdx += 1;
        removeModalPanel();
        drawModalPanel(people[cursorPersonIdx]);
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