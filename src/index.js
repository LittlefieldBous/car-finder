// Import the car dataset JSON file
import carData from './car-dataset.json';

// Import your SCSS styles
import './styles/index.scss';

// class car represents a blueprint for creating car objects with all the properties from the dataset
// I use 'this' to attach properties to each individual car instance. 
// For example each car object will have its own model, year, price, etc. that can be accessed using 'this.model', 'this.year', etc. within the class methods.
class Car {
    constructor (model, year, price, transmission, mileage, fuelType, tax, mpg, engineSize, manufacturer) {
        this.model = model;
        this.year = year;
        this.price = price;
        this.transmission = transmission;
        this.mileage = mileage;
        this.fuelType = fuelType;
        this.tax = tax; 
        this.mpg = mpg;
        this.engineSize = engineSize;
        this.manufacturer = manufacturer;
    }
    // methods logs car's details to the console. This is useful for debugging and inspecting the car data.
    showDetails() {
        console.log(this);
    }
}

// convert json to car objects. After creating the blueprint, I created a class 'CarSearch' This class has a constructor that takes data as a parameter. Inside the constructor, I map over the data and create instances of the Car class for each entry in the dataset. As a result, I have a way to interact with the car data within the application. The CarSearch class also contains methods to handle the dropdown population and event listeners for user interactions. 
class CarSearch {
    constructor(data) {
        // I create a property called 'this.cars' and use the map() method to loop through the data. The map method transform this into a sort of an array or rather a collection of data. The arrow functions means for each car in the data, (*note car is just a parameter name that could be called anything) I create a new instance of the Car class ('new Car') using the properties from the dataset. This way, I have an array of Car objects that I can work with in my application.
        this.cars = data.map(car => new Car (
            car.model,
            car.year, 
            car.price, 
            car.transmission, 
            car.mileage,
            car.fuelType,
            car.tax, 
            car.mpg, 
            car.engineSize,
            car.Manufacturer
        ));

        // Next I get the DOM elements for the select dropdowns using document.getElementById and store them as properties using 'this.yearSelect' etc. 
        // I need these as I will be populating the dropdowns with <option></option> tags (and attaching event listeners etc)
        // Get DOM elements
        this.yearSelect = document.getElementById('select-year');
        this.makeSelect = document.getElementById('select-make');
        this.modelSelect = document.getElementById('select-model');

        // initializes year dropdown is ready
        // and the event listeners are ready to listen for user interactions
        // Car Analogy - car engine is on and ready
        this.info(); //calls the method 

        }
        // calls 'addYears' function to populates the addYears dropdown
        // sets up Event listeners (Car racing Analogy - Car is at the start line)
        info() {
            this.addYears();
            this.attachEventListeners();
        }

        // This addYears function does the following:
        // 1. (this.cars.map(car => car.year)) - extracts years from all the car objects creating an array of car years.
        // 2. new Set() - creates a Set from the array of years, which automatically removes duplicates, leaving only unique years.
        // 3. [...new Set(...)] - converts the Set back into an array of unique years.
        // 4. .sort((a, b) => b-a) - Sorts years highest to lowest
        // 5. const years = ... - stores the final array in the variable 'years'.
        addYears() {
            const years = [...new Set(this.cars.map(car => car.year))].sort((a, b) => b-a);
           // 6. years.forEach(year => { ... }) - Loops through the array of unique years and creates an <option> element for each year, setting its value and text content to the year, and appending it to the yearSelect dropdown in the DOM.
            years.forEach(year => {
                const option = document.createElement('option'); // creates a new <option> element
                option.value = year; // sets the value =  <option value="2020">)
                option.textContent = year; // sets the text content = <option value="2020">2020</option>
                this.yearSelect.appendChild(option); // appends the option to the yearSelect dropdown
            });
        }

        addMakes(year){
            // this clears the dropdown and resets it to the default placeholder option each time a new year is selected. Without it I realized one gets duplicate options in the make dropdown when changing the year selection.
            this.makeSelect.innerHTML = '<option value="" disabled selected>Vehicle Make</option>';

            // creates a list of unique makes for the selected year. 
            const makes = [...new Set (
                //filters cars by the selected year
                this.cars.filter(car => car.year === parseInt(year))
                // extracts the manufacturer from the filtered cars
                .map(car => car.manufacturer)
                // the last part removes any undefined, null or empty strings and then sorts it alphabetically
                .filter(make => make !== undefined && make !==  null && make !== '')
            )].sort();
        
            // here it repeats the same process that addYears has by looping  through the makes and creating an option tag for each and appending it to the dropdown. - this code is also repeated in model so I realize going through this - I could rewrite as a helper function to avoid repetition.
            makes.forEach(make => {
                const option = document.createElement('option');
                option.value = make;
                option.textContent = make.charAt(0).toUpperCase() + make.slice(1);
                this.makeSelect.appendChild(option);
            });
            //removes the disablle attribute so that the dropdown is now active.
            this.enableDropdown(this.makeSelect);
        }

