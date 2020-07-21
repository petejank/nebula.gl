import { AnyGeoJson } from '@nebula.gl/edit-modes';
export declare const UNNAMED = "__unnamed_feature__";
export declare type ExportParameters = {
    data: string;
    filename: string;
    mimetype: string;
};
export declare function toGeoJson(geojson: AnyGeoJson): ExportParameters;
export declare function toKml(geojson: AnyGeoJson): ExportParameters;
export declare function toWkt(geojson: AnyGeoJson): ExportParameters;
export declare function toStats(geojson: AnyGeoJson): ExportParameters;
//# sourceMappingURL=exporter.d.ts.map