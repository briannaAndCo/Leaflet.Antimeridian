# Leaflet.Antimeridian
A plugin to allow polygons and polylines to naturally draw across the Antimeridian (or the Internation Date Line) instead of always wrapping across the Greenwich meridian.

Useful when displaying lines that might cross or partially cross the Antimeridian.

Simple polygons/polylines without using Leaflet.Antimeridian |
------|
![Leaflet](https://user-images.githubusercontent.com/28913842/32580626-00c1d9f2-c49b-11e7-9782-bf88cdd70c23.png) |

 Using Leaflet.Antimeridian |
 ------|
![using Leaflet.Antimeridian](https://user-images.githubusercontent.com/28913842/32580625-ff534a56-c49a-11e7-831e-984b57651e00.png)

## [Demo](https://briannaandco.github.io/Leaflet.Antimeridian/)
## Installation
Requires leaflet@1.0.0.

## Usage


## API reference
### Factorys
Factory|Description
------|-------
L.Wrapped.Polyline(`LatLng[]` _latlngs_, `options` _options?_)|Create a automatically wrapping polyline that will take all the usual polygon options.
L.wrappedPolyline(`LatLng[]` _latlngs_, `options` _options?_)|Factory method that wraps the L.Wrapped.Polyline constructor.
L.Wrapped.Polygon(`LatLng[]` _latlngs_, `options` _options?_)|Create a automatically wrapping polygon that will take all the usual polygon options.
L.wrappedPolygon(`LatLng[]` _latlngs_, `options` _options?_)|Factory method that wraps the L.Wrapped.Polygon constructor.

### Methods
Utility Methods
------|-------|-----------
L.Wrapped.sign(`Number` _number_)|Returns NaN for non-numbers, 0 for 0, -1 for negative numbers, 1 for positive numbers
L.Wrapped.calculateAntimeridianLat(`LatLng` _latLngA_, `LatLng` _latLngB_)|`Number`|Calculates the latitude at which the two points will cross the Antimeridian. Returns the latitude.
L.Wrapped.isCrossMeridian(`LatLng` _latLngA_, `LatLng` _latLngB_)|`boolean`|Returns true if the line between the two LatLngs crosses either meridian.
L.Wrapped.isBreakRing(`LatLng` _latLngA_, `LatLng` _latLngB_)|`boolean`|Returns true if the line between the two LatLngs should be broken across the meridian.

## [License](https://opensource.org/licenses/MIT)
