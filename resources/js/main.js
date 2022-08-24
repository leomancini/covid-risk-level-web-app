function getUserLocation() {
   if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( success, fail );
   } else {
      alert('Browser does not support geolocation!');
   }
}

async function success(position) {
   console.log(position.coords);
   let riskLevelForUserLocation = await getRiskLevelForUserLocation(position);

   let backgroundColor;

   switch(parseInt(riskLevelForUserLocation.CCL_community_burden_level_integer)) {
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

   document.querySelector('h1').innerText = riskLevelForUserLocation.County;
   document.querySelector('h2').innerText = riskLevelForUserLocation.State_name;

   let lastUpdatedDate = parseDate(riskLevelForUserLocation.CCL_report_date);

   document.querySelector('h3').innerText = `Last updated ${lastUpdatedDate.toLocaleDateString('en-us', { weekday:'long', year:'numeric', month:'short', day:'numeric' })}`;
}

function parseDate(input) {
   let parts = input.split('-');

   return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

function fail() {
   console.error('Could not get user location!')
}

async function getRiskLevelForUserLocation(userLocation) {
   let lat = userLocation.coords.latitude;
   let lng = userLocation.coords.longitude;

   const response = await fetch(`https://jndaditnce62h556zs2k5q3kqu0hlvjr.lambda-url.us-east-1.on.aws/?location=${lat},${lng}`);
   const data = await response.json();
   return data;
}

async function initalize() {
   let userLocation = getUserLocation();

}

initalize();