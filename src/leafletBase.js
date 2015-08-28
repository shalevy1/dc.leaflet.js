dc_leaflet.leafletBase = function(_chart) {
    _chart = dc.baseChart(_chart);

    var _map;

    var _mapOptions=false;
    var _defaultCenter=false;
    var _defaultZoom=false;

    var _cachedHandlers = {};

    var _createLeaflet = function(root) {
        return L.map(root.node(),_mapOptions);
    };

    var _tiles=function(map) {
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    };

    _chart.createLeaflet = function(_) {
        if(!arguments.length) {
            return _createLeaflet;
        }
        _createLeaflet = _;
        return _chart;
    };

    _chart._doRender = function() {
        _map = _createLeaflet(_chart.root());
        for(var ev in _cachedHandlers)
            _map.on(ev, _cachedHandlers[ev]);

        if (_defaultCenter && _defaultZoom) {
            _map.setView(_chart.toLocArray(_defaultCenter), _defaultZoom);
        }

        _chart.tiles()(_map);

        _chart._postRender();

        return _chart._doRedraw();
    };

    _chart._postRender = function() {
        //abstract
    };

    _chart.mapOptions = function(_) {
        if (!arguments.length) {
            return _mapOptions;
        }
        _mapOptions = _;
        return _chart;
    };

    _chart.center = function(_) {
        if (!arguments.length) {
            return _defaultCenter;
        }
        _defaultCenter = _;
        return _chart;
    };

    _chart.zoom = function(_) {
        if (!arguments.length) {
            return _defaultZoom;
        }
        _defaultZoom = _;
        return _chart;
    };

    _chart.tiles = function(_) {
        if (!arguments.length) {
            return _tiles;
        }
        _tiles = _;
        return _chart;
    };

    _chart.map = function() {
        return _map;
    };

    _chart.toLocArray = function(value) {
        if (typeof value === "string") {
            // expects '11.111,1.111'
            value = value.split(",");
        }
        // else expects [11.111,1.111]
        return value;
    };

    // combine Leaflet events into d3 & dc events
    dc.override(_chart, 'on', function(event, callback) {
        var leaflet_events = ['zoomend', 'moveend'];
        if(leaflet_events.indexOf(event) >= 0) {
            if(_map) {
                _map.on(event, callback);
            }
            else {
                _cachedHandlers[event] = callback;
            }
            return this;
        }
        else return _chart._on(event, callback);
    });

    return _chart;
};
