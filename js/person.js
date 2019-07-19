/**
 * capitalizeFirstLetter - 'static' function (does not rely on class properties)
 * 
 * @param: str = the string to capitalize
 * @return: string with the first character capitalized
 */

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);

    //cap("mr teapot dome") -> "Mr teapot dome"
    //cap("mr") + " " + cap("teapot") + " " +cap ("dome")
    //-> Mr Teapot Dome
}

/**
 * capitalizeEachWord - 'static' function (does not rely on class properties)
 * capitalize each word (separated by spaces) in the string
 * also capitalizes words with dashes (compound words)
 *  
 * @param: str = the string to capitalize each word of
 * @return: string with the first character of each word capitalized
 */

const capitalizeEachWord = (str) => {
    let retArray = [];
    const strArray = str.split(" ");
    strArray.forEach((word) => {
        const strSubArray = word.split("-"); //divide into array based on -
        let retSubArray = [];
        strSubArray.forEach((subword) => {
            retSubArray.push(capitalizeFirstLetter(subword)); //capitalize each piece
        });
        retArray.push(retSubArray.join("-"));  //recombine words divided by -
    });
    return retArray.join(" "); //recombine words divided by space
}

class Person {

/**
 * constructor - produce new instance of Person
 * 
 * @constructor
 * @param: nameJson - JSON object representing the name components
 * @param: imgStr - IMG URL for the person's pciture
 * @param: emailStr - email address string
 * @param: cellStr - cell number string
 * @param: locationJson - JSON object representing person's location
 * @param: dobStr - DOB string from JSON object
 * @param: idx - index marker (which card # this person represents)
 * 
 */

  constructor(nameJson, imgStr, emailStr, cellStr, locationJson, dobStr, idx)
  {
    //this.name = capitalizeFirstLetter(nameJson.title) + ". " + capitalizeFirstLetter(nameJson.first) + " " + capitalizeFirstLetter(nameJson.last);
    this.name = capitalizeEachWord(nameJson.title + " " + nameJson.first + " " + nameJson.last);
    this.image = imgStr;
    this.email = emailStr;
    this.citystate = capitalizeEachWord(locationJson.city) + ", " + capitalizeEachWord(locationJson.state);
    this.cell = cellStr;
    this.address = capitalizeEachWord(locationJson.street) + ", " + capitalizeEachWord(locationJson.city) + ", " + capitalizeEachWord(locationJson.state) + " " + locationJson.postcode;
    this.birthday = dobStr.slice(0, 10);
    this.cardIndex = idx;
  }

  /*
<div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                        <h3 id="name" class="modal-name cap">name</h3>
                        <p class="modal-text">email</p>
                        <p class="modal-text cap">city</p>
                        <hr>
                        <p class="modal-text">(555) 555-5555</p>
                        <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                        <p class="modal-text">Birthday: 10/21/2015</p>
                    </div>
                </div>

                // IMPORTANT: Below is only for exceeds tasks 
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
*/

/**
 * addCardToGallery - class method - add DOM elements to page representing this person
 *  
 * @param: $gallery = the jQuery element for the gallery DIV
 * @return: $cardDiv = the DIV created by the method (returned to add click events to it later)
 */

    addCardToGallery($gallery) {
    // Use jQuery to create and add elements to the DOM https://www.w3schools.com/jquery/jquery_dom_add.asp
    //Generate a new div element and append to the element
          
          const $cardDiv = $("<div></div>");   
          $cardDiv.attr('class', 'card');

          const $cardImgContainerDiv =  $("<div></div>");
          $cardImgContainerDiv.attr('class', 'card-img-container');

          //contains the profile picture
          const $imageDiv =  $("<img></img>");
          $imageDiv.attr('class', 'card-img');
          $imageDiv.attr('alt', 'profile picture');
          $imageDiv.attr('src', this.image);

          $cardImgContainerDiv.append($imageDiv);

          //contains the text info
          const $cardInfoContainerDiv =  $("<div></div>");
          $cardInfoContainerDiv.attr('class', 'card-info-container');

          //contains the name of the Person
          const $cardNameCapHeader =  $("<h3></h3>");
          $cardNameCapHeader.attr('class', 'card-name cap');
          $cardNameCapHeader.text(this.name);

          //this.addModalClickOpenerToElement($cardNameCapHeader);

          //contains the email of the Person
          const $cardEmailParaHeader =  $("<p></p>");
          $cardEmailParaHeader.attr('class', 'card-text');
          $cardEmailParaHeader.text(this.email);

          //contains the city & state of the Person
          const $cardCitystateParaHeader =  $("<p></p>");
          $cardCitystateParaHeader.attr('class', 'card-text cap');
          $cardCitystateParaHeader.text(this.citystate);
          
          //add the name email and citystate to main container
          $cardInfoContainerDiv.append($cardNameCapHeader);
          $cardInfoContainerDiv.append($cardEmailParaHeader);
          $cardInfoContainerDiv.append($cardCitystateParaHeader);

          //add the image and info containers to the card
          $cardDiv.append($cardImgContainerDiv);
          $cardDiv.append($cardInfoContainerDiv);

          $gallery.append($cardDiv);      //Append the new element
          return $cardDiv;
     };
     
         /* <div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="https://placehold.it/90x90" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">first last</h3>
                        <p class="card-text">email</p>
                        <p class="card-text cap">e<city, stat/p>
                    </div>
                </div> */
} 

