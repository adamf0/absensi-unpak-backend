import { IUnitConverter } from "./IUnitConverter";

export const UnitConverter: Record<string, IUnitConverter> = {
    "Kilo": {
        convert: (dist) => dist * 1.609344 // Convert to kilometers
    },
    "Mile": {
        convert: (dist) => dist * 0.8684 // Convert to nautical miles
    },
    "Meter": {
        convert: (dist) => dist * 1609.344 // Convert to meters
    },
    "default": {
        convert: (dist) => dist
    }
};
