"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toGeoJson = toGeoJson;
exports.toKml = toKml;
exports.toWkt = toWkt;
exports.toStats = toStats;
exports.UNNAMED = void 0;

var _tokml = _interopRequireDefault(require("@maphubs/tokml"));

var _wellknown = require("wellknown");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var UNNAMED = '__unnamed_feature__';
exports.UNNAMED = UNNAMED;

function toGeoJson(geojson) {
  var filename = "".concat(getFilename(geojson), ".geojson");
  var prepped = prepareGeoJsonForExport(geojson);
  return {
    data: JSON.stringify(prepped, null, 2),
    filename: filename,
    mimetype: 'application/json'
  };
}

function toKml(geojson) {
  var filename = "".concat(getFilename(geojson), ".kml");
  var prepped = prepareGeoJsonForExport(geojson); // For some reason, google maps doesn't surface id unless it is in the properties
  // So, put it also in properties

  if (prepped.type === 'FeatureCollection') {
    prepped.features.forEach(function (f) {
      f.properties = f.properties || {};
    });
  }

  var kmlString = (0, _tokml["default"])(prepped); // kmlString = addIdToKml(prepped, kmlString);

  return {
    data: kmlString,
    filename: filename,
    mimetype: 'application/xml'
  };
}

function toWkt(geojson) {
  var filename = "".concat(getFilename(geojson), ".wkt");
  var prepped = prepareGeoJsonForExport(geojson);
  var wkt = '';

  if (prepped.type === 'Feature') {
    // @ts-ignore
    wkt = (0, _wellknown.stringify)(prepped);
  } else {
    // feature collection
    wkt = '';

    var _iterator = _createForOfIteratorHelper(prepped.features),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var feature = _step.value;
        // @ts-ignore
        wkt += "".concat((0, _wellknown.stringify)(feature), "\n");
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (wkt.length > 0) {
      wkt = wkt.substring(0, wkt.length - 1);
    }
  }

  return {
    data: wkt,
    filename: filename,
    mimetype: 'text/plain'
  };
}

