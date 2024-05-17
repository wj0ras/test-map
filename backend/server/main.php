<?php


$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$cord = $latitude . '%20' . $longitude;

// URL que envia as coordenadas e retorna o nome do país pertencente no GeoServer
$url = 'http://localhost:8080/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=map-test:tb_countries&outputFormat=application/json&CQL_FILTER=INTERSECTS(geom,POINT(' . $cord . '))&propertyName=name';


// faz a requisição HTTP
$response = file_get_contents($url);


// verifica se a requisição foi bem-sucedida
if ($response === false) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao fazer a requisição HTTP']);
} else {
    // converte a resposta JSON em um array associativo
    $data = json_decode($response, true);

    // verifica se a resposta contém dados
    if ($data && isset($data['features'][0]['properties']['name'])) {
        $countryName = $data['features'][0]['properties']['name'];
        echo json_encode($countryName);
    } else {
        echo json_encode('Nenhum pais encontrado');
    }
}

?>
