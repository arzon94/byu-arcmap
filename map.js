var map, view, layerList, legend;
var featureLayerIDSet = [];

function initialize() {
  //load the basemap
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
      zoom: 16.5
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
        console.log("view LOADED");
      },
      function(error) {
        // Use the errback function to handle when the view doesn't load properly
        console.log('The view\'s resources failed to load: ', error);
      });

  });
}

function removeLayers() {
  console.log("removing layers");
  map.removeAll();
  if (layerList) {
    layerList.destroy();
  }
  if (legend) {
    legend.destroy();
  }
  featureLayerIDSet = [];
  // map.removeMany(featureLayerIDSet);
  // for(i=0; i<featureLayerIDSet.length; i++){
  //   map.remove(featureLayerIDSet[i]);
  // }
}

function toggleLayers(id) {
  var id = id;
  if (map.findLayerById(featureLayerIDSet[0])) {
    removeLayers();
  }
  require([
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "dojo/domReady!"
  ], function(FeatureLayer, Legend, QueryTask, Query) {
    //load ParkingLayers
    var template = {
      title: "{Name}",
      content: "{Description}"
    };
    var featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/" + id + "/FeatureServer/0",
      outFields: ["Name", "Description"],
      popupTemplate: template
    });
    map.add(featureLayer);
    //console.log(featureLayer.outFields[1]);
    // console.log(featureLayer.layerId);
    featureLayerIDSet.push(featureLayer.id);
    //add layer list
    // layerList = new LayerList({
    //   view: view
    // });
    // view.ui.add(layerList, {
    //   position: "top-left"
    // });
    // var queryTask = new QueryTask({
    //   url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/" + id + "/FeatureServer/0",
    // });
    // var query = new Query();
    // query.outFields = ["Name", "Description"];
    // queryTask.execute(query).then(function(result) {
    //   console.log(result);
    //   // Do something with the resulting FeatureSet (zoom to it, highlight features, get other attributes, etc)
    // }, function(error) {
    //   console.log(error); // Will print error in console if unsupported layers are used
    // });
    legend = new Legend({
      view: view,
      layerInfos: [{
        layer: featureLayer
      }]
    });
    view.ui.add(legend, "top-left");
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
    console.log(featureLayer.outfields);
    map.add(featureLayer);
    // console.log(featureLayer.layerId);
    featureLayerIDSet.push(featureLayer.id);
    // layerList = new LayerList({
    //   view: view
    // });
    // view.ui.add(layerList, {
    //   position: "top-left"
    // });
  });
}

function toggleParkingLots() {
  // var FeatureLayer
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
        url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/ParkingLayers/FeatureServer/" + i + "?token=APA1OuNrjUpayDvpJS82zrdBBlWr1q6dVqbC3Igx8fBnNR_D4efGRGsy8nNEIOvvSTLV4yox6V4COhG7kZTpxRZeBHgv-sZe_thgde7E1LxGmTPpwQBFFA6J3hxcvevmRcSuWnkCChstKnI2wkFHlwSZLwIqbzDsvj3ei1TqIEb-QVdD5uLXu-nDQ_-VZspIpL92LRad5fX_8CbI1g0Ibg..",
        outFields: ["Lot", "Description"],
        popupTemplate: template
      });
      map.add(featureLayer);
      // console.log(featureLayer.layerId);
      featureLayerIDSet.push(featureLayer.id);
    }
    var featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/FvF9MZKp3JWPrSkg/arcgis/rest/services/BicycleParking/FeatureServer/0",
    });
    map.add(featureLayer);
    featureLayerIDSet.push(featureLayer.id);
    console.log(featureLayerIDSet);

    layerList = new LayerList({
      view: view
    });
    view.ui.add(layerList, {
      position: "top-left"
    });
  });
}