function toStats(geojson) {
  var filename = "".concat(getFilename(geojson), ".txt");
  var prepped = prepareGeoJsonForExport(geojson);
  var pointCount = 0;
  var ringCount = 0;
  var polygonCount = 0;
  var featureCount = 0;

  if (prepped.type === 'Feature') {
    var polygonStats = getPolygonalStats(prepped.geometry);
    pointCount = polygonStats.pointCount;
    ringCount = polygonStats.ringCount;
    polygonCount = polygonStats.polygonCount;
    featureCount = 1;
  } else {
    var _iterator2 = _createForOfIteratorHelper(prepped.features),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var feature = _step2.value;

        var _polygonStats = getPolygonalStats(feature.geometry);

        pointCount += _polygonStats.pointCount;
        ringCount += _polygonStats.ringCount;
        polygonCount += _polygonStats.polygonCount;
        featureCount++;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  var stats = "Features: ".concat(featureCount, "\nPolygons: ").concat(polygonCount, "\nRings: ").concat(ringCount, "\nPoints: ").concat(pointCount);
  return {
    data: stats,
    filename: filename,
    mimetype: 'text/plain'
  };
}

function getPolygonalStats(geometry) {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return {
      pointCount: -1,
      ringCount: -1,
      polygonCount: -1
    };
  }

  var polygonal = geometry;
  var pointCount = 0;
  var ringCount = 0;
  var polygonCount = 0;

  var _iterator3 = _createForOfIteratorHelper(polygonal.coordinates),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var ringOrPolygon = _step3.value;

      if (geometry.type === 'Polygon') {
        polygonCount = 1;
        ringCount++;
        pointCount += ringOrPolygon.length;
      } else if (geometry.type === 'MultiPolygon') {
        polygonCount++;

        var _iterator4 = _createForOfIteratorHelper(ringOrPolygon),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var ring = _step4.value;
            ringCount++;
            pointCount += ring.length;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return {
    pointCount: pointCount,
    ringCount: ringCount,
    polygonCount: polygonCount
  };
}

function getFilename(geojson) {
  var filename = 'geojsonFeatures';

  if (geojson.type === 'Feature') {
    filename = geojson.properties.name || UNNAMED;
  }

  return filename;
}

function prepareGeoJsonForExport(geojson) {
  var forExport;

  if (geojson.type === 'FeatureCollection') {
    forExport = _objectSpread({}, geojson, {
      features: geojson.features.map(prepareFeatureForExport)
    });
  } else {
    forExport = prepareFeatureForExport(geojson);
  }

  return forExport;
}

function prepareFeatureForExport(feature) {
  var prepped = _objectSpread({}, feature, {
    properties: _objectSpread({}, feature.properties, {
      name: feature.properties.name || UNNAMED,
      description: feature.properties.description || ''
    })
  });

  return prepped;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZXhwb3J0ZXIudHMiXSwibmFtZXMiOlsiVU5OQU1FRCIsInRvR2VvSnNvbiIsImdlb2pzb24iLCJmaWxlbmFtZSIsImdldEZpbGVuYW1lIiwicHJlcHBlZCIsInByZXBhcmVHZW9Kc29uRm9yRXhwb3J0IiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJtaW1ldHlwZSIsInRvS21sIiwidHlwZSIsImZlYXR1cmVzIiwiZm9yRWFjaCIsImYiLCJwcm9wZXJ0aWVzIiwia21sU3RyaW5nIiwidG9Xa3QiLCJ3a3QiLCJmZWF0dXJlIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwidG9TdGF0cyIsInBvaW50Q291bnQiLCJyaW5nQ291bnQiLCJwb2x5Z29uQ291bnQiLCJmZWF0dXJlQ291bnQiLCJwb2x5Z29uU3RhdHMiLCJnZXRQb2x5Z29uYWxTdGF0cyIsImdlb21ldHJ5Iiwic3RhdHMiLCJwb2x5Z29uYWwiLCJjb29yZGluYXRlcyIsInJpbmdPclBvbHlnb24iLCJyaW5nIiwibmFtZSIsImZvckV4cG9ydCIsIm1hcCIsInByZXBhcmVGZWF0dXJlRm9yRXhwb3J0IiwiZGVzY3JpcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJTyxJQUFNQSxPQUFPLEdBQUcscUJBQWhCOzs7QUFRQSxTQUFTQyxTQUFULENBQW1CQyxPQUFuQixFQUEwRDtBQUMvRCxNQUFNQyxRQUFRLGFBQU1DLFdBQVcsQ0FBQ0YsT0FBRCxDQUFqQixhQUFkO0FBQ0EsTUFBTUcsT0FBTyxHQUFHQyx1QkFBdUIsQ0FBQ0osT0FBRCxDQUF2QztBQUVBLFNBQU87QUFDTEssSUFBQUEsSUFBSSxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUosT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUREO0FBRUxGLElBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMTyxJQUFBQSxRQUFRLEVBQUU7QUFITCxHQUFQO0FBS0Q7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QUVELFNBQU9tQyxTQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsdUJBQVQsQ0FBaUNuQixPQUFqQyxFQUE0RDtBQUMxRCxNQUFNZixPQUFPLHFCQUNSZSxPQURRO0FBRVhKLElBQUFBLFVBQVUsb0JBQ0xJLE9BQU8sQ0FBQ0osVUFESDtBQUVSb0IsTUFBQUEsSUFBSSxFQUFFaEIsT0FBTyxDQUFDSixVQUFSLENBQW1Cb0IsSUFBbkIsSUFBMkJwQyxPQUZ6QjtBQUdSd0MsTUFBQUEsV0FBVyxFQUFFcEIsT0FBTyxDQUFDSixVQUFSLENBQW1Cd0IsV0FBbkIsSUFBa0M7QUFIdkM7QUFGQyxJQUFiOztBQVNBLFNBQU9uQyxPQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHRva21sIGZyb20gJ0BtYXBodWJzL3Rva21sJztcbmltcG9ydCB7IHN0cmluZ2lmeSBhcyBzdHJpbmdpZnlXa3QgfSBmcm9tICd3ZWxsa25vd24nO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgRmVhdHVyZSwgQW55R2VvSnNvbiwgR2VvbWV0cnksIFBvbHlnb25hbEdlb21ldHJ5IH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcblxuZXhwb3J0IGNvbnN0IFVOTkFNRUQgPSAnX191bm5hbWVkX2ZlYXR1cmVfXyc7XG5cbmV4cG9ydCB0eXBlIEV4cG9ydFBhcmFtZXRlcnMgPSB7XG4gIGRhdGE6IHN0cmluZztcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgbWltZXR5cGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0dlb0pzb24oZ2VvanNvbjogQW55R2VvSnNvbik6IEV4cG9ydFBhcmFtZXRlcnMge1xuICBjb25zdCBmaWxlbmFtZSA9IGAke2dldEZpbGVuYW1lKGdlb2pzb24pfS5nZW9qc29uYDtcbiAgY29uc3QgcHJlcHBlZCA9IHByZXBhcmVHZW9Kc29uRm9yRXhwb3J0KGdlb2pzb24pO1xuXG4gIHJldHVybiB7XG4gICAgZGF0YTogSlNPTi5zdHJpbmdpZnkocHJlcHBlZCwgbnVsbCwgMiksXG4gICAgZmlsZW5hbWUsXG4gICAgbWltZXR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvS21sKGdlb2pzb246IEFueUdlb0pzb24pOiBFeHBvcnRQYXJhbWV0ZXJzIHtcbiAgY29uc3QgZmlsZW5hbWUgPSBgJHtnZXRGaWxlbmFtZShnZW9qc29uKX0ua21sYDtcbiAgY29uc3QgcHJlcHBlZCA9IHByZXBhcmVHZW9Kc29uRm9yRXhwb3J0KGdlb2pzb24pO1xuXG4gIC8vIEZvciBzb21lIHJlYXNvbiwgZ29vZ2xlIG1hcHMgZG9lc24ndCBzdXJmYWNlIGlkIHVubGVzcyBpdCBpcyBpbiB0aGUgcHJvcGVydGllc1xuICAvLyBTbywgcHV0IGl0IGFsc28gaW4gcHJvcGVydGllc1xuICBpZiAocHJlcHBlZC50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgcHJlcHBlZC5mZWF0dXJlcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBmLnByb3BlcnRpZXMgPSBmLnByb3BlcnRpZXMgfHwge307XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBrbWxTdHJpbmcgPSB0b2ttbChwcmVwcGVkKTtcblxuICAvLyBrbWxTdHJpbmcgPSBhZGRJZFRvS21sKHByZXBwZWQsIGttbFN0cmluZyk7XG5cbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBrbWxTdHJpbmcsXG4gICAgZmlsZW5hbWUsXG4gICAgbWltZXR5cGU6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Xa3QoZ2VvanNvbjogQW55R2VvSnNvbik6IEV4cG9ydFBhcmFtZXRlcnMge1xuICBjb25zdCBmaWxlbmFtZSA9IGAke2dldEZpbGVuYW1lKGdlb2pzb24pfS53a3RgO1xuICBjb25zdCBwcmVwcGVkID0gcHJlcGFyZUdlb0pzb25Gb3JFeHBvcnQoZ2VvanNvbik7XG5cbiAgbGV0IHdrdCA9ICcnO1xuICBpZiAocHJlcHBlZC50eXBlID09PSAnRmVhdHVyZScpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2t0ID0gc3RyaW5naWZ5V2t0KHByZXBwZWQpO1xuICB9IGVsc2Uge1xuICAgIC8vIGZlYXR1cmUgY29sbGVjdGlvblxuICAgIHdrdCA9ICcnO1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBwcmVwcGVkLmZlYXR1cmVzKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB3a3QgKz0gYCR7c3RyaW5naWZ5V2t0KGZlYXR1cmUpfVxcbmA7XG4gICAgfVxuICAgIGlmICh3a3QubGVuZ3RoID4gMCkge1xuICAgICAgd2t0ID0gd2t0LnN1YnN0cmluZygwLCB3a3QubGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkYXRhOiB3a3QsXG4gICAgZmlsZW5hbWUsXG4gICAgbWltZXR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvU3RhdHMoZ2VvanNvbjogQW55R2VvSnNvbik6IEV4cG9ydFBhcmFtZXRlcnMge1xuICBjb25zdCBmaWxlbmFtZSA9IGAke2dldEZpbGVuYW1lKGdlb2pzb24pfS50eHRgO1xuICBjb25zdCBwcmVwcGVkID0gcHJlcGFyZUdlb0pzb25Gb3JFeHBvcnQoZ2VvanNvbik7XG5cbiAgbGV0IHBvaW50Q291bnQgPSAwO1xuICBsZXQgcmluZ0NvdW50ID0gMDtcbiAgbGV0IHBvbHlnb25Db3VudCA9IDA7XG4gIGxldCBmZWF0dXJlQ291bnQgPSAwO1xuXG4gIGlmIChwcmVwcGVkLnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgIGNvbnN0IHBvbHlnb25TdGF0cyA9IGdldFBvbHlnb25hbFN0YXRzKHByZXBwZWQuZ2VvbWV0cnkpO1xuICAgICh7IHBvaW50Q291bnQsIHJpbmdDb3VudCwgcG9seWdvbkNvdW50IH0gPSBwb2x5Z29uU3RhdHMpO1xuICAgIGZlYXR1cmVDb3VudCA9IDE7XG4gIH0gZWxzZSB7XG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHByZXBwZWQuZmVhdHVyZXMpIHtcbiAgICAgIGNvbnN0IHBvbHlnb25TdGF0cyA9IGdldFBvbHlnb25hbFN0YXRzKGZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgICAgcG9pbnRDb3VudCArPSBwb2x5Z29uU3RhdHMucG9pbnRDb3VudDtcbiAgICAgIHJpbmdDb3VudCArPSBwb2x5Z29uU3RhdHMucmluZ0NvdW50O1xuICAgICAgcG9seWdvbkNvdW50ICs9IHBvbHlnb25TdGF0cy5wb2x5Z29uQ291bnQ7XG4gICAgICBmZWF0dXJlQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGF0cyA9IGBGZWF0dXJlczogJHtmZWF0dXJlQ291bnR9XG5Qb2x5Z29uczogJHtwb2x5Z29uQ291bnR9XG5SaW5nczogJHtyaW5nQ291bnR9XG5Qb2ludHM6ICR7cG9pbnRDb3VudH1gO1xuXG4gIHJldHVybiB7XG4gICAgZGF0YTogc3RhdHMsXG4gICAgZmlsZW5hbWUsXG4gICAgbWltZXR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UG9seWdvbmFsU3RhdHMoZ2VvbWV0cnk6IEdlb21ldHJ5KSB7XG4gIGlmIChnZW9tZXRyeS50eXBlICE9PSAnUG9seWdvbicgJiYgZ2VvbWV0cnkudHlwZSAhPT0gJ011bHRpUG9seWdvbicpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9pbnRDb3VudDogLTEsXG4gICAgICByaW5nQ291bnQ6IC0xLFxuICAgICAgcG9seWdvbkNvdW50OiAtMSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgcG9seWdvbmFsOiBQb2x5Z29uYWxHZW9tZXRyeSA9IGdlb21ldHJ5O1xuXG4gIGxldCBwb2ludENvdW50ID0gMDtcbiAgbGV0IHJpbmdDb3VudCA9IDA7XG4gIGxldCBwb2x5Z29uQ291bnQgPSAwO1xuICBmb3IgKGNvbnN0IHJpbmdPclBvbHlnb24gb2YgcG9seWdvbmFsLmNvb3JkaW5hdGVzKSB7XG4gICAgaWYgKGdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgcG9seWdvbkNvdW50ID0gMTtcbiAgICAgIHJpbmdDb3VudCsrO1xuICAgICAgcG9pbnRDb3VudCArPSByaW5nT3JQb2x5Z29uLmxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKGdlb21ldHJ5LnR5cGUgPT09ICdNdWx0aVBvbHlnb24nKSB7XG4gICAgICBwb2x5Z29uQ291bnQrKztcbiAgICAgIGZvciAoY29uc3QgcmluZyBvZiByaW5nT3JQb2x5Z29uKSB7XG4gICAgICAgIHJpbmdDb3VudCsrO1xuICAgICAgICBwb2ludENvdW50ICs9IHJpbmcubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIHBvaW50Q291bnQsXG4gICAgcmluZ0NvdW50LFxuICAgIHBvbHlnb25Db3VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0RmlsZW5hbWUoZ2VvanNvbikge1xuICBsZXQgZmlsZW5hbWUgPSAnZ2VvanNvbkZlYXR1cmVzJztcbiAgaWYgKGdlb2pzb24udHlwZSA9PT0gJ0ZlYXR1cmUnKSB7XG4gICAgZmlsZW5hbWUgPSBnZW9qc29uLnByb3BlcnRpZXMubmFtZSB8fCBVTk5BTUVEO1xuICB9XG4gIHJldHVybiBmaWxlbmFtZTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZUdlb0pzb25Gb3JFeHBvcnQoZ2VvanNvbjogQW55R2VvSnNvbik6IEFueUdlb0pzb24ge1xuICBsZXQgZm9yRXhwb3J0O1xuICBpZiAoZ2VvanNvbi50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgZm9yRXhwb3J0ID0ge1xuICAgICAgLi4uZ2VvanNvbixcbiAgICAgIGZlYXR1cmVzOiBnZW9qc29uLmZlYXR1cmVzLm1hcChwcmVwYXJlRmVhdHVyZUZvckV4cG9ydCksXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBmb3JFeHBvcnQgPSBwcmVwYXJlRmVhdHVyZUZvckV4cG9ydChnZW9qc29uKTtcbiAgfVxuXG4gIHJldHVybiBmb3JFeHBvcnQ7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVGZWF0dXJlRm9yRXhwb3J0KGZlYXR1cmU6IEZlYXR1cmUpOiBGZWF0dXJlIHtcbiAgY29uc3QgcHJlcHBlZCA9IHtcbiAgICAuLi5mZWF0dXJlLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIC4uLmZlYXR1cmUucHJvcGVydGllcyxcbiAgICAgIG5hbWU6IGZlYXR1cmUucHJvcGVydGllcy5uYW1lIHx8IFVOTkFNRUQsXG4gICAgICBkZXNjcmlwdGlvbjogZmVhdHVyZS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uIHx8ICcnLFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHByZXBwZWQ7XG59XG4iXX0=