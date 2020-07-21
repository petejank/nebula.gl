"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportComponent = ExportComponent;

var React = _interopRequireWildcard(require("react"));

var _clipboardCopy = _interopRequireDefault(require("clipboard-copy"));

var _downloadjs = _interopRequireDefault(require("downloadjs"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _exporter = require("./lib/exporter");

var _editorModal = require("./editor-modal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: flex-end;\n  padding: 0.75rem 0.75rem;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  padding: 0px;\n  width: 100%;\n  resize: vertical;\n  min-height: 300px;\n  max-height: 500px;\n  border: 1px solid rgb(206, 212, 218);\n  border-radius: 0.3rem;\n  font-family: -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',\n    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  font-size: 1rem;\n  font-weight: 400;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  display: block;\n  width: auto;\n  height: auto;\n  min-height: 300px;\n  padding: 0rem 1rem;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  padding: 0.75rem 0.75rem 0rem 0.75rem;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var FormatSelect = _styledComponents["default"].div(_templateObject());

var ExportArea = _styledComponents["default"].div(_templateObject2());

var ExportData = _styledComponents["default"].textarea(_templateObject3());

var FooterRow = _styledComponents["default"].div(_templateObject4());

function ExportComponent(props) {
  var geojson = props.features;

  var _React$useState = React.useState((0, _exporter.toGeoJson)(geojson)),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      exportParams = _React$useState2[0],
      setExportParams = _React$useState2[1];

  var _React$useState3 = React.useState('geoJson'),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      format = _React$useState4[0],
      setFormat = _React$useState4[1];

  var tooMuch = exportParams.data.length > 500000;

  function copyData() {
    (0, _clipboardCopy["default"])(exportParams.data).then(function () {
      return props.onClose();
    }); // TODO Design and add in a notifications banner for errors in the modal.
    //   .catch(err => {alert(`Error copying to clipboard: `, err)})
  }

  function downloadData() {
    (0, _downloadjs["default"])(new Blob([exportParams.data]), exportParams.filename, exportParams.mimetype);
    props.onClose();
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormatSelect, null, /*#__PURE__*/React.createElement("strong", {
    style: {
      padding: '0.5rem 0.25rem'
    }
  }, "Format:"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: format === 'geoJson' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
    },
    onClick: function onClick() {
      setExportParams((0, _exporter.toGeoJson)(geojson));
      setFormat('geoJson');
    }
  }, "GeoJson"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: format === 'kml' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
    },
    onClick: function onClick() {
      setExportParams((0, _exporter.toKml)(geojson));
      setFormat('kml');
    }
  }, "KML"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: format === 'wkt' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
    },
    onClick: function onClick() {
      setExportParams((0, _exporter.toWkt)(geojson));
      setFormat('wkt');
    }
  }, "WKT")), /*#__PURE__*/React.createElement(ExportArea, null, /*#__PURE__*/React.createElement(ExportData, {
    readOnly: true,
    style: tooMuch ? {
      fontStyle: 'italic',
      padding: '0.75rem 0rem'
    } : {},
    value: tooMuch ? 'Too much data to display. Download or Copy to clipboard instead.' : exportParams.data
  })), /*#__PURE__*/React.createElement(FooterRow, null, /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: 'rgb(0, 105, 217)'
    },
    onClick: downloadData
  }, "Download"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: 'rgb(0, 105, 217)'
    },
    onClick: copyData
  }, "Copy"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    onClick: props.onClose
  }, "Cancel")));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leHBvcnQtY29tcG9uZW50LnRzeCJdLCJuYW1lcyI6WyJGb3JtYXRTZWxlY3QiLCJzdHlsZWQiLCJkaXYiLCJFeHBvcnRBcmVhIiwiRXhwb3J0RGF0YSIsInRleHRhcmVhIiwiRm9vdGVyUm93IiwiRXhwb3J0Q29tcG9uZW50IiwicHJvcHMiLCJnZW9qc29uIiwiZmVhdHVyZXMiLCJSZWFjdCIsInVzZVN0YXRlIiwiZXhwb3J0UGFyYW1zIiwic2V0RXhwb3J0UGFyYW1zIiwiZm9ybWF0Iiwic2V0Rm9ybWF0IiwidG9vTXVjaCIsImRhdGEiLCJsZW5ndGgiLCJjb3B5RGF0YSIsInRoZW4iLCJvbkNsb3NlIiwiZG93bmxvYWREYXRhIiwiQmxvYiIsImZpbGVuYW1lIiwibWltZXR5cGUiLCJwYWRkaW5nIiwiYmFja2dyb3VuZENvbG9yIiwiZm9udFN0eWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUFsQjs7QUFLQSxJQUFNQyxVQUFVLEdBQUdGLDZCQUFPQyxHQUFWLG9CQUFoQjs7QUFTQSxJQUFNRSxVQUFVLEdBQUdILDZCQUFPSSxRQUFWLG9CQUFoQjs7QUFjQSxJQUFNQyxTQUFTLEdBQUdMLDZCQUFPQyxHQUFWLG9CQUFmOztBQVdPLFNBQVNLLGVBQVQsQ0FBeUJDLEtBQXpCLEVBQXNEO0FBQzNELE1BQU1DLE9BQU8sR0FBR0QsS0FBSyxDQUFDRSxRQUF0Qjs7QUFEMkQsd0JBRW5CQyxLQUFLLENBQUNDLFFBQU4sQ0FBZSx5QkFBVUgsT0FBVixDQUFmLENBRm1CO0FBQUE7QUFBQSxNQUVwREksWUFGb0Q7QUFBQSxNQUV0Q0MsZUFGc0M7O0FBQUEseUJBRy9CSCxLQUFLLENBQUNDLFFBQU4sQ0FBZSxTQUFmLENBSCtCO0FBQUE7QUFBQSxNQUdwREcsTUFIb0Q7QUFBQSxNQUc1Q0MsU0FINEM7O0FBSzNELE1BQU1DLE9BQU8sR0FBR0osWUFBWSxDQUFDSyxJQUFiLENBQWtCQyxNQUFsQixHQUEyQixNQUEzQzs7QUFFQSxXQUFTQyxRQUFULEdBQW9CO0FBQ2xCLG1DQUFLUCxZQUFZLENBQUNLLElBQWxCLEVBQXdCRyxJQUF4QixDQUE2QjtBQUFBLGFBQU1iLEtBQUssQ0FBQ2MsT0FBTixFQUFOO0FBQUEsS0FBN0IsRUFEa0IsQ0FFbEI7QUFDQTtBQUNEOztBQUVELFdBQVNDLFlBQVQsR0FBd0I7QUFDdEIsZ0NBQVcsSUFBSUMsSUFBSixDQUFTLENBQUNYLFlBQVksQ0FBQ0ssSUFBZCxDQUFULENBQVgsRUFBMENMLFlBQVksQ0FBQ1ksUUFBdkQsRUFBaUVaLFlBQVksQ0FBQ2EsUUFBOUU7QUFDQWxCLElBQUFBLEtBQUssQ0FBQ2MsT0FBTjtBQUNEOztBQUVELHNCQUNFLHVEQUNFLG9CQUFDLFlBQUQscUJBQ0U7QUFBUSxJQUFBLEtBQUssRUFBRTtBQUFFSyxNQUFBQSxPQUFPLEVBQUU7QUFBWDtBQUFmLGVBREYsZUFFRSxvQkFBQyxtQkFBRDtBQUNFLElBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLGVBQWUsRUFBRWIsTUFBTSxLQUFLLFNBQVgsR0FBdUIsa0JBQXZCLEdBQTRDO0FBRHhELEtBRFQ7QUFJRSxJQUFBLE9BQU8sRUFBRSxtQkFBTTtBQUNiRCxNQUFBQSxlQUFlLENBQUMseUJBQVVMLE9BQVYsQ0FBRCxDQUFmO0FBQ0FPLE1BQUFBLFNBQVMsQ0FBQyxTQUFELENBQVQ7QUFDRDtBQVBILGVBRkYsZUFhRSxvQkFBQyxtQkFBRDtBQUNFLElBQUEsS0FBSyxFQUFFO0FBQ0xZLE1BQUFBLGVBQWUsRUFBRWIsTUFBTSxLQUFLLEtBQVgsR0FBbUIsa0JBQW5CLEdBQXdDO0FBRHBELEtBRFQ7QUFJRSxJQUFBLE9BQU8sRUFBRSxtQkFBTTtBQUNiRCxNQUFBQSxlQUFlLENBQUMscUJBQU1MLE9BQU4sQ0FBRCxDQUFmO0FBQ0FPLE1BQUFBLFNBQVMsQ0FBQyxLQUFELENBQVQ7QUFDRDtBQVBILFdBYkYsZUF3QkUsb0JBQUMsbUJBQUQ7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMWSxNQUFBQSxlQUFlLEVBQUViLE1BQU0sS0FBSyxLQUFYLEdBQW1CLGtCQUFuQixHQUF3QztBQURwRCxLQURUO0FBSUUsSUFBQSxPQUFPLEVBQUUsbUJBQU07QUFDYkQsTUFBQUEsZUFBZSxDQUFDLHFCQUFNTCxPQUFOLENBQUQsQ0FBZjtBQUNBTyxNQUFBQSxTQUFTLENBQUMsS0FBRCxDQUFUO0FBQ0Q7QUFQSCxXQXhCRixDQURGLGVBcUNFLG9CQUFDLFVBQUQscUJBQ0Usb0JBQUMsVUFBRDtBQUNFLElBQUEsUUFBUSxFQUFFLElBRFo7QUFFRSxJQUFBLEtBQUssRUFBRUMsT0FBTyxHQUFHO0FBQUVZLE1BQUFBLFNBQVMsRUFBRSxRQUFiO0FBQXVCRixNQUFBQSxPQUFPLEVBQUU7QUFBaEMsS0FBSCxHQUFzRCxFQUZ0RTtBQUdFLElBQUEsS0FBSyxFQUNIVixPQUFPLEdBQ0gsa0VBREcsR0FFSEosWUFBWSxDQUFDSztBQU5yQixJQURGLENBckNGLGVBZ0RFLG9CQUFDLFNBQUQscUJBQ0Usb0JBQUMsbUJBQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTtBQUFFVSxNQUFBQSxlQUFlLEVBQUU7QUFBbkIsS0FBZjtBQUF3RCxJQUFBLE9BQU8sRUFBRUw7QUFBakUsZ0JBREYsZUFJRSxvQkFBQyxtQkFBRDtBQUFRLElBQUEsS0FBSyxFQUFFO0FBQUVLLE1BQUFBLGVBQWUsRUFBRTtBQUFuQixLQUFmO0FBQXdELElBQUEsT0FBTyxFQUFFUjtBQUFqRSxZQUpGLGVBT0Usb0JBQUMsbUJBQUQ7QUFBUSxJQUFBLE9BQU8sRUFBRVosS0FBSyxDQUFDYztBQUF2QixjQVBGLENBaERGLENBREY7QUE0REQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNvcHkgZnJvbSAnY2xpcGJvYXJkLWNvcHknO1xuaW1wb3J0IGRvd25sb2FkanMgZnJvbSAnZG93bmxvYWRqcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7IHRvR2VvSnNvbiwgdG9LbWwsIHRvV2t0IH0gZnJvbSAnLi9saWIvZXhwb3J0ZXInO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi9lZGl0b3ItbW9kYWwnO1xuXG5jb25zdCBGb3JtYXRTZWxlY3QgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwLjc1cmVtIDAuNzVyZW0gMHJlbSAwLjc1cmVtO1xuYDtcblxuY29uc3QgRXhwb3J0QXJlYSA9IHN0eWxlZC5kaXZgXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuICBtaW4taGVpZ2h0OiAzMDBweDtcbiAgcGFkZGluZzogMHJlbSAxcmVtO1xuYDtcblxuY29uc3QgRXhwb3J0RGF0YSA9IHN0eWxlZC50ZXh0YXJlYWBcbiAgcGFkZGluZzogMHB4O1xuICB3aWR0aDogMTAwJTtcbiAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgbWluLWhlaWdodDogMzAwcHg7XG4gIG1heC1oZWlnaHQ6IDUwMHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA2LCAyMTIsIDIxOCk7XG4gIGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcbiAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIHN5c3RlbS11aSwgJ1NlZ29lIFVJJywgUm9ib3RvLCAnSGVsdmV0aWNhIE5ldWUnLCBBcmlhbCwgJ05vdG8gU2FucycsXG4gICAgc2Fucy1zZXJpZiwgJ0FwcGxlIENvbG9yIEVtb2ppJywgJ1NlZ29lIFVJIEVtb2ppJywgJ1NlZ29lIFVJIFN5bWJvbCcsICdOb3RvIENvbG9yIEVtb2ppJztcbiAgZm9udC1zaXplOiAxcmVtO1xuICBmb250LXdlaWdodDogNDAwO1xuYDtcblxuY29uc3QgRm9vdGVyUm93ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgcGFkZGluZzogMC43NXJlbSAwLjc1cmVtO1xuYDtcblxuZXhwb3J0IHR5cGUgRXhwb3J0Q29tcG9uZW50UHJvcHMgPSB7XG4gIGZlYXR1cmVzOiBhbnk7XG4gIG9uQ2xvc2U6ICgpID0+IHVua25vd247XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gRXhwb3J0Q29tcG9uZW50KHByb3BzOiBFeHBvcnRDb21wb25lbnRQcm9wcykge1xuICBjb25zdCBnZW9qc29uID0gcHJvcHMuZmVhdHVyZXM7XG4gIGNvbnN0IFtleHBvcnRQYXJhbXMsIHNldEV4cG9ydFBhcmFtc10gPSBSZWFjdC51c2VTdGF0ZSh0b0dlb0pzb24oZ2VvanNvbikpO1xuICBjb25zdCBbZm9ybWF0LCBzZXRGb3JtYXRdID0gUmVhY3QudXNlU3RhdGUoJ2dlb0pzb24nKTtcblxuICBjb25zdCB0b29NdWNoID0gZXhwb3J0UGFyYW1zLmRhdGEubGVuZ3RoID4gNTAwMDAwO1xuXG4gIGZ1bmN0aW9uIGNvcHlEYXRhKCkge1xuICAgIGNvcHkoZXhwb3J0UGFyYW1zLmRhdGEpLnRoZW4oKCkgPT4gcHJvcHMub25DbG9zZSgpKTtcbiAgICAvLyBUT0RPIERlc2lnbiBhbmQgYWRkIGluIGEgbm90aWZpY2F0aW9ucyBiYW5uZXIgZm9yIGVycm9ycyBpbiB0aGUgbW9kYWwuXG4gICAgLy8gICAuY2F0Y2goZXJyID0+IHthbGVydChgRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6IGAsIGVycil9KVxuICB9XG5cbiAgZnVuY3Rpb24gZG93bmxvYWREYXRhKCkge1xuICAgIGRvd25sb2FkanMobmV3IEJsb2IoW2V4cG9ydFBhcmFtcy5kYXRhXSksIGV4cG9ydFBhcmFtcy5maWxlbmFtZSwgZXhwb3J0UGFyYW1zLm1pbWV0eXBlKTtcbiAgICBwcm9wcy5vbkNsb3NlKCk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8Rm9ybWF0U2VsZWN0PlxuICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IHBhZGRpbmc6ICcwLjVyZW0gMC4yNXJlbScgfX0+Rm9ybWF0Ojwvc3Ryb25nPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZm9ybWF0ID09PSAnZ2VvSnNvbicgPyAncmdiKDAsIDEwNSwgMjE3KScgOiAncmdiKDkwLCA5OCwgOTQpJyxcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHNldEV4cG9ydFBhcmFtcyh0b0dlb0pzb24oZ2VvanNvbikpO1xuICAgICAgICAgICAgc2V0Rm9ybWF0KCdnZW9Kc29uJyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIEdlb0pzb25cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBmb3JtYXQgPT09ICdrbWwnID8gJ3JnYigwLCAxMDUsIDIxNyknIDogJ3JnYig5MCwgOTgsIDk0KScsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRFeHBvcnRQYXJhbXModG9LbWwoZ2VvanNvbikpO1xuICAgICAgICAgICAgc2V0Rm9ybWF0KCdrbWwnKTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgS01MXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZm9ybWF0ID09PSAnd2t0JyA/ICdyZ2IoMCwgMTA1LCAyMTcpJyA6ICdyZ2IoOTAsIDk4LCA5NCknLFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgc2V0RXhwb3J0UGFyYW1zKHRvV2t0KGdlb2pzb24pKTtcbiAgICAgICAgICAgIHNldEZvcm1hdCgnd2t0Jyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIFdLVFxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvRm9ybWF0U2VsZWN0PlxuICAgICAgPEV4cG9ydEFyZWE+XG4gICAgICAgIDxFeHBvcnREYXRhXG4gICAgICAgICAgcmVhZE9ubHk9e3RydWV9XG4gICAgICAgICAgc3R5bGU9e3Rvb011Y2ggPyB7IGZvbnRTdHlsZTogJ2l0YWxpYycsIHBhZGRpbmc6ICcwLjc1cmVtIDByZW0nIH0gOiB7fX1cbiAgICAgICAgICB2YWx1ZT17XG4gICAgICAgICAgICB0b29NdWNoXG4gICAgICAgICAgICAgID8gJ1RvbyBtdWNoIGRhdGEgdG8gZGlzcGxheS4gRG93bmxvYWQgb3IgQ29weSB0byBjbGlwYm9hcmQgaW5zdGVhZC4nXG4gICAgICAgICAgICAgIDogZXhwb3J0UGFyYW1zLmRhdGFcbiAgICAgICAgICB9XG4gICAgICAgIC8+XG4gICAgICA8L0V4cG9ydEFyZWE+XG4gICAgICA8Rm9vdGVyUm93PlxuICAgICAgICA8QnV0dG9uIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogJ3JnYigwLCAxMDUsIDIxNyknIH19IG9uQ2xpY2s9e2Rvd25sb2FkRGF0YX0+XG4gICAgICAgICAgRG93bmxvYWRcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiAncmdiKDAsIDEwNSwgMjE3KScgfX0gb25DbGljaz17Y29weURhdGF9PlxuICAgICAgICAgIENvcHlcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17cHJvcHMub25DbG9zZX0+Q2FuY2VsPC9CdXR0b24+XG4gICAgICA8L0Zvb3RlclJvdz5cbiAgICA8Lz5cbiAgKTtcbn1cbiJdfQ==