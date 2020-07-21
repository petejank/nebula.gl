"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolbox = Toolbox;

var React = _interopRequireWildcard(require("react"));

var _editModes = require("@nebula.gl/edit-modes");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _importModal = require("./import-modal");

var _exportModal = require("./export-modal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  color: #fff;\n  background-color: rgb(90, 98, 94);\n  font-size: 1em;\n  font-weight: 400;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n    'Noto Color Emoji';\n  border: 1px solid transparent;\n  border-radius: 0.25em;\n  margin: 0.05em;\n  padding: 0.1em 0.2em;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  top: 10px;\n  right: 10px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Tools = _styledComponents["default"].div(_templateObject());

var Button = _styledComponents["default"].span(_templateObject2());

var MODE_BUTTONS = [// TODO: change these to icons
{
  mode: _editModes.ViewMode,
  content: 'View'
}, {
  mode: _editModes.DrawPointMode,
  content: 'Draw Point'
}, {
  mode: _editModes.DrawPolygonMode,
  content: 'Draw Polygon'
}];

function Toolbox(props) {
  // Initialize to zero index on load as nothing is active.
  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      showImport = _React$useState2[0],
      setShowImport = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      showExport = _React$useState4[0],
      setShowExport = _React$useState4[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tools, null, MODE_BUTTONS.map(function (modeButton, i) {
    return /*#__PURE__*/React.createElement(Button, {
      key: i,
      style: {
        backgroundColor: props.mode === modeButton.mode ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
      },
      onClick: function onClick() {
        props.onSetMode(function () {
          return modeButton.mode;
        });
      }
    }, modeButton.content);
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowImport(true);
    }
  }, " Import Geometry "), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowExport(true);
    }
  }, " Export Geometry ")), showImport && /*#__PURE__*/React.createElement(_importModal.ImportModal, {
    onImport: function onImport(geojson) {
      props.onImport(geojson);
      setShowImport(false);
    },
    onClose: function onClose() {
      return setShowImport(false);
    }
  }), showExport && /*#__PURE__*/React.createElement(_exportModal.ExportModal, {
    features: props.features,
    onClose: function onClose() {
      return setShowExport(false);
    }
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90b29sYm94LnRzeCJdLCJuYW1lcyI6WyJUb29scyIsInN0eWxlZCIsImRpdiIsIkJ1dHRvbiIsInNwYW4iLCJNT0RFX0JVVFRPTlMiLCJtb2RlIiwiVmlld01vZGUiLCJjb250ZW50IiwiRHJhd1BvaW50TW9kZSIsIkRyYXdQb2x5Z29uTW9kZSIsIlRvb2xib3giLCJwcm9wcyIsIlJlYWN0IiwidXNlU3RhdGUiLCJzaG93SW1wb3J0Iiwic2V0U2hvd0ltcG9ydCIsInNob3dFeHBvcnQiLCJzZXRTaG93RXhwb3J0IiwibWFwIiwibW9kZUJ1dHRvbiIsImkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJvblNldE1vZGUiLCJnZW9qc29uIiwib25JbXBvcnQiLCJmZWF0dXJlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBR0MsNkJBQU9DLEdBQVYsbUJBQVg7O0FBUUEsSUFBTUMsTUFBTSxHQUFHRiw2QkFBT0csSUFBVixvQkFBWjs7QUFxQkEsSUFBTUMsWUFBWSxHQUFHLENBQ25CO0FBQ0E7QUFBRUMsRUFBQUEsSUFBSSxFQUFFQyxtQkFBUjtBQUFrQkMsRUFBQUEsT0FBTyxFQUFFO0FBQTNCLENBRm1CLEVBR25CO0FBQUVGLEVBQUFBLElBQUksRUFBRUcsd0JBQVI7QUFBdUJELEVBQUFBLE9BQU8sRUFBRTtBQUFoQyxDQUhtQixFQUluQjtBQUFFRixFQUFBQSxJQUFJLEVBQUVJLDBCQUFSO0FBQXlCRixFQUFBQSxPQUFPLEVBQUU7QUFBbEMsQ0FKbUIsQ0FBckI7O0FBT08sU0FBU0csT0FBVCxDQUFpQkMsS0FBakIsRUFBK0I7QUFDcEM7QUFEb0Msd0JBRUFDLEtBQUssQ0FBQ0MsUUFBTixDQUFlLEtBQWYsQ0FGQTtBQUFBO0FBQUEsTUFFN0JDLFVBRjZCO0FBQUEsTUFFakJDLGFBRmlCOztBQUFBLHlCQUdBSCxLQUFLLENBQUNDLFFBQU4sQ0FBZSxLQUFmLENBSEE7QUFBQTtBQUFBLE1BRzdCRyxVQUg2QjtBQUFBLE1BR2pCQyxhQUhpQjs7QUFLcEMsc0JBQ0UsdURBQ0Usb0JBQUMsS0FBRCxRQUNHYixZQUFZLENBQUNjLEdBQWIsQ0FBaUIsVUFBQ0MsVUFBRCxFQUFhQyxDQUFiO0FBQUEsd0JBQ2hCLG9CQUFDLE1BQUQ7QUFDRSxNQUFBLEdBQUcsRUFBRUEsQ0FEUDtBQUVFLE1BQUEsS0FBSyxFQUFFO0FBQ0xDLFFBQUFBLGVBQWUsRUFDYlYsS0FBSyxDQUFDTixJQUFOLEtBQWVjLFVBQVUsQ0FBQ2QsSUFBMUIsR0FBaUMsa0JBQWpDLEdBQXNEO0FBRm5ELE9BRlQ7QUFNRSxNQUFBLE9BQU8sRUFBRSxtQkFBTTtBQUNiTSxRQUFBQSxLQUFLLENBQUNXLFNBQU4sQ0FBZ0I7QUFBQSxpQkFBTUgsVUFBVSxDQUFDZCxJQUFqQjtBQUFBLFNBQWhCO0FBQ0Q7QUFSSCxPQVVHYyxVQUFVLENBQUNaLE9BVmQsQ0FEZ0I7QUFBQSxHQUFqQixDQURILGVBZUUsb0JBQUMsTUFBRDtBQUFRLElBQUEsT0FBTyxFQUFFO0FBQUEsYUFBTVEsYUFBYSxDQUFDLElBQUQsQ0FBbkI7QUFBQTtBQUFqQix5QkFmRixlQWdCRSxvQkFBQyxNQUFEO0FBQVEsSUFBQSxPQUFPLEVBQUU7QUFBQSxhQUFNRSxhQUFhLENBQUMsSUFBRCxDQUFuQjtBQUFBO0FBQWpCLHlCQWhCRixDQURGLEVBbUJHSCxVQUFVLGlCQUNULG9CQUFDLHdCQUFEO0FBQ0UsSUFBQSxRQUFRLEVBQUUsa0JBQUNTLE9BQUQsRUFBYTtBQUNyQlosTUFBQUEsS0FBSyxDQUFDYSxRQUFOLENBQWVELE9BQWY7QUFDQVIsTUFBQUEsYUFBYSxDQUFDLEtBQUQsQ0FBYjtBQUNELEtBSkg7QUFLRSxJQUFBLE9BQU8sRUFBRTtBQUFBLGFBQU1BLGFBQWEsQ0FBQyxLQUFELENBQW5CO0FBQUE7QUFMWCxJQXBCSixFQTRCR0MsVUFBVSxpQkFBSSxvQkFBQyx3QkFBRDtBQUFhLElBQUEsUUFBUSxFQUFFTCxLQUFLLENBQUNjLFFBQTdCO0FBQXVDLElBQUEsT0FBTyxFQUFFO0FBQUEsYUFBTVIsYUFBYSxDQUFDLEtBQUQsQ0FBbkI7QUFBQTtBQUFoRCxJQTVCakIsQ0FERjtBQWdDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFZpZXdNb2RlLCBEcmF3UG9pbnRNb2RlLCBEcmF3UG9seWdvbk1vZGUgfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgeyBJbXBvcnRNb2RhbCB9IGZyb20gJy4vaW1wb3J0LW1vZGFsJztcbmltcG9ydCB7IEV4cG9ydE1vZGFsIH0gZnJvbSAnLi9leHBvcnQtbW9kYWwnO1xuXG5jb25zdCBUb29scyA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgdG9wOiAxMHB4O1xuICByaWdodDogMTBweDtcbmA7XG5cbmNvbnN0IEJ1dHRvbiA9IHN0eWxlZC5zcGFuYFxuICBjb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDkwLCA5OCwgOTQpO1xuICBmb250LXNpemU6IDFlbTtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCAnSGVsdmV0aWNhIE5ldWUnLCBBcmlhbCxcbiAgICAnTm90byBTYW5zJywgc2Fucy1zZXJpZiwgJ0FwcGxlIENvbG9yIEVtb2ppJywgJ1NlZ29lIFVJIEVtb2ppJywgJ1NlZ29lIFVJIFN5bWJvbCcsXG4gICAgJ05vdG8gQ29sb3IgRW1vamknO1xuICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogMC4yNWVtO1xuICBtYXJnaW46IDAuMDVlbTtcbiAgcGFkZGluZzogMC4xZW0gMC4yZW07XG5gO1xuXG5leHBvcnQgdHlwZSBQcm9wcyA9IHtcbiAgbW9kZTogYW55O1xuICBmZWF0dXJlczogYW55O1xuICBvblNldE1vZGU6IChhcmcwOiBhbnkpID0+IHVua25vd247XG4gIG9uSW1wb3J0OiAoYXJnMDogYW55KSA9PiB1bmtub3duO1xufTtcblxuY29uc3QgTU9ERV9CVVRUT05TID0gW1xuICAvLyBUT0RPOiBjaGFuZ2UgdGhlc2UgdG8gaWNvbnNcbiAgeyBtb2RlOiBWaWV3TW9kZSwgY29udGVudDogJ1ZpZXcnIH0sXG4gIHsgbW9kZTogRHJhd1BvaW50TW9kZSwgY29udGVudDogJ0RyYXcgUG9pbnQnIH0sXG4gIHsgbW9kZTogRHJhd1BvbHlnb25Nb2RlLCBjb250ZW50OiAnRHJhdyBQb2x5Z29uJyB9LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFRvb2xib3gocHJvcHM6IFByb3BzKSB7XG4gIC8vIEluaXRpYWxpemUgdG8gemVybyBpbmRleCBvbiBsb2FkIGFzIG5vdGhpbmcgaXMgYWN0aXZlLlxuICBjb25zdCBbc2hvd0ltcG9ydCwgc2V0U2hvd0ltcG9ydF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93RXhwb3J0LCBzZXRTaG93RXhwb3J0XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8VG9vbHM+XG4gICAgICAgIHtNT0RFX0JVVFRPTlMubWFwKChtb2RlQnV0dG9uLCBpKSA9PiAoXG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOlxuICAgICAgICAgICAgICAgIHByb3BzLm1vZGUgPT09IG1vZGVCdXR0b24ubW9kZSA/ICdyZ2IoMCwgMTA1LCAyMTcpJyA6ICdyZ2IoOTAsIDk4LCA5NCknLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgcHJvcHMub25TZXRNb2RlKCgpID0+IG1vZGVCdXR0b24ubW9kZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHttb2RlQnV0dG9uLmNvbnRlbnR9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICkpfVxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldFNob3dJbXBvcnQodHJ1ZSl9PiBJbXBvcnQgR2VvbWV0cnkgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17KCkgPT4gc2V0U2hvd0V4cG9ydCh0cnVlKX0+IEV4cG9ydCBHZW9tZXRyeSA8L0J1dHRvbj5cbiAgICAgIDwvVG9vbHM+XG4gICAgICB7c2hvd0ltcG9ydCAmJiAoXG4gICAgICAgIDxJbXBvcnRNb2RhbFxuICAgICAgICAgIG9uSW1wb3J0PXsoZ2VvanNvbikgPT4ge1xuICAgICAgICAgICAgcHJvcHMub25JbXBvcnQoZ2VvanNvbik7XG4gICAgICAgICAgICBzZXRTaG93SW1wb3J0KGZhbHNlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFNob3dJbXBvcnQoZmFsc2UpfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtzaG93RXhwb3J0ICYmIDxFeHBvcnRNb2RhbCBmZWF0dXJlcz17cHJvcHMuZmVhdHVyZXN9IG9uQ2xvc2U9eygpID0+IHNldFNob3dFeHBvcnQoZmFsc2UpfSAvPn1cbiAgICA8Lz5cbiAgKTtcbn1cbiJdfQ==