// use leaflet-locationfilter to do rectangular selections
dc_leaflet.rectangularSelection = function() {
    var _parent, _selection = {};

    _selection.parent = function (parent) {
        if(!arguments.length)
            return _parent;
        _parent = parent;
        return this;
    };

    _selection.render = function () {
        var locationFilter = new L.LocationFilter();
        locationFilter._layerAdd = function(thing) {
            // apparently leaflet's api changed since this addon was created
            locationFilter.onAdd(thing.target);
        };
        locationFilter.addTo(_parent.map());

        locationFilter.on("change", function (e) {
            // Do something when the bounds change.
            // Bounds are available in `e.bounds`.
        });

        locationFilter.on("enabled", function () {
            // Do something when enabled.
        });

        locationFilter.on("disabled", function () {
            // Do something when disabled.
        });
        return this;
    };

    return _selection;
};
