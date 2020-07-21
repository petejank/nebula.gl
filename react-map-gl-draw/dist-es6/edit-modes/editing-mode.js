"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _editModes = require("@nebula.gl/edit-modes");

var _constants = require("../constants");

var _baseMode = _interopRequireDefault(require("./base-mode"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EditingMode = /*#__PURE__*/function (_BaseMode) {
  _inherits(EditingMode, _BaseMode);

  var _super = _createSuper(EditingMode);

  function EditingMode() {
    var _this;

    _classCallCheck(this, EditingMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (event, props) {
      var picked = event.picks && event.picks[0];
      var selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0]; // @ts-ignore

      if (!picked || !picked.object || picked.featureIndex !== selectedFeatureIndex) {
        return;
      } // @ts-ignore


      var objectType = picked.type,
          featureIndex = picked.featureIndex,
          index = picked.index;

      var feature = _this.getSelectedFeature(props, featureIndex);

      if (feature && (feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON || feature.geometry.type === _constants.GEOJSON_TYPE.LINE_STRING) && objectType === _constants.ELEMENT_TYPE.SEGMENT) {
        var coordinates = (0, _utils.getFeatureCoordinates)(feature);

        if (!coordinates) {
          return;
        } // @ts-ignore


        var insertIndex = (index + 1) % coordinates.length;
        var positionIndexes = feature.geometry.type === _constants.SHAPE.POLYGON ? [0, insertIndex] : [insertIndex];

        var insertMapCoords = _this._getPointOnSegment(feature, picked, event.mapCoords);

        var updatedData = new _editModes.ImmutableFeatureCollection(props.data) // @ts-ignore
        .addPosition(featureIndex, positionIndexes, insertMapCoords).getObject();
        props.onEdit({
          editType: _constants.EDIT_TYPE.ADD_POSITION,
          updatedData: updatedData,
          editContext: [{
            featureIndex: featureIndex,
            editHandleIndex: insertIndex,
            // @ts-ignore
            screenCoords: props.viewport && props.viewport.project(insertMapCoords),
            mapCoords: insertMapCoords
          }]
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_handleDragging", function (event, props) {
      var onEdit = props.onEdit; // @ts-ignore

      var selectedFeature = _this.getSelectedFeature(props); // nothing clicked
      // @ts-ignore


      var isDragging = event.isDragging,
          pointerDownPicks = event.pointerDownPicks,
          screenCoords = event.screenCoords;
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clicked = pointerDownPicks && pointerDownPicks[0]; // @ts-ignore

      if (!clicked || !clicked.object || !(0, _utils.isNumeric)(clicked.featureIndex)) {
        return;
      } // @ts-ignore


      var objectType = clicked.type,
          editHandleIndex = clicked.index; // not dragging

      var updatedData = null;
      var editType = isDragging ? _constants.EDIT_TYPE.MOVE_POSITION : _constants.EDIT_TYPE.FINISH_MOVE_POSITION;

      switch (objectType) {
        case _constants.ELEMENT_TYPE.FEATURE:
        case _constants.ELEMENT_TYPE.FILL:
        case _constants.ELEMENT_TYPE.SEGMENT:
          if (!props.featuresDraggable) {
            break;
          } // dragging feature


          var dx = screenCoords[0] - lastPointerMoveEvent.screenCoords[0];
          var dy = screenCoords[1] - lastPointerMoveEvent.screenCoords[1];
          updatedData = _this._updateFeature(props, 'feature', {
            dx: dx,
            dy: dy
          });
          onEdit({
            editType: editType,
            updatedData: updatedData,
            editContext: null
          });
          break;

        case _constants.ELEMENT_TYPE.EDIT_HANDLE:
          // dragging editHandle
          // dragging rectangle or other shapes
          var updateType = selectedFeature.properties.shape === _constants.SHAPE.RECTANGLE ? 'rectangle' : 'editHandle';
          updatedData = _this._updateFeature(props, updateType, {
            editHandleIndex: editHandleIndex,
            mapCoords: event.mapCoords
          });
          onEdit({
            editType: editType,
            updatedData: updatedData,
            editContext: null
          });
          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handlePointerMove", function (event, props) {
      // no selected feature
      // @ts-ignore
      var selectedFeature = _this.getSelectedFeature(props);

      if (!selectedFeature) {
        return;
      } // @ts-ignore


      if (!event.isDragging) {
        return;
      }

      _this._handleDragging(event, props);
    });

    _defineProperty(_assertThisInitialized(_this), "_updateFeature", function (props, type) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var data = props.data,
          selectedIndexes = props.selectedIndexes,
          viewport = props.viewport;
      var featureIndex = selectedIndexes && selectedIndexes[0];

      var feature = _this.getSelectedFeature(props, featureIndex);

      var geometry = null;
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      }

      var newCoordinates = _toConsumableArray(coordinates);

      switch (type) {
        case 'editHandle':
          var positionIndexes = feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON ? [0, options.editHandleIndex] : [options.editHandleIndex];
          return new _editModes.ImmutableFeatureCollection(data).replacePosition(featureIndex, positionIndexes, options.mapCoords).getObject();

        case 'feature':
          var dx = options.dx,
              dy = options.dy; // @ts-ignore

          newCoordinates = newCoordinates.map(function (mapCoords) {
            // @ts-ignore
            var pixels = viewport && viewport.project(mapCoords);

            if (pixels) {
              pixels[0] += dx;
              pixels[1] += dy;
              return viewport && viewport.unproject(pixels);
            }

            return null;
          }).filter(Boolean);
          geometry = {
            type: feature.geometry.type,
            coordinates: feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON ? [newCoordinates] : feature.geometry.type === _constants.GEOJSON_TYPE.POINT ? newCoordinates[0] : newCoordinates
          };
          return new _editModes.ImmutableFeatureCollection(data).replaceGeometry(featureIndex, geometry).getObject();

        case 'rectangle':
          // moved editHandleIndex and destination mapCoords
          newCoordinates = (0, _utils.updateRectanglePosition)( // @ts-ignore
          feature, options.editHandleIndex, options.mapCoords);
          geometry = {
            type: _constants.GEOJSON_TYPE.POLYGON,
            coordinates: newCoordinates
          };
          return new _editModes.ImmutableFeatureCollection(data).replaceGeometry(featureIndex, geometry).getObject();

        default:
          return data && new _editModes.ImmutableFeatureCollection(data).getObject();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_getCursorEditHandle", function (event, feature) {
      event = event || {}; // @ts-ignore

      var _event = event,
          isDragging = _event.isDragging,
          picks = _event.picks; // if not pick segment

      var picked = picks && picks[0]; // @ts-ignore

      if (!picked || !(0, _utils.isNumeric)(picked.featureIndex) || picked.type !== _constants.ELEMENT_TYPE.SEGMENT) {
        return null;
      } // if dragging or feature is neither polygon nor line string


      if (isDragging || feature.geometry.type !== _constants.GEOJSON_TYPE.POLYGON && feature.geometry.type !== _constants.GEOJSON_TYPE.LINE_STRING) {
        return null;
      }

      var insertMapCoords = _this._getPointOnSegment(feature, picked, event.mapCoords);

      if (!insertMapCoords) {
        return null;
      }

      return {
        type: 'Feature',
        properties: {
          guideType: _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE,
          shape: feature.properties.shape,
          positionIndexes: [-1],
          editHandleType: 'intermediate'
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.POINT,
          coordinates: insertMapCoords
        }
      };
    });

    _defineProperty(_assertThisInitialized(_this), "getGuides", function (props) {
      // @ts-ignore
      var selectedFeature = _this.getSelectedFeature(props);

      var selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];

      if (!selectedFeature || selectedFeature.geometry.type === _constants.GEOJSON_TYPE.POINT) {
        return null;
      }

      var event = props.lastPointerMoveEvent; // feature editHandles

      var editHandles = _this.getEditHandlesFromFeature(selectedFeature, selectedFeatureIndex) || []; // cursor editHandle

      var cursorEditHandle = _this._getCursorEditHandle(event, selectedFeature);

      if (cursorEditHandle) {
        // @ts-ignore
        editHandles.push(cursorEditHandle);
      }

      return {
        type: 'FeatureCollection',
        features: editHandles.length ? editHandles : null
      };
    });

    return _this;
  }

  _createClass(EditingMode, [{
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      // replace point
      var picked = event.picks && event.picks[0]; // @ts-ignore

      if (!picked || !picked.Object || !(0, _utils.isNumeric)(picked.featureIndex)) {
        return;
      }

      var pickedObject = picked.object;

      switch (pickedObject.type) {
        case _constants.ELEMENT_TYPE.FEATURE:
        case _constants.ELEMENT_TYPE.FILL:
        case _constants.ELEMENT_TYPE.EDIT_HANDLE:
          this._handleDragging(event, props);

          break;

        default:
      }
    }
  }, {
    key: "_getPointOnSegment",
    value: function _getPointOnSegment(feature, picked, pickedMapCoords) {
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      }

      var srcVertexIndex = picked.index;
      var targetVertexIndex = picked.index + 1;
      return (0, _utils.findClosestPointOnLineSegment)( // @ts-ignore
      coordinates[srcVertexIndex], coordinates[targetVertexIndex], pickedMapCoords);
    }
  }]);

  return EditingMode;
}(_baseMode["default"]);

exports["default"] = EditingMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2VkaXRpbmctbW9kZS50cyJdLCJuYW1lcyI6WyJFZGl0aW5nTW9kZSIsImV2ZW50IiwicHJvcHMiLCJwaWNrZWQiLCJwaWNrcyIsInNlbGVjdGVkRmVhdHVyZUluZGV4Iiwic2VsZWN0ZWRJbmRleGVzIiwib2JqZWN0IiwiZmVhdHVyZUluZGV4Iiwib2JqZWN0VHlwZSIsInR5cGUiLCJpbmRleCIsImZlYXR1cmUiLCJnZXRTZWxlY3RlZEZlYXR1cmUiLCJnZW9tZXRyeSIsIkdFT0pTT05fVFlQRSIsIlBPTFlHT04iLCJMSU5FX1NUUklORyIsIkVMRU1FTlRfVFlQRSIsIlNFR01FTlQiLCJjb29yZGluYXRlcyIsImluc2VydEluZGV4IiwibGVuZ3RoIiwicG9zaXRpb25JbmRleGVzIiwiU0hBUEUiLCJpbnNlcnRNYXBDb29yZHMiLCJfZ2V0UG9pbnRPblNlZ21lbnQiLCJtYXBDb29yZHMiLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YSIsImFkZFBvc2l0aW9uIiwiZ2V0T2JqZWN0Iiwib25FZGl0IiwiZWRpdFR5cGUiLCJFRElUX1RZUEUiLCJBRERfUE9TSVRJT04iLCJlZGl0Q29udGV4dCIsImVkaXRIYW5kbGVJbmRleCIsInNjcmVlbkNvb3JkcyIsInZpZXdwb3J0IiwicHJvamVjdCIsInNlbGVjdGVkRmVhdHVyZSIsImlzRHJhZ2dpbmciLCJwb2ludGVyRG93blBpY2tzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJjbGlja2VkIiwiTU9WRV9QT1NJVElPTiIsIkZJTklTSF9NT1ZFX1BPU0lUSU9OIiwiRkVBVFVSRSIsIkZJTEwiLCJmZWF0dXJlc0RyYWdnYWJsZSIsImR4IiwiZHkiLCJfdXBkYXRlRmVhdHVyZSIsIkVESVRfSEFORExFIiwidXBkYXRlVHlwZSIsInByb3BlcnRpZXMiLCJzaGFwZSIsIlJFQ1RBTkdMRSIsIl9oYW5kbGVEcmFnZ2luZyIsIm9wdGlvbnMiLCJuZXdDb29yZGluYXRlcyIsInJlcGxhY2VQb3NpdGlvbiIsIm1hcCIsInBpeGVscyIsInVucHJvamVjdCIsImZpbHRlciIsIkJvb2xlYW4iLCJQT0lOVCIsInJlcGxhY2VHZW9tZXRyeSIsImd1aWRlVHlwZSIsIkdVSURFX1RZUEUiLCJDVVJTT1JfRURJVF9IQU5ETEUiLCJlZGl0SGFuZGxlVHlwZSIsImVkaXRIYW5kbGVzIiwiZ2V0RWRpdEhhbmRsZXNGcm9tRmVhdHVyZSIsImN1cnNvckVkaXRIYW5kbGUiLCJfZ2V0Q3Vyc29yRWRpdEhhbmRsZSIsInB1c2giLCJmZWF0dXJlcyIsIk9iamVjdCIsInBpY2tlZE9iamVjdCIsInBpY2tlZE1hcENvb3JkcyIsInNyY1ZlcnRleEluZGV4IiwidGFyZ2V0VmVydGV4SW5kZXgiLCJCYXNlTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQVdBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBT3FCQSxXOzs7Ozs7Ozs7Ozs7Ozs7O2tFQUNMLFVBQUNDLEtBQUQsRUFBb0JDLEtBQXBCLEVBQTREO0FBQ3hFLFVBQU1DLE1BQU0sR0FBR0YsS0FBSyxDQUFDRyxLQUFOLElBQWVILEtBQUssQ0FBQ0csS0FBTixDQUFZLENBQVosQ0FBOUI7QUFDQSxVQUFNQyxvQkFBb0IsR0FBR0gsS0FBSyxDQUFDSSxlQUFOLElBQXlCSixLQUFLLENBQUNJLGVBQU4sQ0FBc0IsQ0FBdEIsQ0FBdEQsQ0FGd0UsQ0FHeEU7O0FBQ0EsVUFBSSxDQUFDSCxNQUFELElBQVcsQ0FBQ0EsTUFBTSxDQUFDSSxNQUFuQixJQUE2QkosTUFBTSxDQUFDSyxZQUFQLEtBQXdCSCxvQkFBekQsRUFBK0U7QUFDN0U7QUFDRCxPQU51RSxDQVF4RTs7O0FBUndFLFVBUzFESSxVQVQwRCxHQVN0Qk4sTUFUc0IsQ0FTaEVPLElBVGdFO0FBQUEsVUFTOUNGLFlBVDhDLEdBU3RCTCxNQVRzQixDQVM5Q0ssWUFUOEM7QUFBQSxVQVNoQ0csS0FUZ0MsR0FT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Qyx3QkFBYXFDLFdBQWxCO0FBQ0UsZUFBS0ssZUFBTCxDQUFxQjNELEtBQXJCLEVBQTRCQyxLQUE1Qjs7QUFFQTs7QUFDRjtBQVBGO0FBU0Q7Ozt1Q0E4SmtCVSxPLEVBQWtCVCxNLEVBQWFnRixlLEVBQTJCO0FBQzNFLFVBQU0vRCxXQUFXLEdBQUcsa0NBQXNCUixPQUF0QixDQUFwQjs7QUFDQSxVQUFJLENBQUNRLFdBQUwsRUFBa0I7QUFDaEIsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBTWdFLGNBQWMsR0FBR2pGLE1BQU0sQ0FBQ1EsS0FBOUI7QUFDQSxVQUFNMEUsaUJBQWlCLEdBQUdsRixNQUFNLENBQUNRLEtBQVAsR0FBZSxDQUF6QztBQUNBLGFBQU8sMkNBQ0w7QUFDQVMsTUFBQUEsV0FBVyxDQUFDZ0UsY0FBRCxDQUZOLEVBR0xoRSxXQUFXLENBQUNpRSxpQkFBRCxDQUhOLEVBSUxGLGVBSkssQ0FBUDtBQU1EOzs7O0VBaFBzQ0csb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7XG4gIEZlYXR1cmUsXG4gIEZlYXR1cmVDb2xsZWN0aW9uLFxuICBDbGlja0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgUG9zaXRpb24sXG59IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBNb2RlUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7IFNIQVBFLCBFRElUX1RZUEUsIEVMRU1FTlRfVFlQRSwgR0VPSlNPTl9UWVBFLCBHVUlERV9UWVBFIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBCYXNlTW9kZSBmcm9tICcuL2Jhc2UtbW9kZSc7XG5pbXBvcnQge1xuICBmaW5kQ2xvc2VzdFBvaW50T25MaW5lU2VnbWVudCxcbiAgZ2V0RmVhdHVyZUNvb3JkaW5hdGVzLFxuICBpc051bWVyaWMsXG4gIHVwZGF0ZVJlY3RhbmdsZVBvc2l0aW9uLFxufSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdGluZ01vZGUgZXh0ZW5kcyBCYXNlTW9kZSB7XG4gIGhhbmRsZUNsaWNrID0gKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4ge1xuICAgIGNvbnN0IHBpY2tlZCA9IGV2ZW50LnBpY2tzICYmIGV2ZW50LnBpY2tzWzBdO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzICYmIHByb3BzLnNlbGVjdGVkSW5kZXhlc1swXTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKCFwaWNrZWQgfHwgIXBpY2tlZC5vYmplY3QgfHwgcGlja2VkLmZlYXR1cmVJbmRleCAhPT0gc2VsZWN0ZWRGZWF0dXJlSW5kZXgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgeyB0eXBlOiBvYmplY3RUeXBlLCBmZWF0dXJlSW5kZXgsIGluZGV4IH0gPSBwaWNrZWQ7XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzLCBmZWF0dXJlSW5kZXgpO1xuXG4gICAgaWYgKFxuICAgICAgZmVhdHVyZSAmJlxuICAgICAgKGZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gR0VPSlNPTl9UWVBFLlBPTFlHT04gfHxcbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBHRU9KU09OX1RZUEUuTElORV9TVFJJTkcpICYmXG4gICAgICBvYmplY3RUeXBlID09PSBFTEVNRU5UX1RZUEUuU0VHTUVOVFxuICAgICkge1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IGluc2VydEluZGV4ID0gKGluZGV4ICsgMSkgJSBjb29yZGluYXRlcy5sZW5ndGg7XG4gICAgICBjb25zdCBwb3NpdGlvbkluZGV4ZXMgPVxuICAgICAgICBmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IFNIQVBFLlBPTFlHT04gPyBbMCwgaW5zZXJ0SW5kZXhdIDogW2luc2VydEluZGV4XTtcbiAgICAgIGNvbnN0IGluc2VydE1hcENvb3JkcyA9IHRoaXMuX2dldFBvaW50T25TZWdtZW50KGZlYXR1cmUsIHBpY2tlZCwgZXZlbnQubWFwQ29vcmRzKTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAuYWRkUG9zaXRpb24oZmVhdHVyZUluZGV4LCBwb3NpdGlvbkluZGV4ZXMsIGluc2VydE1hcENvb3JkcylcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBwcm9wcy5vbkVkaXQoe1xuICAgICAgICBlZGl0VHlwZTogRURJVF9UWVBFLkFERF9QT1NJVElPTixcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRDb250ZXh0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgZWRpdEhhbmRsZUluZGV4OiBpbnNlcnRJbmRleCxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHNjcmVlbkNvb3JkczogcHJvcHMudmlld3BvcnQgJiYgcHJvcHMudmlld3BvcnQucHJvamVjdChpbnNlcnRNYXBDb29yZHMpLFxuICAgICAgICAgICAgbWFwQ29vcmRzOiBpbnNlcnRNYXBDb29yZHMsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIC8vIHJlcGxhY2UgcG9pbnRcbiAgICBjb25zdCBwaWNrZWQgPSBldmVudC5waWNrcyAmJiBldmVudC5waWNrc1swXTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoIXBpY2tlZCB8fCAhcGlja2VkLk9iamVjdCB8fCAhaXNOdW1lcmljKHBpY2tlZC5mZWF0dXJlSW5kZXgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGlja2VkT2JqZWN0ID0gcGlja2VkLm9iamVjdDtcbiAgICBzd2l0Y2ggKHBpY2tlZE9iamVjdC50eXBlKSB7XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5GRUFUVVJFOlxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRklMTDpcbiAgICAgIGNhc2UgRUxFTUVOVF9UWVBFLkVESVRfSEFORExFOlxuICAgICAgICB0aGlzLl9oYW5kbGVEcmFnZ2luZyhldmVudCwgcHJvcHMpO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlRHJhZ2dpbmcgPSAoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQgfCBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApID0+IHtcbiAgICBjb25zdCB7IG9uRWRpdCB9ID0gcHJvcHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICAvLyBub3RoaW5nIGNsaWNrZWRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgeyBpc0RyYWdnaW5nLCBwb2ludGVyRG93blBpY2tzLCBzY3JlZW5Db29yZHMgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgfSA9IHByb3BzO1xuXG4gICAgY29uc3QgY2xpY2tlZCA9IHBvaW50ZXJEb3duUGlja3MgJiYgcG9pbnRlckRvd25QaWNrc1swXTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKCFjbGlja2VkIHx8ICFjbGlja2VkLm9iamVjdCB8fCAhaXNOdW1lcmljKGNsaWNrZWQuZmVhdHVyZUluZGV4KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB7IHR5cGU6IG9iamVjdFR5cGUsIGluZGV4OiBlZGl0SGFuZGxlSW5kZXggfSA9IGNsaWNrZWQ7XG5cbiAgICAvLyBub3QgZHJhZ2dpbmdcbiAgICBsZXQgdXBkYXRlZERhdGEgPSBudWxsO1xuICAgIGNvbnN0IGVkaXRUeXBlID0gaXNEcmFnZ2luZyA/IEVESVRfVFlQRS5NT1ZFX1BPU0lUSU9OIDogRURJVF9UWVBFLkZJTklTSF9NT1ZFX1BPU0lUSU9OO1xuXG4gICAgc3dpdGNoIChvYmplY3RUeXBlKSB7XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5GRUFUVVJFOlxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRklMTDpcbiAgICAgIGNhc2UgRUxFTUVOVF9UWVBFLlNFR01FTlQ6XG4gICAgICAgIGlmICghcHJvcHMuZmVhdHVyZXNEcmFnZ2FibGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSAvLyBkcmFnZ2luZyBmZWF0dXJlXG5cbiAgICAgICAgY29uc3QgZHggPSBzY3JlZW5Db29yZHNbMF0gLSBsYXN0UG9pbnRlck1vdmVFdmVudC5zY3JlZW5Db29yZHNbMF07XG4gICAgICAgIGNvbnN0IGR5ID0gc2NyZWVuQ29vcmRzWzFdIC0gbGFzdFBvaW50ZXJNb3ZlRXZlbnQuc2NyZWVuQ29vcmRzWzFdO1xuICAgICAgICB1cGRhdGVkRGF0YSA9IHRoaXMuX3VwZGF0ZUZlYXR1cmUocHJvcHMsICdmZWF0dXJlJywgeyBkeCwgZHkgfSk7XG4gICAgICAgIG9uRWRpdCh7XG4gICAgICAgICAgZWRpdFR5cGUsXG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEU6XG4gICAgICAgIC8vIGRyYWdnaW5nIGVkaXRIYW5kbGVcbiAgICAgICAgLy8gZHJhZ2dpbmcgcmVjdGFuZ2xlIG9yIG90aGVyIHNoYXBlc1xuICAgICAgICBjb25zdCB1cGRhdGVUeXBlID1cbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmUucHJvcGVydGllcy5zaGFwZSA9PT0gU0hBUEUuUkVDVEFOR0xFID8gJ3JlY3RhbmdsZScgOiAnZWRpdEhhbmRsZSc7XG4gICAgICAgIHVwZGF0ZWREYXRhID0gdGhpcy5fdXBkYXRlRmVhdHVyZShwcm9wcywgdXBkYXRlVHlwZSwge1xuICAgICAgICAgIGVkaXRIYW5kbGVJbmRleCxcbiAgICAgICAgICBtYXBDb29yZHM6IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgfSk7XG4gICAgICAgIG9uRWRpdCh7XG4gICAgICAgICAgZWRpdFR5cGUsXG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH07XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUgPSAoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgLy8gbm8gc2VsZWN0ZWQgZmVhdHVyZVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcyk7XG4gICAgaWYgKCFzZWxlY3RlZEZlYXR1cmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICghZXZlbnQuaXNEcmFnZ2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2hhbmRsZURyYWdnaW5nKGV2ZW50LCBwcm9wcyk7XG4gIH07XG5cbiAgLy8gVE9ETyAtIHJlZmFjdG9yXG4gIF91cGRhdGVGZWF0dXJlID0gKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+LCB0eXBlOiBzdHJpbmcsIG9wdGlvbnM6IGFueSA9IHt9KSA9PiB7XG4gICAgY29uc3QgeyBkYXRhLCBzZWxlY3RlZEluZGV4ZXMsIHZpZXdwb3J0IH0gPSBwcm9wcztcblxuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHNlbGVjdGVkSW5kZXhlcyAmJiBzZWxlY3RlZEluZGV4ZXNbMF07XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzLCBmZWF0dXJlSW5kZXgpO1xuXG4gICAgbGV0IGdlb21ldHJ5ID0gbnVsbDtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgbmV3Q29vcmRpbmF0ZXMgPSBbLi4uY29vcmRpbmF0ZXNdO1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdlZGl0SGFuZGxlJzpcbiAgICAgICAgY29uc3QgcG9zaXRpb25JbmRleGVzID1cbiAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IEdFT0pTT05fVFlQRS5QT0xZR09OXG4gICAgICAgICAgICA/IFswLCBvcHRpb25zLmVkaXRIYW5kbGVJbmRleF1cbiAgICAgICAgICAgIDogW29wdGlvbnMuZWRpdEhhbmRsZUluZGV4XTtcblxuICAgICAgICByZXR1cm4gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKGRhdGEpXG4gICAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgb3B0aW9ucy5tYXBDb29yZHMpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBjYXNlICdmZWF0dXJlJzpcbiAgICAgICAgY29uc3QgeyBkeCwgZHkgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBuZXdDb29yZGluYXRlcyA9IG5ld0Nvb3JkaW5hdGVzXG4gICAgICAgICAgLm1hcCgobWFwQ29vcmRzKSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25zdCBwaXhlbHMgPSB2aWV3cG9ydCAmJiB2aWV3cG9ydC5wcm9qZWN0KG1hcENvb3Jkcyk7XG4gICAgICAgICAgICBpZiAocGl4ZWxzKSB7XG4gICAgICAgICAgICAgIHBpeGVsc1swXSArPSBkeDtcbiAgICAgICAgICAgICAgcGl4ZWxzWzFdICs9IGR5O1xuICAgICAgICAgICAgICByZXR1cm4gdmlld3BvcnQgJiYgdmlld3BvcnQudW5wcm9qZWN0KHBpeGVscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICAgIHR5cGU6IGZlYXR1cmUuZ2VvbWV0cnkudHlwZSxcbiAgICAgICAgICBjb29yZGluYXRlczpcbiAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gR0VPSlNPTl9UWVBFLlBPTFlHT05cbiAgICAgICAgICAgICAgPyBbbmV3Q29vcmRpbmF0ZXNdXG4gICAgICAgICAgICAgIDogZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBHRU9KU09OX1RZUEUuUE9JTlRcbiAgICAgICAgICAgICAgPyBuZXdDb29yZGluYXRlc1swXVxuICAgICAgICAgICAgICA6IG5ld0Nvb3JkaW5hdGVzLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oZGF0YSlcbiAgICAgICAgICAucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwgZ2VvbWV0cnkpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBjYXNlICdyZWN0YW5nbGUnOlxuICAgICAgICAvLyBtb3ZlZCBlZGl0SGFuZGxlSW5kZXggYW5kIGRlc3RpbmF0aW9uIG1hcENvb3Jkc1xuICAgICAgICBuZXdDb29yZGluYXRlcyA9IHVwZGF0ZVJlY3RhbmdsZVBvc2l0aW9uKFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBmZWF0dXJlLFxuICAgICAgICAgIG9wdGlvbnMuZWRpdEhhbmRsZUluZGV4LFxuICAgICAgICAgIG9wdGlvbnMubWFwQ29vcmRzXG4gICAgICAgICk7XG4gICAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5QT0xZR09OLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBuZXdDb29yZGluYXRlcyxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKGRhdGEpXG4gICAgICAgICAgLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIGdlb21ldHJ5KVxuICAgICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRhdGEgJiYgbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKGRhdGEpLmdldE9iamVjdCgpO1xuICAgIH1cbiAgfTtcblxuICBfZ2V0UG9pbnRPblNlZ21lbnQoZmVhdHVyZTogRmVhdHVyZSwgcGlja2VkOiBhbnksIHBpY2tlZE1hcENvb3JkczogUG9zaXRpb24pIHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc3JjVmVydGV4SW5kZXggPSBwaWNrZWQuaW5kZXg7XG4gICAgY29uc3QgdGFyZ2V0VmVydGV4SW5kZXggPSBwaWNrZWQuaW5kZXggKyAxO1xuICAgIHJldHVybiBmaW5kQ2xvc2VzdFBvaW50T25MaW5lU2VnbWVudChcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvb3JkaW5hdGVzW3NyY1ZlcnRleEluZGV4XSxcbiAgICAgIGNvb3JkaW5hdGVzW3RhcmdldFZlcnRleEluZGV4XSxcbiAgICAgIHBpY2tlZE1hcENvb3Jkc1xuICAgICk7XG4gIH1cblxuICBfZ2V0Q3Vyc29yRWRpdEhhbmRsZSA9IChldmVudDogUG9pbnRlck1vdmVFdmVudCwgZmVhdHVyZTogRmVhdHVyZSkgPT4ge1xuICAgIGV2ZW50ID0gZXZlbnQgfHwge30gYXMgYW55XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHsgaXNEcmFnZ2luZywgcGlja3MgfSA9IGV2ZW50O1xuICAgIC8vIGlmIG5vdCBwaWNrIHNlZ21lbnRcbiAgICBjb25zdCBwaWNrZWQgPSBwaWNrcyAmJiBwaWNrc1swXTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKCFwaWNrZWQgfHwgIWlzTnVtZXJpYyhwaWNrZWQuZmVhdHVyZUluZGV4KSB8fCBwaWNrZWQudHlwZSAhPT0gRUxFTUVOVF9UWVBFLlNFR01FTlQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGlmIGRyYWdnaW5nIG9yIGZlYXR1cmUgaXMgbmVpdGhlciBwb2x5Z29uIG5vciBsaW5lIHN0cmluZ1xuICAgIGlmIChcbiAgICAgIGlzRHJhZ2dpbmcgfHxcbiAgICAgIChmZWF0dXJlLmdlb21ldHJ5LnR5cGUgIT09IEdFT0pTT05fVFlQRS5QT0xZR09OICYmXG4gICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkudHlwZSAhPT0gR0VPSlNPTl9UWVBFLkxJTkVfU1RSSU5HKVxuICAgICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaW5zZXJ0TWFwQ29vcmRzID0gdGhpcy5fZ2V0UG9pbnRPblNlZ21lbnQoZmVhdHVyZSwgcGlja2VkLCBldmVudC5tYXBDb29yZHMpO1xuXG4gICAgaWYgKCFpbnNlcnRNYXBDb29yZHMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGd1aWRlVHlwZTogR1VJREVfVFlQRS5DVVJTT1JfRURJVF9IQU5ETEUsXG4gICAgICAgIHNoYXBlOiBmZWF0dXJlLnByb3BlcnRpZXMuc2hhcGUsXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlczogWy0xXSxcbiAgICAgICAgZWRpdEhhbmRsZVR5cGU6ICdpbnRlcm1lZGlhdGUnLFxuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5QT0lOVCxcbiAgICAgICAgY29vcmRpbmF0ZXM6IGluc2VydE1hcENvb3JkcyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfTtcbiAgLy8gQHRzLWlnbm9yZVxuICBnZXRHdWlkZXMgPSAocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzICYmIHByb3BzLnNlbGVjdGVkSW5kZXhlc1swXTtcblxuICAgIGlmICghc2VsZWN0ZWRGZWF0dXJlIHx8IHNlbGVjdGVkRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBHRU9KU09OX1RZUEUuUE9JTlQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID0gcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQ7XG5cbiAgICAvLyBmZWF0dXJlIGVkaXRIYW5kbGVzXG4gICAgY29uc3QgZWRpdEhhbmRsZXMgPSB0aGlzLmdldEVkaXRIYW5kbGVzRnJvbUZlYXR1cmUoc2VsZWN0ZWRGZWF0dXJlLCBzZWxlY3RlZEZlYXR1cmVJbmRleCkgfHwgW107XG5cbiAgICAvLyBjdXJzb3IgZWRpdEhhbmRsZVxuICAgIGNvbnN0IGN1cnNvckVkaXRIYW5kbGUgPSB0aGlzLl9nZXRDdXJzb3JFZGl0SGFuZGxlKGV2ZW50LCBzZWxlY3RlZEZlYXR1cmUpO1xuICAgIGlmIChjdXJzb3JFZGl0SGFuZGxlKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBlZGl0SGFuZGxlcy5wdXNoKGN1cnNvckVkaXRIYW5kbGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IGVkaXRIYW5kbGVzLmxlbmd0aCA/IGVkaXRIYW5kbGVzIDogbnVsbCxcbiAgICB9O1xuICB9O1xufVxuIl19