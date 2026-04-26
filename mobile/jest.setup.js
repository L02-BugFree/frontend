// Suppress Expo 54 winter runtime errors in Jest environment

// Polyfill structuredClone if not available (Node < 17)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Stub out __ExpoImportMetaRegistry so expo's winter runtime doesn't crash
if (typeof global.__ExpoImportMetaRegistry === 'undefined') {
  global.__ExpoImportMetaRegistry = {};
}

// Prevent expo installGlobal from crashing by pre-defining globals
global.TextDecoder = global.TextDecoder || class TextDecoder {
  decode(value) { return String(value); }
};
