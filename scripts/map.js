var map, view, layerList, legend;
var featureLayerIDSet = [];

function initialize() {
  //load the basemap
  //change test
  require([
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
  ], function(Map, MapView) {
    map = new Map({
      // portalItem: { // autocasts as new PortalItem()
      //   id: "e497a8874fa846aa971725238d6de2cd"
      // }
      basemap: "streets"
    });
    view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-111.649278, 40.249251],
      zoom: 16
    });
    // featureLayer.then(function() {
    //     console.log("featureLayer LOADED");
    //   },
    //   function(error) {
    //     // Use the errback function to handle when the view doesn't load properly
    //     console.error('The featureLayer\'s resources failed to load: ', error);
    //   });
    view.then(function() {
        toggleBuildings();
      },
      function(error) {
        // Use the errback function to handle when the view doesn't load properly
        console.log('The view\'s resources failed to load: ', error);
      });

  });
}



function toggleLayers(id) {
  var id = id;
  if (map.findLayerById(featureLayerIDSet[0])) {
    removeLayers();
  }
  require([
    "esri/layers/FeatureLayer",
    "esri/tasks/support/Query",
    "dojo/domReady!"
  ], function(FeatureLayer, Query) {
    //load ParkingLayers
    var template = {
      title: "{Name}",
      content: "{Description}"
    };
    var featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/" + id + "/FeatureServer/0",
      //outFields: ["Name", "Description", "BLDG_ABBR", "BLDG_NAME"],
      outFields: ["*"],
      definitionExpression: "Name != ''",
      popupTemplate: template
    });
    map.add(featureLayer);
    featureLayer.then(function() {
      if (featureLayer.capabilities.queryRelated.supportsOrderBy) {
        console.log("order supported");
        //console.log(featureLayer);
      } else {
        console.log("order NOT supported");
      }
    });

    featureLayerIDSet.push(featureLayer.id);
<<<<<<< HEAD
    //add layer list
    // layerList = new LayerList({
    //   view: view
    // });
    // view.ui.add(layerList, {
    //   position: "top-left"
    // });
    var queryTask = new QueryTask({
      url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/" + id + "/FeatureServer/0",
    });
    var query = new Query();
    query.outFields = ["Name", "Description"];
    queryTask.execute(query).then(function(result) {
      console.log(result);
      // Do something with the resulting FeatureSet (zoom to it, highlight features, get other attributes, etc)
    }, function(error) {
      console.log(error); // Will print error in console if unsupported layers are used
    });
    legend = new Legend({
      view: view,
      layerInfos: [{
        layer: featureLayer
      }]
    });
    view.ui.add(legend, "top-left");
=======
    var graphics;
    var listNode = document.getElementById("listNode");
    view.whenLayerView(featureLayer).then(function(lyrView) {
      lyrView.watch("updating", function(val) {
        if (!val) { // wait for the layer view to finish updating
          var queryParams = featureLayer.createQuery();
          queryParams.orderByFields = (featureLayer.title == "BYUBuildings" || featureLayer.title == "Athletics") ? ["BLDG_NAME"]:["Name"];
          // query all the features available for drawing.
          featureLayer.queryFeatures(queryParams).then(function(results) {
            console.log(results.features);
            graphics = results.features;

            var fragment = document.createDocumentFragment();

            results.features.forEach(function(result, index) {
              var attributes = result.attributes;
              var name;
              if (attributes.BLDG_ABBR != null) {
                name = attributes.Name + " (" + attributes.BLDG_ABBR + ")";
              } else {
                name = attributes.Name;
              }
              var Description = attributes.Description;

              // Create a list zip codes in NY
              var li = document.createElement("li");
              li.classList.add("panel-result");
              li.tabIndex = 0;
              li.setAttribute("data-result-id", index);
              li.textContent = name;
              fragment.appendChild(li);
            });
            // Empty the current list
            listNode.innerHTML = "";
            listNode.appendChild(fragment);
          }, function(error) {
            console.log("something query messed up", error);
          });
        }
      });
    });
    listNode.addEventListener("click", onListClickHandler);

    function onListClickHandler(event) {
      var target = event.target;
      var resultId = target.getAttribute("data-result-id");

      // get the graphic corresponding to the clicked zip code
      var result = resultId && graphics && graphics[parseInt(resultId,
        10)];

      if (result) {
        // open the popup at the centroid of zip code polygon
        // and set the popup's features which will populate popup content and title.
        var
        view.popup.open({
          features: [result],
          location: featureLayer.
        });
      }
    }


    // var graphics;
    // var listNode = document.getElementById("listNode");
    //
    //    view.whenLayerView(featureLayer).then(function(lyrView) {
    //      lyrView.watch("updating", function(val) {
    //        if (!val) { // wait for the layer view to finish updating
    //
    //          // query all the features available for drawing.
    //          lyrView.queryFeatures().then(function(results) {
    //
    //            graphics = results;
    //
    //            var fragment = document.createDocumentFragment();
    //
    //            results.forEach(function(result, index) {
    //              var attributes = result.attributes;
    //              var name = attributes.Name + " (" +
    //                attributes.BLDG_ABBR + ")"
    //
    //              // Create a list zip codes in NY
    //              var li = document.createElement("li");
    //              li.classList.add("panel-result");
    //              li.tabIndex = 0;
    //              li.setAttribute("data-result-id", index);
    //              li.textContent = name;
    //
    //              fragment.appendChild(li);
    //            });
    //            // Empty the current list
    //            listNode.innerHTML = "";
    //            listNode.appendChild(fragment);
    //          });
    //        }
    //      });
    //    });
    //
    //    // listen to click event on the zip code list
    //    listNode.addEventListener("click", onListClickHandler);
    //
    //    function onListClickHandler(event) {
    //      var target = event.target;
    //      var resultId = target.getAttribute("data-result-id");
    //
    //      // get the graphic corresponding to the clicked zip code
    //      var result = resultId && graphics && graphics[parseInt(resultId,
    //        10)];
    //
    //      if (result) {
    //        // open the popup at the centroid of zip code polygon
    //        // and set the popup's features which will populate popup content and title.
    //        view.popup.open({
    //          features: [result],
    //          location: result.geometry.centroid
    //        });
    //      }
    //    }
    // var queryTask = new QueryTask({
    //   url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/" + id + "/FeatureServer/0",
    // });
    // var query = new Query();
    // query.where = "Name ='Jamba Juice'";
    // query.outFields = ["Name"];
    // queryTask.execute(query).then(function(result){
    // console.log(result);
    //   // console.log(result.features[0].attributes.Name);
    //   // Do something with the resulting FeatureSet (zoom to it, highlight features, get other attributes, etc)
    // }, function(error) {
    //   console.log(error); // Will print error in console if unsupported layers are used
    // });
    // legend = new Legend({
    //   view: view,
    //   layerInfos: [{
    //     layer: featureLayer
    //   }]
    // });
    // view.ui.add(legend, "top-left");
>>>>>>> origin/master
  });
}

