"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layers = require("@deck.gl/layers");

var _editModes = require("@nebula.gl/edit-modes");

var _editableLayer = _interopRequireDefault(require("./editable-layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
var DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
var DEFAULT_SELECTED_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
var DEFAULT_SELECTED_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
var DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
var DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];
var DEFAULT_EDITING_SNAP_POINT_COLOR = [0x7c, 0x00, 0xc0, 0xff];
var DEFAULT_EDITING_POINT_OUTLINE_COLOR = [0xff, 0xff, 0xff, 0xff];
var DEFAULT_EDITING_EXISTING_POINT_RADIUS = 5;
var DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS = 3;
var DEFAULT_EDITING_SNAP_POINT_RADIUS = 7;
var DEFAULT_EDIT_MODE = _editModes.DrawPolygonMode;

function guideAccessor(accessor) {
  if (!accessor || typeof accessor !== 'function') {
    return accessor;
  }

  return function (guideMaybeWrapped) {
    return accessor(unwrapGuide(guideMaybeWrapped));
  };
} // The object handed to us from deck.gl is different depending on the version of deck.gl used, unwrap as necessary


function unwrapGuide(guideMaybeWrapped) {
  if (guideMaybeWrapped.__source) {
    return guideMaybeWrapped.__source.object;
  } else if (guideMaybeWrapped.sourceFeature) {
    return guideMaybeWrapped.sourceFeature.feature;
  } // It is not wrapped, return as is


  return guideMaybeWrapped;
}

function getEditHandleColor(handle) {
  switch (handle.properties.editHandleType) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_COLOR;

    case 'snap-source':
      return DEFAULT_EDITING_SNAP_POINT_COLOR;

    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR;
  }
}

function getEditHandleOutlineColor(handle) {
  return DEFAULT_EDITING_POINT_OUTLINE_COLOR;
}

function getEditHandleRadius(handle) {
  switch (handle.properties.editHandleType) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_RADIUS;

    case 'snap':
      return DEFAULT_EDITING_SNAP_POINT_RADIUS;

    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS;
  }
}

var defaultProps = {
  mode: _editModes.DrawPolygonMode,
  // Edit and interaction events
  onEdit: function onEdit() {},
  pickable: true,
  pickingRadius: 10,
  pickingDepth: 5,
  fp64: false,
  filled: true,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'pixels',
  lineJointRounded: false,
  lineMiterLimit: 4,
  pointRadiusScale: 1,
  pointRadiusMinPixels: 2,
  pointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  getLineColor: function getLineColor(feature, isSelected, mode) {
    return isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR;
  },
  getFillColor: function getFillColor(feature, isSelected, mode) {
    return isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR;
  },
  getRadius: function getRadius(f) {
    return f && f.properties && f.properties.radius || f && f.properties && f.properties.size || 1;
  },
  getLineWidth: function getLineWidth(f) {
    return f && f.properties && f.properties.lineWidth || 3;
  },
  // Tentative feature rendering
  getTentativeLineColor: function getTentativeLineColor(f) {
    return DEFAULT_SELECTED_LINE_COLOR;
  },
  getTentativeFillColor: function getTentativeFillColor(f) {
    return DEFAULT_SELECTED_FILL_COLOR;
  },
  getTentativeLineWidth: function getTentativeLineWidth(f) {
    return f && f.properties && f.properties.lineWidth || 3;
  },
  editHandleType: 'point',
  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointOutline: true,
  editHandlePointStrokeWidth: 2,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
  getEditHandlePointColor: getEditHandleColor,
  getEditHandlePointOutlineColor: getEditHandleOutlineColor,
  getEditHandlePointRadius: getEditHandleRadius,
  // icon handles
  editHandleIconAtlas: null,
  editHandleIconMapping: null,
  editHandleIconSizeScale: 1,
  getEditHandleIcon: function getEditHandleIcon(handle) {
    return handle.properties.editHandleType;
  },
  getEditHandleIconSize: 10,
  getEditHandleIconColor: getEditHandleColor,
  getEditHandleIconAngle: 0,
  // misc
  billboard: true
}; // Mapping of mode name to mode class (for legacy purposes)

var modeNameMapping = {
  view: _editModes.ViewMode,
  // Alter modes
  modify: _editModes.ModifyMode,
  translate: new _editModes.SnappableMode(new _editModes.TranslateMode()),
  transform: new _editModes.SnappableMode(new _editModes.TransformMode()),
  scale: _editModes.ScaleMode,
  rotate: _editModes.RotateMode,
  duplicate: _editModes.DuplicateMode,
  split: _editModes.SplitPolygonMode,
  extrude: _editModes.ExtrudeMode,
  elevation: _editModes.ElevationMode,
  // Draw modes
  drawPoint: _editModes.DrawPointMode,
  drawLineString: _editModes.DrawLineStringMode,
  drawPolygon: _editModes.DrawPolygonMode,
  drawRectangle: _editModes.DrawRectangleMode,
  drawCircleFromCenter: _editModes.DrawCircleFromCenterMode,
  drawCircleByBoundingBox: _editModes.DrawCircleByDiameterMode,
  drawEllipseByBoundingBox: _editModes.DrawEllipseByBoundingBoxMode,
  drawRectangleUsing3Points: _editModes.DrawRectangleUsingThreePointsMode,
  drawEllipseUsing3Points: _editModes.DrawEllipseUsingThreePointsMode,
  draw90DegreePolygon: _editModes.Draw90DegreePolygonMode,
  drawPolygonByDragging: _editModes.DrawPolygonByDraggingMode
};

