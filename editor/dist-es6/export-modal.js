"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportModal = ExportModal;

var React = _interopRequireWildcard(require("react"));

var _editorModal = require("./editor-modal");

var _exportComponent = require("./export-component");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-env browser */
function ExportModal(props) {
  return /*#__PURE__*/React.createElement(_editorModal.EditorModal, {
    onClose: props.onClose,
    title: 'Export',
    content: /*#__PURE__*/React.createElement(_exportComponent.ExportComponent, {
      features: props.features,
      onClose: props.onClose
    })
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leHBvcnQtbW9kYWwudHN4Il0sIm5hbWVzIjpbIkV4cG9ydE1vZGFsIiwicHJvcHMiLCJvbkNsb3NlIiwiZmVhdHVyZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOztBQUVBOztBQUNBOzs7Ozs7QUFKQTtBQVdPLFNBQVNBLFdBQVQsQ0FBcUJDLEtBQXJCLEVBQThDO0FBQ25ELHNCQUNFLG9CQUFDLHdCQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ0MsT0FEakI7QUFFRSxJQUFBLEtBQUssRUFBRSxRQUZUO0FBR0UsSUFBQSxPQUFPLGVBQUUsb0JBQUMsZ0NBQUQ7QUFBaUIsTUFBQSxRQUFRLEVBQUVELEtBQUssQ0FBQ0UsUUFBakM7QUFBMkMsTUFBQSxPQUFPLEVBQUVGLEtBQUssQ0FBQ0M7QUFBMUQ7QUFIWCxJQURGO0FBT0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEFueUdlb0pzb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgRWRpdG9yTW9kYWwgfSBmcm9tICcuL2VkaXRvci1tb2RhbCc7XG5pbXBvcnQgeyBFeHBvcnRDb21wb25lbnQgfSBmcm9tICcuL2V4cG9ydC1jb21wb25lbnQnO1xuXG5leHBvcnQgdHlwZSBFeHBvcnRNb2RhbFByb3BzID0ge1xuICBmZWF0dXJlczogQW55R2VvSnNvbjtcbiAgb25DbG9zZTogKCkgPT4gdW5rbm93bjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHBvcnRNb2RhbChwcm9wczogRXhwb3J0TW9kYWxQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxFZGl0b3JNb2RhbFxuICAgICAgb25DbG9zZT17cHJvcHMub25DbG9zZX1cbiAgICAgIHRpdGxlPXsnRXhwb3J0J31cbiAgICAgIGNvbnRlbnQ9ezxFeHBvcnRDb21wb25lbnQgZmVhdHVyZXM9e3Byb3BzLmZlYXR1cmVzfSBvbkNsb3NlPXtwcm9wcy5vbkNsb3NlfSAvPn1cbiAgICAvPlxuICApO1xufVxuIl19