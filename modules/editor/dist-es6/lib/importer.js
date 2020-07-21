"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseImport = parseImport;

var _togeojson = require("@tmcw/togeojson");

var _core = require("@loaders.gl/core");

var _wkt = require("@loaders.gl/wkt");

/* eslint-env browser */
function shouldTryGeoJson(data) {
  return data.startsWith('{');
}

function shouldTryKml(data) {
  return data.startsWith('<');
}

function shouldTryWkt(data) {
  return data.startsWith('POINT') || data.startsWith('LINESTRING') || data.startsWith('POLYGON') || data.startsWith('MULTIPOINT') || data.startsWith('MULTILINESTRING') || data.startsWith('MULTIPOLYGON');
}

function getCleanedFeatures(geojson) {
  if (geojson.type !== 'FeatureCollection' && geojson.type !== 'Feature') {
    throw Error("GeoJSON must have type of 'Feature' or 'FeatureCollection'");
  }

  var features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
  return features.map(getCleanedFeature);
}

function getCleanedFeature(feature) {
  var geometry = feature.geometry; // reduce null-checking

  var properties = feature.properties || {}; // @ts-ignore

  if (geometry.type === 'GeometryCollection' && geometry.geometries.length === 1) {
    // There's only one geometry
    // @ts-ignore
    geometry = geometry.geometries[0]; // @ts-ignore
  } else if (geometry.type === 'GeometryCollection' && geometry.geometries.length > 1) {
    // @ts-ignore
    var types = new Set(geometry.geometries.map(function (g) {
      return g.type;
    }));

    if (types.size === 1) {
      // See if it can be combined into a Multi* geometry
      var type = types.values().next().value;

      if (type === 'Polygon') {
        // Combine all the polygons into a single MultiPolygon
        geometry = {
          type: 'MultiPolygon',
          // @ts-ignore
          coordinates: geometry.geometries.map(function (g) {
            return g.coordinates;
          })
        };
      } else if (type === 'LineString') {
        // Combine all the polygons into a single MultiPolygon
        geometry = {
          type: 'MultiLineString',
          // @ts-ignore
          coordinates: geometry.geometries.map(function (g) {
            return g.coordinates;
          })
        };
      }
    } else {
      // Mixed geometry types, we don't yet handle it
      throw Error('GeometryCollection geometry type not yet supported');
    }
  } // @ts-ignore


  return {
    type: 'Feature',
    geometry: geometry,
    properties: properties
  };
}

function parseImportString(data) {
  data = data.trim();
  var validData;
  var validationErrors = [];

  if (shouldTryGeoJson(data)) {
    // Parse as GeoJSON
    try {
      var parsed = JSON.parse(data);
      validData = {
        valid: true,
        type: 'GeoJSON',
        features: getCleanedFeatures(parsed)
      };
    } catch (err) {
      validationErrors.push('Error parsing GeoJSON');
      validationErrors.push(err.toString());
    }
  } else if (shouldTryKml(data)) {
    // Parse as KML
    var xml = new DOMParser().parseFromString(data, 'text/xml');

    try {
      var _parsed = (0, _togeojson.kml)(xml);
      /*
      TODO: Revisit using loaders.gl/kml for this later
      const parsed_ = parseSync(data, KMLasGeoJsonLoader);
      // This is changing the coordinates to floats, because in loaders.gl/kml 2.1.1 they are returned as strings.
      const parsed = {
        ...parsed_,
        features: parsed_.features.map(f => ({
          ...f,
          geometry: {
            ...f.geometry,
            coordinates: f.geometry.coordinates.map(coords => coords.map(triple => triple.map(s => Number.parseFloat(s))))
          }
        }))
      };
      */


      var isFeature = _parsed && _parsed.type === 'Feature';
      var isFeatureCollectionWithFeatures = _parsed && _parsed.type === 'FeatureCollection' && _parsed.features.length > 0;
      var isValid = isFeature || isFeatureCollectionWithFeatures;

      if (isValid) {
        validData = {
          valid: true,
          type: 'KML',
          features: getCleanedFeatures(_parsed)
        };
      } else {
        validationErrors.push('Invalid KML');
      }
    } catch (err) {
      validationErrors.push('Error parsing KML');
      validationErrors.push(err.toString());
    }
  } else if (shouldTryWkt(data)) {
    try {
      var _parsed2 = (0, _core.parseSync)(data, _wkt.WKTLoader);

      if (_parsed2) {
        validData = {
          valid: true,
          type: 'WKT',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: _parsed2
          }]
        };
      } else {
        validationErrors.push('Invalid WKT');
      }
    } catch (err) {
      validationErrors.push('Error parsing WKT');
      validationErrors.push(err.toString());
    }
  } else {
    validationErrors.push('Unknown data format');
  }

  if (validData) {
    return Promise.resolve(validData);
  }

  return Promise.resolve({
    valid: false,
    validationErrors: validationErrors
  });
}