    //Add the car model dropdown
        addModels(year, make){
            this.modelSelect.innerHTML = '<option value="" disabled selected>Vehicle Model</option>';
            // creates a list of unique models for the selected year and make. It filters the cars by both year and make, extracts the model, removes duplicates, sorts alphabetically, and stores it in the variable 'models'.
            const models = [...new Set(
                this.cars
                .filter(car =>
                    // it takes two parameters as it filters cars by the selected year and make
                    car.year === parseInt(year) && 
                    car.manufacturer.toLowerCase() === make.toLowerCase()
                )
                .map(car => car.model)
            )].sort();

            // creates an option tag for each model and appends it to the model dropdown
            models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            this.modelSelect.appendChild(option);
            });

            // enable the model dropdown
            this.enableDropdown(this.modelSelect);
            }

            // This function takes a select element as an argument, removes the disabled attribute to make it interactive, and updates the styling by adding or removing CSS classes. It also handles the styling of a related fieldset element if it exists.
        enableDropdown(selectElement) {
            //enables the dropdown by removing the disabled attribute
                selectElement.disabled = false;

                // updates the styling of the dropdown by manipulating CSS classes. It looks for the closest parent element with the class 'form-group
                const formGroup = selectElement.closest('.form-group');

                if (formGroup) {
                formGroup.classList.remove('is-disabled');
                formGroup.classList.add('is-active');
                }

            //remove the disabled class from fieldset also
            const fieldset = selectElement.nextElementSibling;
            if (fieldset && fieldset.classList.contains('outline')) {
                fieldset.classList.remove('disabled');
            }
        }

            // Disable Dropdown (add disabled attribute and update styling)
            // This function takes a select element as an argument, adds the disabled attribute to make it non-interactive, resets the selected index to the placeholder, and updates the styling by adding or removing CSS classes. It also handles the styling of a related fieldset element if it exists.
            disableDropdown(selectElement) {
                selectElement.disabled = true; //disables the dropdown by adding the disabled attribute
                // Reset to placeholder
                selectElement.selectedIndex = 0; // Reset to placeholder

                const formGroup = selectElement.closest('.form-group');

                if (formGroup) {
                formGroup.classList.add('is-disabled');
                formGroup.classList.remove('is-active');
            }

    
            // Add the disabled class to the fieldset
            const fieldset = selectElement.nextElementSibling;
            if (fieldset && fieldset.classList.contains('outline')) {
                fieldset.classList.add('disabled');
            }
        }

        // findCar function - important part of the application - Now that the dropdowns are populated and enabled based on user selections, the findCar function is responsible for finding a car that matches all the selected criteria (year, make, model) and displaying its details. 
    findCar(year, make, model) {
        // Search through all car objects to find one that matches the selected year, make, and model. It uses the find() method to return the first car that satisfies the condition. The condition checks if the car's year matches the selected year, the manufacturer matches the selected make (case-insensitive), and the model matches the selected model.
  
    const car = this.cars.find(car => 
        car.year === parseInt(year) && 
        car.manufacturer.toLowerCase() === make.toLowerCase() && // toLowerCase makes comparisons case-insensitve.
        car.model === model
    );  
    //check if we found a car that matches 
    if (car) {
        console.log('Car found:');
        car.showDetails();
    } else {
        console.log('No car found matching the selected criteria.');
    } 
}

//event listeners for select dropdowns. This method attaches event listeners to the year, make, and model dropdowns to handle user interactions. 
// When a user selects a year, it populates the make dropdown based on that year and disables the model dropdown. 
// When a user selects a make, it populates the model dropdown based on the selected year and make. 
// Finally, when a user selects a model, it calls the findCar function to display the details of the selected car.
attachEventListeners() {
    this.yearSelect.addEventListener('change', (e) => {
        // Get the selected year value
        const year = e.target.value;
        console.log(`Year selected: ${year}`);

    // populates the make dropdown based on year selection (filters the cars by year, extracts the make/manufacturers, adds and enables the make dropdown
    this.addMakes(year);

    this.disableDropdown(this.modelSelect);
    });

    // make dropdown change event
    this.makeSelect.addEventListener('change', (e) => {
        // get the year value from the year dropdown and the make value from the make dropdown
        const year = this.yearSelect.value; 
        const make = e.target.value;
        // capitalize the first letter of the make 'Ford ' etc
        const makeName = make.charAt(0).toUpperCase() + make.slice(1);

    // Adds the option tags to the model dropdown based on year and make selection
    // Calls addModels() function which 1. filters the cars by year and make, 
    // 2. extracts the model, and 3. adds and enables the model dropdown
    this.addModels(year, make);
    });

    // the model eventlistener listens for a change in the model dropdown, gets the selected year, make, and model values, and then calls the findCar function to search for a car that matches all three criteria. If a matching car is found, its details are displayed in the console.
    this.modelSelect.addEventListener('change', (e) => {
        const year = this.yearSelect.value;   // get selected year from the year dropdown
        const make = this.makeSelect.value;   // get selected make from the make dropdown
        const model = e.target.value; // get selected model from the model dropdown
        console.log(`Model selected: ${model}`);

    // find and display the complete car details based on selections
    this.findCar(year, make, model); 

    });
    }
}

// This code initializes the entire application. like a car's ignition switch.

let carSearch; // declare this outside of a function to make it a global variable that can be accessed in the browser console for testing and debugging purposes.

// let DOM load before initializing the app / and running javaScript code. 
// This ensures that all the HTML elements are fully loaded and available in the DOM before the JavaScript code tries to access them. 
// This is important because if the JavaScript runs before the DOM is ready, it may not find the elements it needs to interact with, leading to errors.
document.addEventListener( 'DOMContentLoaded', () => {
    console.log("car search initialized");
    carSearch = new CarSearch(carData);
    window.carSearch = carSearch; // make global for debugging

    // added console logs to provide feedback in the console about the initialization of the app and to give instructions for testing. It also logs the number of cars in the dataset to confirm that the data has been loaded correctly.
console.log("Type carSearch in console for testing");
console.log(`Number of cars in dataset: ${carSearch.cars.length}`);
});

