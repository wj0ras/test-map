import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import GeoJSON from 'ol/format/GeoJSON';
import {bbox} from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';


// ícone padrao
var selectedIconStyle = iconStyle; 
var iconStyle = new Style({
  image: new Icon({
      src: 'img/airport.png',
      scale: 0.06
  })
});
  document.getElementById('selectImageButton').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

//Event para selecionar a imagem
  document.getElementById('fileInput').addEventListener('change', function(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function() {
      var imageUrl = reader.result;
      selectedIconStyle = new Style({
          image: new Icon({
              src: imageUrl,
              scale: 0.1 
          })
      });
      airportLayer.setStyle(selectedIconStyle);
  };
  reader.readAsDataURL(file);
});


//Renderizando a Layer
var airportSource = new VectorSource({
  format: new GeoJSON(),
  url: function(extent) {
    return 'http://localhost:8080/geoserver/ows?service=WFS&' +
        'version=1.1.0&request=GetFeature&typeName=map-test:tb_airport&' +
        'outputFormat=application/json';
  },
  strategy: bbox
});

export var airportLayer = new VectorLayer({
  source: airportSource,
  style: iconStyle
});
