var map = L.map("map", {
  center: [23.667278, 80.828706],
  zoom: 5,
});

var sat = null;
sat = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="https://github.com/sanketpshete" target="_blank">by Sanket P Shete</a>',
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
}).addTo(map);

var dropDownDate = $("#dropDownDate");
var leftLayer = $("#leftLayer");
var rightLayer = $("#rightLayer");

var baseMap = null;
var jsonData = null;

getDates();

function getDates() {
  var dropDownDate = $("#dropDownDate");
  var leftLayer = $("#leftLayer");
  var rightLayer = $("#rightLayer");

  fetch("linksForBasemap.json")
    .then((response) => response.json())
    .then((jsonFile) => {
      //console.log(jsonFile)
      jsonData = jsonFile;
      jsonFile.forEach((element) => {
        //console.log(element.date);

        var opt = document.createElement("option");
        opt.value = element.date;
        opt.text = element.date;

        dropDownDate.append(opt);
        // as we alredy use append once so we here we are using op.cloneNode(true) again
        leftLayer.append(opt.cloneNode(true));
        rightLayer.append(opt.cloneNode(true));
      });
    });
}

function selectBasemap() {
  var selectedDate = $("#dropDownDate").val();
  for(let element of jsonData) {
    if (selectedDate == element.date) {
      if (baseMap) {
        map.removeLayer(baseMap);
      }
      var baseMapLink = element.tile_url;
      baseMap = findLinkBasemap(baseMapLink);
      map.addLayer(baseMap);
      break;
    }
    if (selectedDate == "notValue") {
      if (baseMap) {
        map.removeLayer(baseMap);
      }
      break;
    }
  };
}

function findLinkBasemap(url) {
  baseMap = L.tileLayer(url, {
    attribution:
      '&copy; <a href="https://vasundharaa.in/" target="_blank">Vasundharaa Geo Tech</a>',
    maxZoom: 22,
  }); //.addTo(map);
  //map.addLayer(baseMap);
  return baseMap;
}
var leftSwipeLayer = null;
var rightSwipeLayer = null;
var sideBySideControl = null;

function mapSwipe() {
  var leftDate = $("#leftLayer").val();
  var rightDate = $("#rightLayer").val();

  for (let element of jsonData) {
    //for left layer
    if ("hybrid" == leftDate) {
      leftSwipeLayer = L.tileLayer(
        "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
        {
          maxZoom: 22,
          attribution:
            '&copy; <a href="https://vasundharaa.in/" target="_blank">Vasundharaa Geo Tech</a>',
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      ).addTo(map);
      break;
    }
    if (element.date == leftDate) {
      var leftLayerSwipe = element.tile_url;
      leftSwipeLayer = findLinkBasemap(leftLayerSwipe);
      break;;
    }
  };

    //for right layer
  for (let element of jsonData) {
    if ("hybrid" == rightDate) {
      rightSwipeLayer = L.tileLayer(
        "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
        {
          maxZoom: 22,
          attribution:
            '&copy; <a href="https://vasundharaa.in/" target="_blank">Vasundharaa Geo Tech</a>',
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      ).addTo(map);
      break;
    }
    if (element.date == rightDate) {
      var rightLayerSwipe = element.tile_url;
      rightSwipeLayer = findLinkBasemap(rightLayerSwipe);
      break;
    }
  };

  clearIfExists();

  map.addLayer(leftSwipeLayer);
  map.addLayer(rightSwipeLayer);

  sideBySideControl = L.control.sideBySide(leftSwipeLayer, rightSwipeLayer);
  sideBySideControl.addTo(map);
};

function clearIfExists(){
  if (baseMap) {
    map.removeLayer(baseMap);
  }
  if (leftSwipeLayer) {
    map.removeLayer(leftSwipeLayer);
  }
  if (rightSwipeLayer) {
    map.removeLayer(rightSwipeLayer);
  }
  if (sideBySideControl) {
    sideBySideControl.remove();
    sideBySideControl = null;
  }
};
function clearMapSwipe() {
  
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  if (sideBySideControl) {
    sideBySideControl.remove();
    sideBySideControl = null;
  }
  map.addLayer(sat);

  //To set drop down back to the first element
  $("#dropDownDate").prop('selectedIndex', 0);
  $("#leftLayer").prop('selectedIndex', 0);
  $("#rightLayer").prop('selectedIndex', 0);
};
