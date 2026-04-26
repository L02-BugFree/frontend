import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock external dependencies - MUST be before importing HomeScreen
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  ParamListBase: {},
}), { virtual: true });

jest.mock('@react-navigation/native-stack', () => ({
  NativeStackNavigationProp: jest.fn(),
}), { virtual: true });

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  return {
    KeyboardAwareScrollView: ({ children }: { children: React.ReactNode }) =>
      React.createElement('ScrollView', {}, children),
  };
}, { virtual: true });

jest.mock('./GlobalStyles', () => ({
  Color: {
    lightLabelPrimary: '#000',
    greyscaleGrey80: '#808080',
  },
  BoxShadow: {
    m3ElevationLight2: {},
  },
  StyleVariable: {},
}), { virtual: true });

// Now import HomeScreen
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('home-title')).toBeTruthy();
  });

  it('contains the NexTime title', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('NexTime')).toBeTruthy();
  });

  it('renders the search input', () => {
    const { getByTestId } = render(<HomeScreen />);
    const searchInput = getByTestId('search-input');
    expect(searchInput).toBeTruthy();
  });

  it('contains contact names like John Walton', () => {
    const { getAllByText } = render(<HomeScreen />);
    // There might be multiple instances due to the way Builder.io generates code (overlapping layers)
    const contacts = getAllByText('John Walton');
    expect(contacts.length).toBeGreaterThan(0);
  });
});
