import * as AntimeridianUtils from './Wrapped.AntimeridianUtils';

/*
 * @namespace L.Wrapped
 * A polyline that will automatically split and wrap around the Antimeridian (Internation Date Line).
 */
export var Polyline = L.Polyline.extend({

	// recursively turns latlngs into a set of rings with projected coordinates
	// This is the entrypoint that is called from the overriden class to change
	// the rendering.
	_projectLatlngs: function (latlngs, result, projectedBounds) {
		var isMultiRing = latlngs[0] instanceof L.LatLng;

		if (isMultiRing) {
			this._createRings(latlngs, result, projectedBounds);
		} else {
			for (var i = 0; i < latlngs.length; i++) {
				this._projectLatlngs(latlngs[i], result, projectedBounds);
			}
		}
	},

	// Creates the rings used to render the latlngs.
	_createRings: function (latlngs, rings, projectedBounds) {
		var len = latlngs.length;
		rings.push([]);

		for (var i = 0; i < len; i++) {
			var compareLatLng = this._getCompareLatLng(i, len, latlngs);
			var currentLatLng = latlngs[i];

			AntimeridianUtils.pushLatLng(rings[rings.length - 1], projectedBounds, latlngs[i], this._map);

			// If the next point to check exists, then check to see if the
			// ring should be broken.
			if (compareLatLng && AntimeridianUtils.isBreakRing(compareLatLng, currentLatLng)) {
				var secondMeridianLatLng = AntimeridianUtils.breakRing(currentLatLng, compareLatLng,
					rings, projectedBounds, this._map);

				this._startNextRing(rings, projectedBounds, secondMeridianLatLng);
			}
		}
	},

	// returns the latlng to compare the current latlng to.
	_getCompareLatLng: function (i, len, latlngs) {
		return (i + 1 < len) ? latlngs[i + 1] : null;
	},

		// Starts a new ring and adds the second meridian point.
	_startNextRing: function (rings, projectedBounds, secondMeridianLatLng) {
		var ring = [];
		rings.push(ring);
		AntimeridianUtils.pushLatLng(ring, projectedBounds, secondMeridianLatLng, this._map);
	}
});

// @factory L.wrappedPolyline(latlngs: LatLng[], options?: Polyline options)
// Instantiates a polyline that will automatically split around the
// antimeridian (Internation Date Line) if that is a shorter path.
export function wrappedPolyline(latlngs, options) {
	return new L.Wrapped.Polyline(latlngs, options);
}
