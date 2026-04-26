// Mock nativewind for Jest test environment
const React = require('react');

module.exports = {
  styled: (Component) => Component,
  useColorScheme: () => ({ colorScheme: 'light' }),
  withExpoSnack: (Component) => Component,
};
