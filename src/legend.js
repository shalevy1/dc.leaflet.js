//Legend code adapted from http://leafletjs.com/examples/choropleth.html
dc_leaflet.legend = function() {
    var _parent, _legend = {};
    var _Llegend = L.control({position: 'bottomleft'});

    _legend.parent = function (parent) {
	if(!arguments.length)
	    return _parent;
	_parent = parent;
	return this;
    };

    _legend.render = function () {
	return _legend.redraw();
    };

    _legend.redraw = function () {
	_Llegend.update();
	return _legend;
    };
    
    _legend.leafletLegend = function () {
	return _Llegend;
    };

    _Llegend.onAdd = function (map) {          
        this._div = L.DomUtil.create('div', 'info legend');
        this.update();      
        return this._div;
    };

    _Llegend.update = function () {
	var i, minValue, maxValue, palette, colorLength, delta, grades;
        if (_parent.colorDomain()) {//check because undefined for marker charts        
            minValue = _parent.colorDomain()[0];
            maxValue = _parent.colorDomain()[1];
            palette = _parent.colors().range();
            colorLength = _parent.colors().range().length;
            delta = (maxValue - minValue)/colorLength;             

            //define grades for legend colours
            //based on equation in dc.js colorCalculator (before verion based on colorMixin)
            grades = [];
            grades[0] = minValue;
            for (i= 1; i < colorLength; i++) {
                grades[i] = Math.round((0.5 + (i - 1)) * delta + minValue);
            }          
              
            var div = L.DomUtil.create('div', 'info legend'),          
                labels = [];            

            // loop through our density intervals and generate a label with a colored square for each interval
            this._div.innerHTML = ""; //reset so that legend is not plotted multiple times
            for (i = 0; i < grades.length; i++) {
                this._div.innerHTML +=
                    '<i style="background:' + palette[i] + '"></i> ' +
                      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        }
    };        
    return _legend;
};
