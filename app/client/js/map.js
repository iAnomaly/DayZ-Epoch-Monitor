

function CustomMapType() {
}
CustomMapType.prototype.tileSize = new google.maps.Size(256,256);
CustomMapType.prototype.maxZoom = 7;
CustomMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('DIV');
    var baseURL = 'http://localhost:3000/tiles/chernarus_tiles_lowres/' ;
    baseURL += zoom + '_' + coord.x + '_' + coord.y + '.png';
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.backgroundColor = '#1B2D33';
    div.style.backgroundImage = 'url(' + baseURL + ')';
    return div;
};

CustomMapType.prototype.name = "Custom";
CustomMapType.prototype.alt = "Tile Coordinate Map Type";
var map;
var CustomMapType = new CustomMapType();
function initialize() {
  var mapOptions = {
      minZoom: 2,
    maxZoom: 7,
    isPng: true,
      mapTypeControl: false,
      streetViewControl: false,
        center: new google.maps.LatLng(65.07,-56.08),     
      zoom: 3,
    mapTypeControlOptions: {
      mapTypeIds: ['custom', google.maps.MapTypeId.ROADMAP],
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  };
map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
map.mapTypes.set('custom',CustomMapType);
map.setMapTypeId('custom');
}


