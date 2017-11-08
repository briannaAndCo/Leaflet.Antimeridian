describe('WrappedPolyline', function () {

	var c = document.createElement('div');
	c.style.width = '400px';
	c.style.height = '400px';
	var map = new L.Map(c);
	map.setView(new L.LatLng(55.8, 37.6), 6);

	describe("#_project", function () {

		it("should split lines that cross the International Date Line", function () {
			var latLngs = [L.latLng([45, 107]), L.latLng([50, 127]), L.latLng([50, -127])];
			var polyline = new L.Wrapped.Polyline(latLngs);
			polyline.addTo(map);

			expect(polyline._rings.length).to.eql(2);
			expect(polyline._rings[0].length).to.eql(3);
			expect(polyline._rings[1].length).to.eql(2);
		});

		it("should not split lines that do not cross the International Date Line", function () {
			var latLngs = [L.latLng([45, -90]), L.latLng([50, -70]), L.latLng([50, 90])];
			var polyline = new L.Wrapped.Polyline(latLngs);
			polyline.addTo(map);

			expect(polyline._rings.length).to.eql(1);
			expect(polyline._rings[0].length).to.eql(3);
		});

		it("should break the line when the line will be shorter if it crosses the International Date Line", function () {
			var latLngA = L.latLng([50, 127]);
			var latLngB = L.latLng([50, -127]);
			var polyline = new L.Wrapped.Polyline([latLngA, latLngB]);
			expect(L.Wrapped.isBreakRing(latLngA, latLngB)).to.eql(true);
		});

		it("should not break the line when the line will be shorter if it crosses the Prime Meridian", function () {
			var latLngA = L.latLng([50, -70]);
			var latLngB = L.latLng([50, 90]);
			var polyline = new L.Wrapped.Polyline([latLngA, latLngB]);
			expect(L.Wrapped.isBreakRing(latLngA, latLngB)).to.eql(false);
		});

	});

});
