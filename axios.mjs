import * as Carousel from "./Carousel.mjs";
// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_uvoSZa1Mc5WHBv9dEFTImpzBm0CVy1n9pZsyj70QBMLRHC5pRDPgpq7sUHsNO7Pe";



axios("https://api.thecatapi.com/v1/images/search", {}, {
    headers: {
        'x-api-key': API_KEY
    }
})
    .then((x) => {

    })
    .catch((err) => {
        console.log(err);
    });



// fetch("https://api.thecatapi.com/v1/images/search")
//   .then((x) => {
//     console.log(x);
//     x.json().then(j=>{console.log(j)})
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// axios("https://api.thecatapi.com/v1/images/search")
//   .then((x) => {
//     console.log(x);
//   })
//   .catch((err) => {
//     console.log(err);
//   });



/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

// Part 1





// async function myFunctions2() {
//   let listOfBreeds = await fetch("https://api.thecatapi.com/v1/images/search?limit=10");
//   let jsonData = await listOfBreeds.json();
//   // console.log(jsonData);
// }

// myFunctions2().then((x) => {
//   console.log(x);
// });


/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

// Part 2









/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */


(async function initialLoad() {
    const listOfBreeds = await axios(`https://api.thecatapi.com/v1/breeds`);

    listOfBreeds.data.forEach(element => {

        const option = document.createElement("option");

        breedSelect.appendChild(option);

        option.setAttribute("value", element.id)

        option.textContent = element.name;

    });
    buildCaro();
    Carousel.start();
})();


breedSelect.addEventListener("change", buildCaro)

async function buildCaro() {
    const catVal = breedSelect.value
    Carousel.clear();

    
    function addToCarousel(catInfo) {

        catInfo.data.forEach((element) => {

            const newEle = Carousel.createCarouselItem(

                element.url,
                breedSelect.value,
                element.id

            )

            Carousel.appendCarousel(newEle);
        })
    }

    async function dumpInfo() {
        const listOfBreeds = await axios(`https://api.thecatapi.com/v1/breeds`);

        listOfBreeds.data.forEach(element => {
            if (element.id === catVal) {
                infoDump.innerHTML = `<h6>

            Description: ${element.description} <br/> <br/>
            Life_Span: ${element.life_span} <br/> <br/>
            Origin: ${element.origin} <br/> <br/>

            </h6>`
            }
        });

    }

    dumpInfo();

    async function waiting() {
        const catInfo = await axios(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${catVal}`, {
            onDownloadProgress: updateProgess
        });
        // console.log(catInfo)




        addToCarousel(catInfo);

    }

    waiting();
}



/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axios.interceptors.request.use((request) => {
    progressBar.style.width = '0%'
    console.log("Request sent.");
    request.metadata = request.metadata || {};
    request.metadata.startTime = new Date().getTime();
    // console.log(request.metadata, request.metadata.startTime);
    return request;
}, (error) => {
    console.log("Request Error.");
    throw error;
});



axios.interceptors.response.use(
    (response) => {
        // Success: status 200 - 299
          console.log("Successful response!");
        response.config.metadata.endTime = new Date().getTime();
        response.config.metadata.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;
        console.log(`Request took ${response.config.metadata.durationInMS} milliseconds.`)
        return response;
    },
    (error) => {
        // Failure: anything outside of status 2XX
        console.log("Unsuccessful response...");
        throw error;
    }
);


/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

function updateProgess(progressEvent) {
    const percentage = (progressEvent.loaded * 100) / progressEvent.total;
    progressBar.style.width = `${percentage}%`;
}

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
    // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
