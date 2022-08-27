function getUserLocation() {
   if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(userLocationSucceeded, userLocationFailed);
   } else {
      alert('Browser does not support geolocation!');
   }
}

async function userLocationSucceeded(position) {
   let riskLevelForUserLocation = await getRiskLevelForUserLocation(position);

   let backgroundColor;
   
   switch(riskLevelForUserLocation.riskLevelInteger) {
      case 0:
         backgroundColor = '#00F035';
      break;
      case 1:
         backgroundColor = '#F36600';
      break;
      case 2:
         backgroundColor = '#E30000';
      break;
      default:
         backgroundColor = '#000000';
   }

   document.querySelector('body').style.backgroundColor = backgroundColor;

   document.querySelector('h1').innerText = riskLevelForUserLocation.countyName;
   document.querySelector('h2').innerText = riskLevelForUserLocation.stateName;

   let lastUpdatedTimestamp = parseDate(riskLevelForUserLocation.lastUpdatedTimestamp);

   document.querySelector('h3').innerText = `Last updated ${lastUpdatedTimestamp.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
}

function userLocationFailed() {
   console.error('Could not get user location!')
}

function parseDate(input) {
   let parts = input.split('T')[0].split('-');

   return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

async function getRiskLevelForUserLocation(userLocation) {
   let url = 'https://jndaditnce62h556zs2k5q3kqu0hlvjr.lambda-url.us-east-1.on.aws/';
   let lat = userLocation.coords.latitude;
   let lng = userLocation.coords.longitude;

   const response = await fetch(`${url}?location=${lat},${lng}`);
   const data = await response.json();

   return data;
}

async function initalize() {
   let userLocation = getUserLocation();
}

initalize();