// type State = {
//   mode: GeoJsonEditMode,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };
var EditableGeoJsonLayer = /*#__PURE__*/function (_EditableLayer) {
  _inherits(EditableGeoJsonLayer, _EditableLayer);

  var _super = _createSuper(EditableGeoJsonLayer);

  function EditableGeoJsonLayer() {
    _classCallCheck(this, EditableGeoJsonLayer);

    return _super.apply(this, arguments);
  }

  _createClass(EditableGeoJsonLayer, [{
    key: "renderLayers",
    // props: Props;
    // setState: ($Shape<State>) => void;
    value: function renderLayers() {
      var subLayerProps = this.getSubLayerProps({
        id: 'geojson',
        // Proxy most GeoJsonLayer props as-is
        data: this.props.data,
        fp64: this.props.fp64,
        filled: this.props.filled,
        stroked: this.props.stroked,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        pointRadiusScale: this.props.pointRadiusScale,
        pointRadiusMinPixels: this.props.pointRadiusMinPixels,
        pointRadiusMaxPixels: this.props.pointRadiusMaxPixels,
        getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
        getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
        getRadius: this.selectionAwareAccessor(this.props.getRadius),
        getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),
        _subLayerProps: {
          'line-strings': {
            billboard: this.props.billboard
          },
          'polygons-stroke': {
            billboard: this.props.billboard
          }
        },
        updateTriggers: {
          getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
          getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode]
        }
      });
      var layers = [new _layers.GeoJsonLayer(subLayerProps)];
      layers = layers.concat(this.createGuidesLayers(), this.createTooltipsLayers());
      return layers;
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "initializeState", this).call(this);

      this.setState({
        selectedFeatures: [],
        editHandles: []
      });
    } // TODO: is this the best way to properly update state from an outside event handler?

  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(opts) {
      // console.log(
      //   'shouldUpdateState',
      //   opts.changeFlags.propsOrDataChanged,
      //   opts.changeFlags.stateChanged
      // );
      return _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "shouldUpdateState", this).call(this, opts) || opts.changeFlags.stateChanged;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;

      // @ts-ignore
      _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "updateState", this).call(this, {
        props: props,
        changeFlags: changeFlags
      });

      var mode = this.state.mode;

      if (changeFlags.propsOrDataChanged) {
        if (props.mode !== oldProps.mode) {
          if (typeof props.mode === 'string') {
            // Lookup the mode based on its name (for legacy purposes)
            mode = modeNameMapping[props.mode]; // eslint-disable-next-line no-console

            console.warn("Deprecated use of passing `mode` as a string. Pass the mode's class constructor instead.");
          } else {
            mode = props.mode;
          }

          if (typeof mode === 'function') {
            var ModeConstructor = mode;
            mode = new ModeConstructor();
          }

          if (!mode) {
            console.warn("No mode configured for ".concat(String(props.mode))); // eslint-disable-line no-console,no-undef
            // Use default mode

            mode = DEFAULT_EDIT_MODE;
          }

          if (mode !== this.state.mode) {
            this.setState({
              mode: mode,
              cursor: null
            });
          }
        }
      }

      var selectedFeatures = [];

      if (Array.isArray(props.selectedFeatureIndexes)) {
        // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
        selectedFeatures = props.selectedFeatureIndexes.map(function (elem) {
          return props.data.features[elem];
        });
      }

      this.setState({
        selectedFeatures: selectedFeatures
      });
    }
  }, {
    key: "getModeProps",
    value: function getModeProps(props) {
      var _this = this;

      return {
        modeConfig: props.modeConfig,
        data: props.data,
        selectedIndexes: props.selectedFeatureIndexes,
        lastPointerMoveEvent: this.state.lastPointerMoveEvent,
        cursor: this.state.cursor,
        onEdit: function onEdit(editAction) {
          // Force a re-render
          // This supports double-click where we need to ensure that there's a re-render between the two clicks
          // even though the data wasn't changed, just the internal tentative feature.
          _this.setNeedsUpdate();

          props.onEdit(editAction);
        },
        onUpdateCursor: function onUpdateCursor(cursor) {
          _this.setState({
            cursor: cursor
          });
        }
      };
    }
  }, {
    key: "selectionAwareAccessor",
    value: function selectionAwareAccessor(accessor) {
      var _this2 = this;

      if (typeof accessor !== 'function') {
        return accessor;
      }

      return function (feature) {
        return accessor(feature, _this2.isFeatureSelected(feature), _this2.props.mode);
      };
    }
  }, {
    key: "isFeatureSelected",
    value: function isFeatureSelected(feature) {
      if (!this.props.data || !this.props.selectedFeatureIndexes) {
        return false;
      }

      if (!this.props.selectedFeatureIndexes.length) {
        return false;
      }

      var featureIndex = this.props.data.features.indexOf(feature);
      return this.props.selectedFeatureIndexes.includes(featureIndex);
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref2) {
      var info = _ref2.info,
          sourceLayer = _ref2.sourceLayer;

      if (sourceLayer.id.endsWith('guides')) {
        // If user is picking an editing handle, add additional data to the info
        info.isGuide = true;
      }

      return info;
    }
  }, {
    key: "createGuidesLayers",
    value: function createGuidesLayers() {
      var mode = this.getActiveMode();
      var guides = mode.getGuides(this.getModeProps(this.props));

      if (!guides || !guides.features.length) {
        return [];
      }

      var pointLayerProps;

      if (this.props.editHandleType === 'icon') {
        pointLayerProps = {
          type: _layers.IconLayer,
          iconAtlas: this.props.editHandleIconAtlas,
          iconMapping: this.props.editHandleIconMapping,
          sizeScale: this.props.editHandleIconSizeScale,
          getIcon: guideAccessor(this.props.getEditHandleIcon),
          getSize: guideAccessor(this.props.getEditHandleIconSize),
          getColor: guideAccessor(this.props.getEditHandleIconColor),
          getAngle: guideAccessor(this.props.getEditHandleIconAngle)
        };
      } else {
        pointLayerProps = {
          type: _layers.ScatterplotLayer,
          radiusScale: this.props.editHandlePointRadiusScale,
          stroked: this.props.editHandlePointOutline,
          getLineWidth: this.props.editHandlePointStrokeWidth,
          radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
          radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
          getRadius: guideAccessor(this.props.getEditHandlePointRadius),
          getFillColor: guideAccessor(this.props.getEditHandlePointColor),
          getLineColor: guideAccessor(this.props.getEditHandlePointOutlineColor)
        };
      }

      var layer = new _layers.GeoJsonLayer(this.getSubLayerProps({
        id: "guides",
        data: guides,
        fp64: this.props.fp64,
        _subLayerProps: {
          points: pointLayerProps
        },
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        getLineColor: guideAccessor(this.props.getTentativeLineColor),
        getLineWidth: guideAccessor(this.props.getTentativeLineWidth),
        getFillColor: guideAccessor(this.props.getTentativeFillColor)
      }));
      return [layer];
    }
  }, {
    key: "createTooltipsLayers",
    value: function createTooltipsLayers() {
      var mode = this.getActiveMode();
      var tooltips = mode.getTooltips(this.getModeProps(this.props));
      var layer = new _layers.TextLayer(this.getSubLayerProps({
        id: "tooltips",
        data: tooltips
      }));
      return [layer];
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(event) {
      this.getActiveMode().handleClick(event, this.getModeProps(this.props));
    }
  }, {
    key: "onLayerKeyUp",
    value: function onLayerKeyUp(event) {
      this.getActiveMode().handleKeyUp(event, this.getModeProps(this.props));
    }
  }, {
    key: "onStartDragging",
    value: function onStartDragging(event) {
      this.getActiveMode().handleStartDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onDragging",
    value: function onDragging(event) {
      this.getActiveMode().handleDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onStopDragging",
    value: function onStopDragging(event) {
      this.getActiveMode().handleStopDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onPointerMove",
    value: function onPointerMove(event) {
      this.setState({
        lastPointerMoveEvent: event
      });
      this.getActiveMode().handlePointerMove(event, this.getModeProps(this.props));
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref3) {
      var isDragging = _ref3.isDragging;
      var cursor = this.state.cursor;

      if (!cursor) {
        // default cursor
        cursor = isDragging ? 'grabbing' : 'grab';
      }

      return cursor;
    }
  }, {
    key: "getActiveMode",
    value: function getActiveMode() {
      return this.state.mode;
    }
  }]);

  return EditableGeoJsonLayer;
}(_editableLayer["default"]);

exports["default"] = EditableGeoJsonLayer;

_defineProperty(EditableGeoJsonLayer, "layerName", 'EditableGeoJsonLayer');

_defineProperty(EditableGeoJsonLayer, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtZ2VvanNvbi1sYXllci50cyJdLCJuYW1lcyI6WyJERUZBVUxUX0xJTkVfQ09MT1IiLCJERUZBVUxUX0ZJTExfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SIiwiREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfUE9JTlRfT1VUTElORV9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVMiLCJERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVF9NT0RFIiwiRHJhd1BvbHlnb25Nb2RlIiwiZ3VpZGVBY2Nlc3NvciIsImFjY2Vzc29yIiwiZ3VpZGVNYXliZVdyYXBwZWQiLCJ1bndyYXBHdWlkZSIsIl9fc291cmNlIiwib2JqZWN0Iiwic291cmNlRmVhdHVyZSIsImZlYXR1cmUiLCJnZXRFZGl0SGFuZGxlQ29sb3IiLCJoYW5kbGUiLCJwcm9wZXJ0aWVzIiwiZWRpdEhhbmRsZVR5cGUiLCJnZXRFZGl0SGFuZGxlT3V0bGluZUNvbG9yIiwiZ2V0RWRpdEhhbmRsZVJhZGl1cyIsImRlZmF1bHRQcm9wcyIsIm1vZGUiLCJvbkVkaXQiLCJwaWNrYWJsZSIsInBpY2tpbmdSYWRpdXMiLCJwaWNraW5nRGVwdGgiLCJmcDY0IiwiZmlsbGVkIiwic3Ryb2tlZCIsImxpbmVXaWR0aFNjYWxlIiwibGluZVdpZHRoTWluUGl4ZWxzIiwibGluZVdpZHRoTWF4UGl4ZWxzIiwiTnVtYmVyIiwiTUFYX1NBRkVfSU5URUdFUiIsImxpbmVXaWR0aFVuaXRzIiwibGluZUpvaW50Um91bmRlZCIsImxpbmVNaXRlckxpbWl0IiwicG9pbnRSYWRpdXNTY2FsZSIsInBvaW50UmFkaXVzTWluUGl4ZWxzIiwicG9pbnRSYWRpdXNNYXhQaXhlbHMiLCJnZXRMaW5lQ29sb3IiLCJpc1NlbGVjdGVkIiwiZ2V0RmlsbENvbG9yIiwiZ2V0UmFkaXVzIiwiZiIsInJhZGl1cyIsInNpemUiLCJnZXRMaW5lV2lkdGgiLCJsaW5lV2lkdGgiLCJnZXRUZW50YXRpdmVMaW5lQ29sb3IiLCJnZXRUZW50YXRpdmVGaWxsQ29sb3IiLCJnZXRUZW50YXRpdmVMaW5lV2lkdGgiLCJlZGl0SGFuZGxlUG9pbnRSYWRpdXNTY2FsZSIsImVkaXRIYW5kbGVQb2ludE91dGxpbmUiLCJlZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aCIsImVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVscyIsImVkaXRIYW5kbGVQb2ludFJhZGl1c01heFBpeGVscyIsImdldEVkaXRIYW5kbGVQb2ludENvbG9yIiwiZ2V0RWRpdEhhbmRsZVBvaW50T3V0bGluZUNvbG9yIiwiZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzIiwiZWRpdEhhbmRsZUljb25BdGxhcyIsImVkaXRIYW5kbGVJY29uTWFwcGluZyIsImVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlIiwiZ2V0RWRpdEhhbmRsZUljb24iLCJnZXRFZGl0SGFuZGxlSWNvblNpemUiLCJnZXRFZGl0SGFuZGxlSWNvbkNvbG9yIiwiZ2V0RWRpdEhhbmRsZUljb25BbmdsZSIsImJpbGxib2FyZCIsIm1vZGVOYW1lTWFwcGluZyIsInZpZXciLCJWaWV3TW9kZSIsIm1vZGlmeSIsIk1vZGlmeU1vZGUiLCJ0cmFuc2xhdGUiLCJTbmFwcGFibGVNb2RlIiwiVHJhbnNsYXRlTW9kZSIsInRyYW5zZm9ybSIsIlRyYW5zZm9ybU1vZGUiLCJzY2FsZSIsIlNjYWxlTW9kZSIsInJvdGF0ZSIsIlJvdGF0ZU1vZGUiLCJkdXBsaWNhdGUiLCJEdXBsaWNhdGVNb2RlIiwic3BsaXQiLCJTcGxpdFBvbHlnb25Nb2RlIiwiZXh0cnVkZSIsIkV4dHJ1ZGVNb2RlIiwiZWxldmF0aW9uIiwiRWxldmF0aW9uTW9kZSIsImRyYXdQb2ludCIsIkRyYXdQb2ludE1vZGUiLCJkcmF3TGluZVN0cmluZyIsIkRyYXdMaW5lU3RyaW5nTW9kZSIsImRyYXdQb2x5Z29uIiwiZHJhd1JlY3RhbmdsZSIsIkRyYXdSZWN0YW5nbGVNb2RlIiwiZHJhd0NpcmNsZUZyb21DZW50ZXIiLCJEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUiLCJkcmF3Q2lyY2xlQnlCb3VuZGluZ0JveCIsIkRyYXdDaXJjbGVCeURpYW1ldGVyTW9kZSIsImRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveCIsIkRyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUiLCJkcmF3UmVjdGFuZ2xlVXNpbmczUG9pbnRzIiwiRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNNb2RlIiwiZHJhd0VsbGlwc2VVc2luZzNQb2ludHMiLCJEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNNb2RlIiwiZHJhdzkwRGVncmVlUG9seWdvbiIsIkRyYXc5MERlZ3JlZVBvbHlnb25Nb2RlIiwiZHJhd1BvbHlnb25CeURyYWdnaW5nIiwiRHJhd1BvbHlnb25CeURyYWdnaW5nTW9kZSIsIkVkaXRhYmxlR2VvSnNvbkxheWVyIiwic3ViTGF5ZXJQcm9wcyIsImdldFN1YkxheWVyUHJvcHMiLCJpZCIsImRhdGEiLCJwcm9wcyIsInNlbGVjdGlvbkF3YXJlQWNjZXNzb3IiLCJfc3ViTGF5ZXJQcm9wcyIsInVwZGF0ZVRyaWdnZXJzIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImxheWVycyIsIkdlb0pzb25MYXllciIsImNvbmNhdCIsImNyZWF0ZUd1aWRlc0xheWVycyIsImNyZWF0ZVRvb2x0aXBzTGF5ZXJzIiwic2V0U3RhdGUiLCJzZWxlY3RlZEZlYXR1cmVzIiwiZWRpdEhhbmRsZXMiLCJvcHRzIiwiY2hhbmdlRmxhZ3MiLCJzdGF0ZUNoYW5nZWQiLCJvbGRQcm9wcyIsInN0YXRlIiwicHJvcHNPckRhdGFDaGFuZ2VkIiwiY29uc29sZSIsIndhcm4iLCJNb2RlQ29uc3RydWN0b3IiLCJTdHJpbmciLCJjdXJzb3IiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJlbGVtIiwiZmVhdHVyZXMiLCJtb2RlQ29uZmlnIiwic2VsZWN0ZWRJbmRleGVzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJlZGl0QWN0aW9uIiwic2V0TmVlZHNVcGRhdGUiLCJvblVwZGF0ZUN1cnNvciIsImlzRmVhdHVyZVNlbGVjdGVkIiwibGVuZ3RoIiwiZmVhdHVyZUluZGV4IiwiaW5kZXhPZiIsImluY2x1ZGVzIiwiaW5mbyIsInNvdXJjZUxheWVyIiwiZW5kc1dpdGgiLCJpc0d1aWRlIiwiZ2V0QWN0aXZlTW9kZSIsImd1aWRlcyIsImdldEd1aWRlcyIsImdldE1vZGVQcm9wcyIsInBvaW50TGF5ZXJQcm9wcyIsInR5cGUiLCJJY29uTGF5ZXIiLCJpY29uQXRsYXMiLCJpY29uTWFwcGluZyIsInNpemVTY2FsZSIsImdldEljb24iLCJnZXRTaXplIiwiZ2V0Q29sb3IiLCJnZXRBbmdsZSIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJyYWRpdXNTY2FsZSIsInJhZGl1c01pblBpeGVscyIsInJhZGl1c01heFBpeGVscyIsImxheWVyIiwicG9pbnRzIiwidG9vbHRpcHMiLCJnZXRUb29sdGlwcyIsIlRleHRMYXllciIsImV2ZW50IiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVLZXlVcCIsImhhbmRsZVN0YXJ0RHJhZ2dpbmciLCJoYW5kbGVEcmFnZ2luZyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImhhbmRsZVBvaW50ZXJNb3ZlIiwiaXNEcmFnZ2luZyIsIkVkaXRhYmxlTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFFQTs7QUFpQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQUcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdB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SyxFQUFzQjtBQUMvQixXQUFLdkIsYUFBTCxHQUFxQjJCLGNBQXJCLENBQW9DSixLQUFwQyxFQUEyQyxLQUFLcEIsWUFBTCxDQUFrQixLQUFLL0MsS0FBdkIsQ0FBM0M7QUFDRDs7O21DQUVjbUUsSyxFQUEwQjtBQUN2QyxXQUFLdkIsYUFBTCxHQUFxQjRCLGtCQUFyQixDQUF3Q0wsS0FBeEMsRUFBK0MsS0FBS3BCLFlBQUwsQ0FBa0IsS0FBSy9DLEtBQXZCLENBQS9DO0FBQ0Q7OztrQ0FFYW1FLEssRUFBeUI7QUFDckMsV0FBS3pELFFBQUwsQ0FBYztBQUFFcUIsUUFBQUEsb0JBQW9CLEVBQUVvQztBQUF4QixPQUFkO0FBQ0EsV0FBS3ZCLGFBQUwsR0FBcUI2QixpQkFBckIsQ0FBdUNOLEtBQXZDLEVBQThDLEtBQUtwQixZQUFMLENBQWtCLEtBQUsvQyxLQUF2QixDQUE5QztBQUNEOzs7cUNBRWtEO0FBQUEsVUFBdkMwRSxVQUF1QyxTQUF2Q0EsVUFBdUM7QUFBQSxVQUMzQ25ELE1BRDJDLEdBQ2hDLEtBQUtOLEtBRDJCLENBQzNDTSxNQUQyQzs7QUFFakQsVUFBSSxDQUFDQSxNQUFMLEVBQWE7QUFDWDtBQUNBQSxRQUFBQSxNQUFNLEdBQUdtRCxVQUFVLEdBQUcsVUFBSCxHQUFnQixNQUFuQztBQUNEOztBQUNELGFBQU9uRCxNQUFQO0FBQ0Q7OztvQ0FFb0M7QUFDbkMsYUFBTyxLQUFLTixLQUFMLENBQVdoSCxJQUFsQjtBQUNEOzs7O0VBdlIrQzBLLHlCOzs7O2dCQUE3QmhGLG9CLGVBQ0Esc0I7O2dCQURBQSxvQixrQkFFRzNGLFkiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0IHsgR2VvSnNvbkxheWVyLCBTY2F0dGVycGxvdExheWVyLCBJY29uTGF5ZXIsIFRleHRMYXllciB9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5cbmltcG9ydCB7XG4gIFZpZXdNb2RlLFxuICBNb2RpZnlNb2RlLFxuICBUcmFuc2xhdGVNb2RlLFxuICBTY2FsZU1vZGUsXG4gIFJvdGF0ZU1vZGUsXG4gIER1cGxpY2F0ZU1vZGUsXG4gIFNwbGl0UG9seWdvbk1vZGUsXG4gIEV4dHJ1ZGVNb2RlLFxuICBFbGV2YXRpb25Nb2RlLFxuICBEcmF3UG9pbnRNb2RlLFxuICBEcmF3TGluZVN0cmluZ01vZGUsXG4gIERyYXdQb2x5Z29uTW9kZSxcbiAgRHJhd1JlY3RhbmdsZU1vZGUsXG4gIERyYXdDaXJjbGVGcm9tQ2VudGVyTW9kZSxcbiAgRHJhd0NpcmNsZUJ5RGlhbWV0ZXJNb2RlLFxuICBEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hNb2RlLFxuICBEcmF3UmVjdGFuZ2xlVXNpbmdUaHJlZVBvaW50c01vZGUsXG4gIERyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUsXG4gIERyYXc5MERlZ3JlZVBvbHlnb25Nb2RlLFxuICBEcmF3UG9seWdvbkJ5RHJhZ2dpbmdNb2RlLFxuICBTbmFwcGFibGVNb2RlLFxuICBUcmFuc2Zvcm1Nb2RlLFxuICBFZGl0QWN0aW9uLFxuICBDbGlja0V2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBEcmFnZ2luZ0V2ZW50LFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBHZW9Kc29uRWRpdE1vZGVUeXBlLFxuICBGZWF0dXJlQ29sbGVjdGlvbixcbn0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcblxuaW1wb3J0IEVkaXRhYmxlTGF5ZXIgZnJvbSAnLi9lZGl0YWJsZS1sYXllcic7XG5cbmNvbnN0IERFRkFVTFRfTElORV9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRklMTF9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiA9IFsweGMwLCAweDAsIDB4MCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4ODBdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IgPSBbMHg3YywgMHgwMCwgMHhjMCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfUE9JTlRfT1VUTElORV9DT0xPUiA9IFsweGZmLCAweGZmLCAweGZmLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVMgPSA1O1xuY29uc3QgREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9SQURJVVMgPSAzO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTID0gNztcblxuY29uc3QgREVGQVVMVF9FRElUX01PREUgPSBEcmF3UG9seWdvbk1vZGU7XG5cbmZ1bmN0aW9uIGd1aWRlQWNjZXNzb3IoYWNjZXNzb3IpIHtcbiAgaWYgKCFhY2Nlc3NvciB8fCB0eXBlb2YgYWNjZXNzb3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gYWNjZXNzb3I7XG4gIH1cbiAgcmV0dXJuIChndWlkZU1heWJlV3JhcHBlZCkgPT4gYWNjZXNzb3IodW53cmFwR3VpZGUoZ3VpZGVNYXliZVdyYXBwZWQpKTtcbn1cblxuLy8gVGhlIG9iamVjdCBoYW5kZWQgdG8gdXMgZnJvbSBkZWNrLmdsIGlzIGRpZmZlcmVudCBkZXBlbmRpbmcgb24gdGhlIHZlcnNpb24gb2YgZGVjay5nbCB1c2VkLCB1bndyYXAgYXMgbmVjZXNzYXJ5XG5mdW5jdGlvbiB1bndyYXBHdWlkZShndWlkZU1heWJlV3JhcHBlZCkge1xuICBpZiAoZ3VpZGVNYXliZVdyYXBwZWQuX19zb3VyY2UpIHtcbiAgICByZXR1cm4gZ3VpZGVNYXliZVdyYXBwZWQuX19zb3VyY2Uub2JqZWN0O1xuICB9IGVsc2UgaWYgKGd1aWRlTWF5YmVXcmFwcGVkLnNvdXJjZUZlYXR1cmUpIHtcbiAgICByZXR1cm4gZ3VpZGVNYXliZVdyYXBwZWQuc291cmNlRmVhdHVyZS5mZWF0dXJlO1xuICB9XG4gIC8vIEl0IGlzIG5vdCB3cmFwcGVkLCByZXR1cm4gYXMgaXNcbiAgcmV0dXJuIGd1aWRlTWF5YmVXcmFwcGVkO1xufVxuXG5mdW5jdGlvbiBnZXRFZGl0SGFuZGxlQ29sb3IoaGFuZGxlKSB7XG4gIHN3aXRjaCAoaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUpIHtcbiAgICBjYXNlICdleGlzdGluZyc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX0NPTE9SO1xuICAgIGNhc2UgJ3NuYXAtc291cmNlJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUjtcbiAgICBjYXNlICdpbnRlcm1lZGlhdGUnOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9DT0xPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFZGl0SGFuZGxlT3V0bGluZUNvbG9yKGhhbmRsZSkge1xuICByZXR1cm4gREVGQVVMVF9FRElUSU5HX1BPSU5UX09VVExJTkVfQ09MT1I7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVSYWRpdXMoaGFuZGxlKSB7XG4gIHN3aXRjaCAoaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUpIHtcbiAgICBjYXNlICdleGlzdGluZyc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX1JBRElVUztcbiAgICBjYXNlICdzbmFwJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9SQURJVVM7XG4gICAgY2FzZSAnaW50ZXJtZWRpYXRlJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfUkFESVVTO1xuICB9XG59XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbW9kZTogRHJhd1BvbHlnb25Nb2RlLFxuXG4gIC8vIEVkaXQgYW5kIGludGVyYWN0aW9uIGV2ZW50c1xuICBvbkVkaXQ6ICgpID0+IHt9LFxuXG4gIHBpY2thYmxlOiB0cnVlLFxuICBwaWNraW5nUmFkaXVzOiAxMCxcbiAgcGlja2luZ0RlcHRoOiA1LFxuICBmcDY0OiBmYWxzZSxcbiAgZmlsbGVkOiB0cnVlLFxuICBzdHJva2VkOiB0cnVlLFxuICBsaW5lV2lkdGhTY2FsZTogMSxcbiAgbGluZVdpZHRoTWluUGl4ZWxzOiAxLFxuICBsaW5lV2lkdGhNYXhQaXhlbHM6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICBsaW5lV2lkdGhVbml0czogJ3BpeGVscycsXG4gIGxpbmVKb2ludFJvdW5kZWQ6IGZhbHNlLFxuICBsaW5lTWl0ZXJMaW1pdDogNCxcbiAgcG9pbnRSYWRpdXNTY2FsZTogMSxcbiAgcG9pbnRSYWRpdXNNaW5QaXhlbHM6IDIsXG4gIHBvaW50UmFkaXVzTWF4UGl4ZWxzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgZ2V0TGluZUNvbG9yOiAoZmVhdHVyZSwgaXNTZWxlY3RlZCwgbW9kZSkgPT5cbiAgICBpc1NlbGVjdGVkID8gREVGQVVMVF9TRUxFQ1RFRF9MSU5FX0NPTE9SIDogREVGQVVMVF9MSU5FX0NPTE9SLFxuICBnZXRGaWxsQ29sb3I6IChmZWF0dXJlLCBpc1NlbGVjdGVkLCBtb2RlKSA9PlxuICAgIGlzU2VsZWN0ZWQgPyBERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IgOiBERUZBVUxUX0ZJTExfQ09MT1IsXG4gIGdldFJhZGl1czogKGYpID0+XG4gICAgKGYgJiYgZi5wcm9wZXJ0aWVzICYmIGYucHJvcGVydGllcy5yYWRpdXMpIHx8IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMuc2l6ZSkgfHwgMSxcbiAgZ2V0TGluZVdpZHRoOiAoZikgPT4gKGYgJiYgZi5wcm9wZXJ0aWVzICYmIGYucHJvcGVydGllcy5saW5lV2lkdGgpIHx8IDMsXG5cbiAgLy8gVGVudGF0aXZlIGZlYXR1cmUgcmVuZGVyaW5nXG4gIGdldFRlbnRhdGl2ZUxpbmVDb2xvcjogKGYpID0+IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUixcbiAgZ2V0VGVudGF0aXZlRmlsbENvbG9yOiAoZikgPT4gREVGQVVMVF9TRUxFQ1RFRF9GSUxMX0NPTE9SLFxuICBnZXRUZW50YXRpdmVMaW5lV2lkdGg6IChmKSA9PiAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgfHwgMyxcblxuICBlZGl0SGFuZGxlVHlwZTogJ3BvaW50JyxcblxuICAvLyBwb2ludCBoYW5kbGVzXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlOiAxLFxuICBlZGl0SGFuZGxlUG9pbnRPdXRsaW5lOiB0cnVlLFxuICBlZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aDogMixcbiAgZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzOiA0LFxuICBlZGl0SGFuZGxlUG9pbnRSYWRpdXNNYXhQaXhlbHM6IDgsXG4gIGdldEVkaXRIYW5kbGVQb2ludENvbG9yOiBnZXRFZGl0SGFuZGxlQ29sb3IsXG4gIGdldEVkaXRIYW5kbGVQb2ludE91dGxpbmVDb2xvcjogZ2V0RWRpdEhhbmRsZU91dGxpbmVDb2xvcixcbiAgZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzOiBnZXRFZGl0SGFuZGxlUmFkaXVzLFxuXG4gIC8vIGljb24gaGFuZGxlc1xuICBlZGl0SGFuZGxlSWNvbkF0bGFzOiBudWxsLFxuICBlZGl0SGFuZGxlSWNvbk1hcHBpbmc6IG51bGwsXG4gIGVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlOiAxLFxuICBnZXRFZGl0SGFuZGxlSWNvbjogKGhhbmRsZSkgPT4gaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUsXG4gIGdldEVkaXRIYW5kbGVJY29uU2l6ZTogMTAsXG4gIGdldEVkaXRIYW5kbGVJY29uQ29sb3I6IGdldEVkaXRIYW5kbGVDb2xvcixcbiAgZ2V0RWRpdEhhbmRsZUljb25BbmdsZTogMCxcblxuICAvLyBtaXNjXG4gIGJpbGxib2FyZDogdHJ1ZSxcbn07XG5cbi8vIE1hcHBpbmcgb2YgbW9kZSBuYW1lIHRvIG1vZGUgY2xhc3MgKGZvciBsZWdhY3kgcHVycG9zZXMpXG5jb25zdCBtb2RlTmFtZU1hcHBpbmcgPSB7XG4gIHZpZXc6IFZpZXdNb2RlLFxuXG4gIC8vIEFsdGVyIG1vZGVzXG4gIG1vZGlmeTogTW9kaWZ5TW9kZSxcbiAgdHJhbnNsYXRlOiBuZXcgU25hcHBhYmxlTW9kZShuZXcgVHJhbnNsYXRlTW9kZSgpKSxcblxuICB0cmFuc2Zvcm06IG5ldyBTbmFwcGFibGVNb2RlKG5ldyBUcmFuc2Zvcm1Nb2RlKCkpLFxuICBzY2FsZTogU2NhbGVNb2RlLFxuICByb3RhdGU6IFJvdGF0ZU1vZGUsXG4gIGR1cGxpY2F0ZTogRHVwbGljYXRlTW9kZSxcbiAgc3BsaXQ6IFNwbGl0UG9seWdvbk1vZGUsXG4gIGV4dHJ1ZGU6IEV4dHJ1ZGVNb2RlLFxuICBlbGV2YXRpb246IEVsZXZhdGlvbk1vZGUsXG5cbiAgLy8gRHJhdyBtb2Rlc1xuICBkcmF3UG9pbnQ6IERyYXdQb2ludE1vZGUsXG4gIGRyYXdMaW5lU3RyaW5nOiBEcmF3TGluZVN0cmluZ01vZGUsXG4gIGRyYXdQb2x5Z29uOiBEcmF3UG9seWdvbk1vZGUsXG4gIGRyYXdSZWN0YW5nbGU6IERyYXdSZWN0YW5nbGVNb2RlLFxuICBkcmF3Q2lyY2xlRnJvbUNlbnRlcjogRHJhd0NpcmNsZUZyb21DZW50ZXJNb2RlLFxuICBkcmF3Q2lyY2xlQnlCb3VuZGluZ0JveDogRHJhd0NpcmNsZUJ5RGlhbWV0ZXJNb2RlLFxuICBkcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3g6IERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUsXG4gIGRyYXdSZWN0YW5nbGVVc2luZzNQb2ludHM6IERyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzTW9kZSxcbiAgZHJhd0VsbGlwc2VVc2luZzNQb2ludHM6IERyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUsXG4gIGRyYXc5MERlZ3JlZVBvbHlnb246IERyYXc5MERlZ3JlZVBvbHlnb25Nb2RlLFxuICBkcmF3UG9seWdvbkJ5RHJhZ2dpbmc6IERyYXdQb2x5Z29uQnlEcmFnZ2luZ01vZGUsXG59O1xuXG50eXBlIFByb3BzID0ge1xuICBtb2RlOiBzdHJpbmcgfCBHZW9Kc29uRWRpdE1vZGVUeXBlO1xuICBvbkVkaXQ6IChhcmcwOiBFZGl0QWN0aW9uPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4gdm9pZDtcbiAgLy8gVE9ETzogdHlwZSB0aGUgcmVzdFxuXG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn07XG5cbi8vIHR5cGUgU3RhdGUgPSB7XG4vLyAgIG1vZGU6IEdlb0pzb25FZGl0TW9kZSxcbi8vICAgdGVudGF0aXZlRmVhdHVyZTogP0ZlYXR1cmUsXG4vLyAgIGVkaXRIYW5kbGVzOiBhbnlbXSxcbi8vICAgc2VsZWN0ZWRGZWF0dXJlczogRmVhdHVyZVtdXG4vLyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0YWJsZUdlb0pzb25MYXllciBleHRlbmRzIEVkaXRhYmxlTGF5ZXIge1xuICBzdGF0aWMgbGF5ZXJOYW1lID0gJ0VkaXRhYmxlR2VvSnNvbkxheWVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiAgLy8gcHJvcHM6IFByb3BzO1xuXG4gIC8vIHNldFN0YXRlOiAoJFNoYXBlPFN0YXRlPikgPT4gdm9pZDtcbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IHN1YkxheWVyUHJvcHMgPSB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgaWQ6ICdnZW9qc29uJyxcblxuICAgICAgLy8gUHJveHkgbW9zdCBHZW9Kc29uTGF5ZXIgcHJvcHMgYXMtaXNcbiAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcbiAgICAgIGZpbGxlZDogdGhpcy5wcm9wcy5maWxsZWQsXG4gICAgICBzdHJva2VkOiB0aGlzLnByb3BzLnN0cm9rZWQsXG4gICAgICBsaW5lV2lkdGhTY2FsZTogdGhpcy5wcm9wcy5saW5lV2lkdGhTY2FsZSxcbiAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNaW5QaXhlbHMsXG4gICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgbGluZVdpZHRoVW5pdHM6IHRoaXMucHJvcHMubGluZVdpZHRoVW5pdHMsXG4gICAgICBsaW5lSm9pbnRSb3VuZGVkOiB0aGlzLnByb3BzLmxpbmVKb2ludFJvdW5kZWQsXG4gICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgIHBvaW50UmFkaXVzU2NhbGU6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNTY2FsZSxcbiAgICAgIHBvaW50UmFkaXVzTWluUGl4ZWxzOiB0aGlzLnByb3BzLnBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgcG9pbnRSYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNNYXhQaXhlbHMsXG4gICAgICBnZXRMaW5lQ29sb3I6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVDb2xvciksXG4gICAgICBnZXRGaWxsQ29sb3I6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldEZpbGxDb2xvciksXG4gICAgICBnZXRSYWRpdXM6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldFJhZGl1cyksXG4gICAgICBnZXRMaW5lV2lkdGg6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVXaWR0aCksXG5cbiAgICAgIF9zdWJMYXllclByb3BzOiB7XG4gICAgICAgICdsaW5lLXN0cmluZ3MnOiB7XG4gICAgICAgICAgYmlsbGJvYXJkOiB0aGlzLnByb3BzLmJpbGxib2FyZCxcbiAgICAgICAgfSxcbiAgICAgICAgJ3BvbHlnb25zLXN0cm9rZSc6IHtcbiAgICAgICAgICBiaWxsYm9hcmQ6IHRoaXMucHJvcHMuYmlsbGJvYXJkLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICAgIGdldFJhZGl1czogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCBsYXllcnM6IGFueSA9IFtuZXcgR2VvSnNvbkxheWVyKHN1YkxheWVyUHJvcHMpXTtcblxuICAgIGxheWVycyA9IGxheWVycy5jb25jYXQodGhpcy5jcmVhdGVHdWlkZXNMYXllcnMoKSwgdGhpcy5jcmVhdGVUb29sdGlwc0xheWVycygpKTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkRmVhdHVyZXM6IFtdLFxuICAgICAgZWRpdEhhbmRsZXM6IFtdLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gVE9ETzogaXMgdGhpcyB0aGUgYmVzdCB3YXkgdG8gcHJvcGVybHkgdXBkYXRlIHN0YXRlIGZyb20gYW4gb3V0c2lkZSBldmVudCBoYW5kbGVyP1xuICBzaG91bGRVcGRhdGVTdGF0ZShvcHRzOiBhbnkpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcbiAgICAvLyAgICdzaG91bGRVcGRhdGVTdGF0ZScsXG4gICAgLy8gICBvcHRzLmNoYW5nZUZsYWdzLnByb3BzT3JEYXRhQ2hhbmdlZCxcbiAgICAvLyAgIG9wdHMuY2hhbmdlRmxhZ3Muc3RhdGVDaGFuZ2VkXG4gICAgLy8gKTtcbiAgICByZXR1cm4gc3VwZXIuc2hvdWxkVXBkYXRlU3RhdGUob3B0cykgfHwgb3B0cy5jaGFuZ2VGbGFncy5zdGF0ZUNoYW5nZWQ7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7XG4gICAgcHJvcHMsXG4gICAgb2xkUHJvcHMsXG4gICAgY2hhbmdlRmxhZ3MsXG4gIH06IHtcbiAgICBwcm9wczogUHJvcHM7XG4gICAgb2xkUHJvcHM6IFByb3BzO1xuICAgIGNoYW5nZUZsYWdzOiBhbnk7XG4gIH0pIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgc3VwZXIudXBkYXRlU3RhdGUoeyBwcm9wcywgY2hhbmdlRmxhZ3MgfSk7XG5cbiAgICBsZXQgbW9kZSA9IHRoaXMuc3RhdGUubW9kZTtcbiAgICBpZiAoY2hhbmdlRmxhZ3MucHJvcHNPckRhdGFDaGFuZ2VkKSB7XG4gICAgICBpZiAocHJvcHMubW9kZSAhPT0gb2xkUHJvcHMubW9kZSkge1xuICAgICAgICBpZiAodHlwZW9mIHByb3BzLm1vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gTG9va3VwIHRoZSBtb2RlIGJhc2VkIG9uIGl0cyBuYW1lIChmb3IgbGVnYWN5IHB1cnBvc2VzKVxuICAgICAgICAgIG1vZGUgPSBtb2RlTmFtZU1hcHBpbmdbcHJvcHMubW9kZV07XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBcIkRlcHJlY2F0ZWQgdXNlIG9mIHBhc3NpbmcgYG1vZGVgIGFzIGEgc3RyaW5nLiBQYXNzIHRoZSBtb2RlJ3MgY2xhc3MgY29uc3RydWN0b3IgaW5zdGVhZC5cIlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9kZSA9IHByb3BzLm1vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjb25zdCBNb2RlQ29uc3RydWN0b3IgPSBtb2RlO1xuICAgICAgICAgIG1vZGUgPSBuZXcgTW9kZUNvbnN0cnVjdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1vZGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYE5vIG1vZGUgY29uZmlndXJlZCBmb3IgJHtTdHJpbmcocHJvcHMubW9kZSl9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICAgIC8vIFVzZSBkZWZhdWx0IG1vZGVcbiAgICAgICAgICBtb2RlID0gREVGQVVMVF9FRElUX01PREU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZSAhPT0gdGhpcy5zdGF0ZS5tb2RlKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1vZGUsIGN1cnNvcjogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzZWxlY3RlZEZlYXR1cmVzID0gW107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcykpIHtcbiAgICAgIC8vIFRPRE86IG5lZWRzIGltcHJvdmVkIHRlc3RpbmcsIGkuZS4gY2hlY2tpbmcgZm9yIGR1cGxpY2F0ZXMsIE5hTnMsIG91dCBvZiByYW5nZSBudW1iZXJzLCAuLi5cbiAgICAgIHNlbGVjdGVkRmVhdHVyZXMgPSBwcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLm1hcCgoZWxlbSkgPT4gcHJvcHMuZGF0YS5mZWF0dXJlc1tlbGVtXSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkRmVhdHVyZXMgfSk7XG4gIH1cblxuICBnZXRNb2RlUHJvcHMocHJvcHM6IFByb3BzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVDb25maWc6IHByb3BzLm1vZGVDb25maWcsXG4gICAgICBkYXRhOiBwcm9wcy5kYXRhLFxuICAgICAgc2VsZWN0ZWRJbmRleGVzOiBwcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLFxuICAgICAgbGFzdFBvaW50ZXJNb3ZlRXZlbnQ6IHRoaXMuc3RhdGUubGFzdFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgICBjdXJzb3I6IHRoaXMuc3RhdGUuY3Vyc29yLFxuICAgICAgb25FZGl0OiAoZWRpdEFjdGlvbjogRWRpdEFjdGlvbjxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICAgICAgLy8gRm9yY2UgYSByZS1yZW5kZXJcbiAgICAgICAgLy8gVGhpcyBzdXBwb3J0cyBkb3VibGUtY2xpY2sgd2hlcmUgd2UgbmVlZCB0byBlbnN1cmUgdGhhdCB0aGVyZSdzIGEgcmUtcmVuZGVyIGJldHdlZW4gdGhlIHR3byBjbGlja3NcbiAgICAgICAgLy8gZXZlbiB0aG91Z2ggdGhlIGRhdGEgd2Fzbid0IGNoYW5nZWQsIGp1c3QgdGhlIGludGVybmFsIHRlbnRhdGl2ZSBmZWF0dXJlLlxuICAgICAgICB0aGlzLnNldE5lZWRzVXBkYXRlKCk7XG4gICAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICAgIH0sXG4gICAgICBvblVwZGF0ZUN1cnNvcjogKGN1cnNvcjogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3Vyc29yIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc2VsZWN0aW9uQXdhcmVBY2Nlc3NvcihhY2Nlc3NvcjogYW55KSB7XG4gICAgaWYgKHR5cGVvZiBhY2Nlc3NvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGFjY2Vzc29yO1xuICAgIH1cbiAgICByZXR1cm4gKGZlYXR1cmU6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+XG4gICAgICBhY2Nlc3NvcihmZWF0dXJlLCB0aGlzLmlzRmVhdHVyZVNlbGVjdGVkKGZlYXR1cmUpLCB0aGlzLnByb3BzLm1vZGUpO1xuICB9XG5cbiAgaXNGZWF0dXJlU2VsZWN0ZWQoZmVhdHVyZTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGlmICghdGhpcy5wcm9wcy5kYXRhIHx8ICF0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHRoaXMucHJvcHMuZGF0YS5mZWF0dXJlcy5pbmRleE9mKGZlYXR1cmUpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMuaW5jbHVkZXMoZmVhdHVyZUluZGV4KTtcbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHsgaW5mbywgc291cmNlTGF5ZXIgfTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGlmIChzb3VyY2VMYXllci5pZC5lbmRzV2l0aCgnZ3VpZGVzJykpIHtcbiAgICAgIC8vIElmIHVzZXIgaXMgcGlja2luZyBhbiBlZGl0aW5nIGhhbmRsZSwgYWRkIGFkZGl0aW9uYWwgZGF0YSB0byB0aGUgaW5mb1xuICAgICAgaW5mby5pc0d1aWRlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5mbztcbiAgfVxuXG4gIGNyZWF0ZUd1aWRlc0xheWVycygpIHtcbiAgICBjb25zdCBtb2RlID0gdGhpcy5nZXRBY3RpdmVNb2RlKCk7XG4gICAgY29uc3QgZ3VpZGVzOiBGZWF0dXJlQ29sbGVjdGlvbiA9IG1vZGUuZ2V0R3VpZGVzKHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcblxuICAgIGlmICghZ3VpZGVzIHx8ICFndWlkZXMuZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbGV0IHBvaW50TGF5ZXJQcm9wcztcbiAgICBpZiAodGhpcy5wcm9wcy5lZGl0SGFuZGxlVHlwZSA9PT0gJ2ljb24nKSB7XG4gICAgICBwb2ludExheWVyUHJvcHMgPSB7XG4gICAgICAgIHR5cGU6IEljb25MYXllcixcbiAgICAgICAgaWNvbkF0bGFzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uQXRsYXMsXG4gICAgICAgIGljb25NYXBwaW5nOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uTWFwcGluZyxcbiAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlLFxuICAgICAgICBnZXRJY29uOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb24pLFxuICAgICAgICBnZXRTaXplOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb25TaXplKSxcbiAgICAgICAgZ2V0Q29sb3I6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbkNvbG9yKSxcbiAgICAgICAgZ2V0QW5nbGU6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbkFuZ2xlKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50TGF5ZXJQcm9wcyA9IHtcbiAgICAgICAgdHlwZTogU2NhdHRlcnBsb3RMYXllcixcbiAgICAgICAgcmFkaXVzU2NhbGU6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzU2NhbGUsXG4gICAgICAgIHN0cm9rZWQ6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50T3V0bGluZSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoLFxuICAgICAgICByYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgICByYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzLFxuICAgICAgICBnZXRSYWRpdXM6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMpLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRDb2xvciksXG4gICAgICAgIGdldExpbmVDb2xvcjogZ3VpZGVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVQb2ludE91dGxpbmVDb2xvciksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IGxheWVyID0gbmV3IEdlb0pzb25MYXllcihcbiAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgIGlkOiBgZ3VpZGVzYCxcbiAgICAgICAgZGF0YTogZ3VpZGVzLFxuICAgICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjQsXG4gICAgICAgIF9zdWJMYXllclByb3BzOiB7XG4gICAgICAgICAgcG9pbnRzOiBwb2ludExheWVyUHJvcHMsXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLnByb3BzLmxpbmVXaWR0aFNjYWxlLFxuICAgICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWluUGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhVbml0czogdGhpcy5wcm9wcy5saW5lV2lkdGhVbml0cyxcbiAgICAgICAgbGluZUpvaW50Um91bmRlZDogdGhpcy5wcm9wcy5saW5lSm9pbnRSb3VuZGVkLFxuICAgICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlTGluZUNvbG9yKSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlTGluZVdpZHRoKSxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlRmlsbENvbG9yKSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBbbGF5ZXJdO1xuICB9XG5cbiAgY3JlYXRlVG9vbHRpcHNMYXllcnMoKSB7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMuZ2V0QWN0aXZlTW9kZSgpO1xuICAgIGNvbnN0IHRvb2x0aXBzID0gbW9kZS5nZXRUb29sdGlwcyh0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG5cbiAgICBjb25zdCBsYXllciA9IG5ldyBUZXh0TGF5ZXIoXG4gICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICBpZDogYHRvb2x0aXBzYCxcbiAgICAgICAgZGF0YTogdG9vbHRpcHMsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm4gW2xheWVyXTtcbiAgfVxuXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZSgpLmhhbmRsZUNsaWNrKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBvbkxheWVyS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGUoKS5oYW5kbGVLZXlVcChldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25TdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGUoKS5oYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBvbkRyYWdnaW5nKGV2ZW50OiBEcmFnZ2luZ0V2ZW50KSB7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlKCkuaGFuZGxlRHJhZ2dpbmcoZXZlbnQsIHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcbiAgfVxuXG4gIG9uU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCkge1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZSgpLmhhbmRsZVN0b3BEcmFnZ2luZyhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsYXN0UG9pbnRlck1vdmVFdmVudDogZXZlbnQgfSk7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlKCkuaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQsIHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pIHtcbiAgICBsZXQgeyBjdXJzb3IgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKCFjdXJzb3IpIHtcbiAgICAgIC8vIGRlZmF1bHQgY3Vyc29yXG4gICAgICBjdXJzb3IgPSBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxuXG4gIGdldEFjdGl2ZU1vZGUoKTogR2VvSnNvbkVkaXRNb2RlVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZTtcbiAgfVxufVxuIl19