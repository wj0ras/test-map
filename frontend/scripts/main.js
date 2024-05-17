import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import { Tile as TileLayer} from 'ol/layer.js';
import { transform } from 'ol/proj';
import { fromLonLat } from 'ol/proj';
import { TileWMS } from 'ol/source.js';

//importando a Layer airport
import { airportLayer } from './airport';

// LAYERS
const layers = [
  new TileLayer({
    visible: false,
    source: new OSM(),
  }),

  //Layer countries
  new TileLayer({
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities',
      params: {
        'LAYERS': 'map-test:tb_countries',
        'TILED': true,
      },
    }),
  }),

  //Layer airport
  airportLayer
];

layers[2].setZIndex(1);

const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: fromLonLat([-51.264449259505504, -12.14807731652472]),
    zoom: 4,
  }),
});

// EVENT CLICK
let nameCountry;

map.on('click', function(e) {
    var coord = e.coordinate;
    var lonLat = transform(coord, 'EPSG:3857', 'EPSG:4326');
    var url = 'http://localhost/server/main.php';
    console.log(lonLat)

    // envia as cordenadas via AJAX pro PHP e recebe o nome do pais que pertence as cordenadas
    $.ajax({
        url: url,
        type: 'POST',
        data: { longitude: lonLat[0], latitude: lonLat[1] },
        success: function(response) {
            nameCountry = response;
            console.log(nameCountry);
            nameCountry = response.replace(/['"]+/g, ''); // Remove todas as aspas simples ou duplas
            var infoBox = document.querySelector('.country');
            infoBox.textContent = nameCountry;
            infoBox.style.display = 'block';
            infoBox.style.left = (e.pixel[0] + 10) + 'px'; // Adiciona um offset para que a caixa não fique exatamente onde o mouse está
            infoBox.style.top = (e.pixel[1] + 10) + 'px';
        }
    });
});