function parseImportFile(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onload = function () {
      var fileAsString = reader.result;
      resolve(parseImportString(fileAsString));
    };

    reader.onabort = function () {
      reject(Error('file reading was aborted'));
    };

    reader.onerror = function () {
      reject(Error('file reading has failed'));
    };

    reader.readAsText(file);
  });
}

function parseImport(data) {
  if (typeof data === 'string') {
    return parseImportString(data);
  }

  return parseImportFile(data);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW1wb3J0ZXIudHMiXSwibmFtZXMiOlsic2hvdWxkVHJ5R2VvSnNvbiIsImRhdGEiLCJzdGFydHNXaXRoIiwic2hvdWxkVHJ5S21sIiwic2hvdWxkVHJ5V2t0IiwiZ2V0Q2xlYW5lZEZlYXR1cmVzIiwiZ2VvanNvbiIsInR5cGUiLCJFcnJvciIsImZlYXR1cmVzIiwibWFwIiwiZ2V0Q2xlYW5lZEZlYXR1cmUiLCJmZWF0dXJlIiwiZ2VvbWV0cnkiLCJwcm9wZXJ0aWVzIiwiZ2VvbWV0cmllcyIsImxlbmd0aCIsInR5cGVzIiwiU2V0IiwiZyIsInNpemUiLCJ2YWx1ZXMiLCJuZXh0IiwidmFsdWUiLCJjb29yZGluYXRlcyIsInBhcnNlSW1wb3J0U3RyaW5nIiwidHJpbSIsInZhbGlkRGF0YSIsInZhbGlkYXRpb25FcnJvcnMiLCJwYXJzZWQiLCJKU09OIiwicGFyc2UiLCJ2YWxpZCIsImVyciIsInB1c2giLCJ0b1N0cmluZyIsInhtbCIsIkRPTVBhcnNlciIsInBhcnNlRnJvbVN0cmluZyIsImlzRmVhdHVyZSIsImlzRmVhdHVyZUNvbGxlY3Rpb25XaXRoRmVhdHVyZXMiLCJpc1ZhbGlkIiwiV0tUTG9hZGVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJwYXJzZUltcG9ydEZpbGUiLCJmaWxlIiwicmVqZWN0IiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImZpbGVBc1N0cmluZyIsInJlc3VsdCIsIm9uYWJvcnQiLCJvbmVycm9yIiwicmVhZEFzVGV4dCIsInBhcnNlSW1wb3J0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBRUE7O0FBQ0E7O0FBTEE7QUF5QkEsU0FBU0EsZ0JBQVQsQ0FBMEJDLElBQTFCLEVBQWlEO0FBQy9DLFNBQU9BLElBQUksQ0FBQ0MsVUFBTCxDQUFnQixHQUFoQixDQUFQO0FBQ0Q7O0FBRUQsU0FBU0MsWUFBVCxDQUFzQkYsSUFBdEIsRUFBNkM7QUFDM0MsU0FBT0EsSUFBSSxDQUFDQyxVQUFM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QUFQLENBQWtCVCxJQUFsQjtBQUNELEdBZE0sQ0FBUDtBQWVEOztBQUVNLFNBQVNVLFdBQVQsQ0FBcUJ2RCxJQUFyQixFQUErRDtBQUNwRSxNQUFJLE9BQU9BLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsV0FBT3dCLGlCQUFpQixDQUFDeEIsSUFBRCxDQUF4QjtBQUNEOztBQUNELFNBQU80QyxlQUFlLENBQUM1QyxJQUFELENBQXRCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHsga21sIH0gZnJvbSAnQHRtY3cvdG9nZW9qc29uJztcblxuaW1wb3J0IHsgcGFyc2VTeW5jIH0gZnJvbSAnQGxvYWRlcnMuZ2wvY29yZSc7XG5pbXBvcnQgeyBXS1RMb2FkZXIgfSBmcm9tICdAbG9hZGVycy5nbC93a3QnO1xuXG4vLyBJZiB3ZSB3YW50IHRvIHN1cHBvcnQgbm9kZSAtLSB3ZSBuZWVkIHRvIGltcG9ydCB4bWxkb20uXG4vLyBGb3Igbm93LCB3ZSdyZSBvbmx5IHN1cHBvcnRpbmcgYnJvd3NlciBzbyB3ZSBjYW4gbGVhdmUgaXQgb3V0LlxuLy8gaW1wb3J0IHsgRE9NUGFyc2VyIH0gZnJvbSAneG1sZG9tJztcbmltcG9ydCB7IEFueUdlb0pzb24sIEZlYXR1cmUgfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuXG5leHBvcnQgdHlwZSBWYWxpZEltcG9ydERhdGEgPSB7XG4gIHZhbGlkOiB0cnVlO1xuICB0eXBlOiAnR2VvSlNPTicgfCAnS01MJyB8ICdXS1QnO1xuICBmZWF0dXJlczogRmVhdHVyZVtdO1xufTtcblxuZXhwb3J0IHR5cGUgSW52YWxpZEltcG9ydERhdGEgPSB7XG4gIHZhbGlkOiBmYWxzZTtcbiAgdmFsaWRhdGlvbkVycm9yczogc3RyaW5nW107XG59O1xuXG5leHBvcnQgdHlwZSBJbXBvcnREYXRhID0gVmFsaWRJbXBvcnREYXRhIHwgSW52YWxpZEltcG9ydERhdGE7XG5cbmZ1bmN0aW9uIHNob3VsZFRyeUdlb0pzb24oZGF0YTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBkYXRhLnN0YXJ0c1dpdGgoJ3snKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVHJ5S21sKGRhdGE6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZGF0YS5zdGFydHNXaXRoKCc8Jyk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFRyeVdrdChkYXRhOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBkYXRhLnN0YXJ0c1dpdGgoJ1BPSU5UJykgfHxcbiAgICBkYXRhLnN0YXJ0c1dpdGgoJ0xJTkVTVFJJTkcnKSB8fFxuICAgIGRhdGEuc3RhcnRzV2l0aCgnUE9MWUdPTicpIHx8XG4gICAgZGF0YS5zdGFydHNXaXRoKCdNVUxUSVBPSU5UJykgfHxcbiAgICBkYXRhLnN0YXJ0c1dpdGgoJ01VTFRJTElORVNUUklORycpIHx8XG4gICAgZGF0YS5zdGFydHNXaXRoKCdNVUxUSVBPTFlHT04nKVxuICApO1xufVxuXG5mdW5jdGlvbiBnZXRDbGVhbmVkRmVhdHVyZXMoZ2VvanNvbjogQW55R2VvSnNvbik6IEZlYXR1cmVbXSB7XG4gIGlmIChnZW9qc29uLnR5cGUgIT09ICdGZWF0dXJlQ29sbGVjdGlvbicgJiYgZ2VvanNvbi50eXBlICE9PSAnRmVhdHVyZScpIHtcbiAgICB0aHJvdyBFcnJvcihgR2VvSlNPTiBtdXN0IGhhdmUgdHlwZSBvZiAnRmVhdHVyZScgb3IgJ0ZlYXR1cmVDb2xsZWN0aW9uJ2ApO1xuICB9XG5cbiAgY29uc3QgZmVhdHVyZXM6IEZlYXR1cmVbXSA9IGdlb2pzb24udHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJyA/IGdlb2pzb24uZmVhdHVyZXMgOiBbZ2VvanNvbl07XG5cbiAgcmV0dXJuIGZlYXR1cmVzLm1hcChnZXRDbGVhbmVkRmVhdHVyZSk7XG59XG5cbmZ1bmN0aW9uIGdldENsZWFuZWRGZWF0dXJlKGZlYXR1cmU6IEZlYXR1cmUpOiBGZWF0dXJlIHtcbiAgbGV0IGdlb21ldHJ5ID0gZmVhdHVyZS5nZW9tZXRyeTtcbiAgLy8gcmVkdWNlIG51bGwtY2hlY2tpbmdcbiAgY29uc3QgcHJvcGVydGllcyA9IGZlYXR1cmUucHJvcGVydGllcyB8fCB7fTtcbiAgLy8gQHRzLWlnbm9yZVxuICBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicgJiYgZ2VvbWV0cnkuZ2VvbWV0cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICAvLyBUaGVyZSdzIG9ubHkgb25lIGdlb21ldHJ5XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGdlb21ldHJ5ID0gZ2VvbWV0cnkuZ2VvbWV0cmllc1swXTtcbiAgICAvLyBAdHMtaWdub3JlXG4gIH0gZWxzZSBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicgJiYgZ2VvbWV0cnkuZ2VvbWV0cmllcy5sZW5ndGggPiAxKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHR5cGVzID0gbmV3IFNldChnZW9tZXRyeS5nZW9tZXRyaWVzLm1hcCgoZykgPT4gZy50eXBlKSk7XG4gICAgaWYgKHR5cGVzLnNpemUgPT09IDEpIHtcbiAgICAgIC8vIFNlZSBpZiBpdCBjYW4gYmUgY29tYmluZWQgaW50byBhIE11bHRpKiBnZW9tZXRyeVxuICAgICAgY29uc3QgdHlwZSA9IHR5cGVzLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICAgIGlmICh0eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgICAgLy8gQ29tYmluZSBhbGwgdGhlIHBvbHlnb25zIGludG8gYSBzaW5nbGUgTXVsdGlQb2x5Z29uXG4gICAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICAgIHR5cGU6ICdNdWx0aVBvbHlnb24nLFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBjb29yZGluYXRlczogZ2VvbWV0cnkuZ2VvbWV0cmllcy5tYXAoKGcpID0+IGcuY29vcmRpbmF0ZXMpLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgICAgLy8gQ29tYmluZSBhbGwgdGhlIHBvbHlnb25zIGludG8gYSBzaW5nbGUgTXVsdGlQb2x5Z29uXG4gICAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICAgIHR5cGU6ICdNdWx0aUxpbmVTdHJpbmcnLFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBjb29yZGluYXRlczogZ2VvbWV0cnkuZ2VvbWV0cmllcy5tYXAoKGcpID0+IGcuY29vcmRpbmF0ZXMpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBNaXhlZCBnZW9tZXRyeSB0eXBlcywgd2UgZG9uJ3QgeWV0IGhhbmRsZSBpdFxuICAgICAgdGhyb3cgRXJyb3IoJ0dlb21ldHJ5Q29sbGVjdGlvbiBnZW9tZXRyeSB0eXBlIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgZ2VvbWV0cnksXG4gICAgcHJvcGVydGllcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VJbXBvcnRTdHJpbmcoZGF0YTogc3RyaW5nKTogUHJvbWlzZTxJbXBvcnREYXRhPiB7XG4gIGRhdGEgPSBkYXRhLnRyaW0oKTtcbiAgbGV0IHZhbGlkRGF0YTogVmFsaWRJbXBvcnREYXRhIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgY29uc3QgdmFsaWRhdGlvbkVycm9yczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKHNob3VsZFRyeUdlb0pzb24oZGF0YSkpIHtcbiAgICAvLyBQYXJzZSBhcyBHZW9KU09OXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB2YWxpZERhdGEgPSB7XG4gICAgICAgIHZhbGlkOiB0cnVlLFxuICAgICAgICB0eXBlOiAnR2VvSlNPTicsXG4gICAgICAgIGZlYXR1cmVzOiBnZXRDbGVhbmVkRmVhdHVyZXMocGFyc2VkKSxcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB2YWxpZGF0aW9uRXJyb3JzLnB1c2goJ0Vycm9yIHBhcnNpbmcgR2VvSlNPTicpO1xuICAgICAgdmFsaWRhdGlvbkVycm9ycy5wdXNoKGVyci50b1N0cmluZygpKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoc2hvdWxkVHJ5S21sKGRhdGEpKSB7XG4gICAgLy8gUGFyc2UgYXMgS01MXG4gICAgY29uc3QgeG1sID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhkYXRhLCAndGV4dC94bWwnKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBrbWwoeG1sKTtcblxuICAgICAgLypcbiAgICAgIFRPRE86IFJldmlzaXQgdXNpbmcgbG9hZGVycy5nbC9rbWwgZm9yIHRoaXMgbGF0ZXJcbiAgICAgIGNvbnN0IHBhcnNlZF8gPSBwYXJzZVN5bmMoZGF0YSwgS01MYXNHZW9Kc29uTG9hZGVyKTtcbiAgICAgIC8vIFRoaXMgaXMgY2hhbmdpbmcgdGhlIGNvb3JkaW5hdGVzIHRvIGZsb2F0cywgYmVjYXVzZSBpbiBsb2FkZXJzLmdsL2ttbCAyLjEuMSB0aGV5IGFyZSByZXR1cm5lZCBhcyBzdHJpbmdzLlxuICAgICAgY29uc3QgcGFyc2VkID0ge1xuICAgICAgICAuLi5wYXJzZWRfLFxuICAgICAgICBmZWF0dXJlczogcGFyc2VkXy5mZWF0dXJlcy5tYXAoZiA9PiAoe1xuICAgICAgICAgIC4uLmYsXG4gICAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICAgIC4uLmYuZ2VvbWV0cnksXG4gICAgICAgICAgICBjb29yZGluYXRlczogZi5nZW9tZXRyeS5jb29yZGluYXRlcy5tYXAoY29vcmRzID0+IGNvb3Jkcy5tYXAodHJpcGxlID0+IHRyaXBsZS5tYXAocyA9PiBOdW1iZXIucGFyc2VGbG9hdChzKSkpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSkpXG4gICAgICB9O1xuICAgICAgKi9cbiAgICAgIGNvbnN0IGlzRmVhdHVyZSA9IHBhcnNlZCAmJiBwYXJzZWQudHlwZSA9PT0gJ0ZlYXR1cmUnO1xuICAgICAgY29uc3QgaXNGZWF0dXJlQ29sbGVjdGlvbldpdGhGZWF0dXJlcyA9XG4gICAgICAgIHBhcnNlZCAmJiBwYXJzZWQudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJyAmJiBwYXJzZWQuZmVhdHVyZXMubGVuZ3RoID4gMDtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSBpc0ZlYXR1cmUgfHwgaXNGZWF0dXJlQ29sbGVjdGlvbldpdGhGZWF0dXJlcztcbiAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgIHZhbGlkRGF0YSA9IHtcbiAgICAgICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnS01MJyxcbiAgICAgICAgICBmZWF0dXJlczogZ2V0Q2xlYW5lZEZlYXR1cmVzKHBhcnNlZCksXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0aW9uRXJyb3JzLnB1c2goJ0ludmFsaWQgS01MJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB2YWxpZGF0aW9uRXJyb3JzLnB1c2goJ0Vycm9yIHBhcnNpbmcgS01MJyk7XG4gICAgICB2YWxpZGF0aW9uRXJyb3JzLnB1c2goZXJyLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzaG91bGRUcnlXa3QoZGF0YSkpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VTeW5jKGRhdGEsIFdLVExvYWRlcik7XG4gICAgICBpZiAocGFyc2VkKSB7XG4gICAgICAgIHZhbGlkRGF0YSA9IHtcbiAgICAgICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnV0tUJyxcbiAgICAgICAgICBmZWF0dXJlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICBnZW9tZXRyeTogcGFyc2VkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsaWRhdGlvbkVycm9ycy5wdXNoKCdJbnZhbGlkIFdLVCcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdmFsaWRhdGlvbkVycm9ycy5wdXNoKCdFcnJvciBwYXJzaW5nIFdLVCcpO1xuICAgICAgdmFsaWRhdGlvbkVycm9ycy5wdXNoKGVyci50b1N0cmluZygpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsaWRhdGlvbkVycm9ycy5wdXNoKCdVbmtub3duIGRhdGEgZm9ybWF0Jyk7XG4gIH1cblxuICBpZiAodmFsaWREYXRhKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWxpZERhdGEpO1xuICB9XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgIHZhbGlkOiBmYWxzZSxcbiAgICB2YWxpZGF0aW9uRXJyb3JzLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VJbXBvcnRGaWxlKGZpbGU6IEZpbGUpOiBQcm9taXNlPEltcG9ydERhdGE+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlQXNTdHJpbmc6IGFueSA9IHJlYWRlci5yZXN1bHQ7XG4gICAgICByZXNvbHZlKHBhcnNlSW1wb3J0U3RyaW5nKGZpbGVBc1N0cmluZykpO1xuICAgIH07XG4gICAgcmVhZGVyLm9uYWJvcnQgPSAoKSA9PiB7XG4gICAgICByZWplY3QoRXJyb3IoJ2ZpbGUgcmVhZGluZyB3YXMgYWJvcnRlZCcpKTtcbiAgICB9O1xuICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgcmVqZWN0KEVycm9yKCdmaWxlIHJlYWRpbmcgaGFzIGZhaWxlZCcpKTtcbiAgICB9O1xuXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VJbXBvcnQoZGF0YTogc3RyaW5nIHwgRmlsZSk6IFByb21pc2U8SW1wb3J0RGF0YT4ge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHBhcnNlSW1wb3J0U3RyaW5nKGRhdGEpO1xuICB9XG4gIHJldHVybiBwYXJzZUltcG9ydEZpbGUoZGF0YSk7XG59XG4iXX0=