// Mock structuredClone for jest environment
module.exports = {
  default: (obj) => JSON.parse(JSON.stringify(obj)),
};