function toggleBuildings() {
  if (map.findLayerById(featureLayerIDSet[0])) {
    removeLayers();
  }
  require([
    "esri/layers/FeatureLayer",
    "dojo/domReady!"
  ], function(FeatureLayer) {
    //load ParkingLayers
    var template = {
      title: "{Name}",
      content: "{Description}"
    };
    var featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BYUBuildings/FeatureServer/0",
      outFields: ["Name", "Description"],
      popupTemplate: template,
      opacity: 0
    });
    //console.log(featureLayer.outfields);
    map.add(featureLayer);
    // console.log(featureLayer.layerId);
    // featureLayerIDSet.push(featureLayer.id);
  });
}

function toggleParkingLots() {
  if (map.findLayerById(featureLayerIDSet[0])) {
    removeLayers();
  }
  require([
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "dojo/domReady!"
  ], function(FeatureLayer, LayerList) {
    //load ParkingLayers
    var template = {
      title: "{Lot}",
      content: "{Description}"
    };
    for (var i = 2; i < 12; i++) {
      var featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/ParkingLayers/FeatureServer/" + i,
        outFields: ["Lot", "Description"],
        popupTemplate: template
      });
      map.add(featureLayer);
      // console.log(featureLayer.layerId);
      featureLayerIDSet.push(featureLayer.id);
    }
    layerList = new LayerList({
      view: view
    });
    view.ui.add(layerList, {
      position: "top-left"
    });
  });
}

function toggleTransportation() {
  if (map.findLayerById(featureLayerIDSet[0])) {
    removeLayers();
  }
  require([
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "dojo/domReady!"
  ], function(FeatureLayer, Legend) {
    var template = {
      title: "{BusName}",
      content: "{Description}"
    };
    //add bus routes
    var featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BusStops/FeatureServer/0",
      outFields: ["BusName", "StopLocation", "Description"],
      popupTemplate: template
    });
    map.add(featureLayer);
    featureLayerIDSet.push(featureLayer.id);
    //add bycicle ParkingLayers
    var bikeLayer = new FeatureLayer({
      url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BicycleParking/FeatureServer/0"
    });
    map.add(bikeLayer);
    featureLayerIDSet.push(bikeLayer.id);
    legend = new Legend({
      view: view,
      layerInfos: [{
        layer: featureLayer,
        bikeLayer
      }]
    });
    view.ui.add(legend, "top-left");
  });
}

function removeLayers() {
  console.log("removing layers");
  if (layerList != null) {
    layerList.destroy();
    layerList = null;
  }
  if (legend != null) {
    legend.destroy();
    legend = null;
  }
  map.removeAll();
  featureLayerIDSet = [];
  // map.removeMany(featureLayerIDSet);
  // for(i=0; i<featureLayerIDSet.length; i++){
  //   map.remove(featureLayerIDSet[i]);
  // }
}
