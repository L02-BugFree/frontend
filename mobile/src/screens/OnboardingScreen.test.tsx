import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from './OnboardingScreen';

describe('OnboardingScreen', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    expect(getByTestId('onboarding-title')).toBeTruthy();
  });

  it('renders login and register buttons', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    expect(getByTestId('login-btn')).toBeTruthy();
    expect(getByTestId('register-btn')).toBeTruthy();
  });

  it('calls onNavigate when login button is pressed', () => {
    const mockNavigate = jest.fn();
    const { getByTestId } = render(<OnboardingScreen onNavigate={mockNavigate} />);
    fireEvent.press(getByTestId('login-btn'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('calls onNavigate when register button is pressed', () => {
    const mockNavigate = jest.fn();
    const { getByTestId } = render(<OnboardingScreen onNavigate={mockNavigate} />);
    fireEvent.press(getByTestId('register-btn'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('handles button presses without errors when no callback provided', () => {
    const { getByTestId } = render(<OnboardingScreen />);
    expect(() => fireEvent.press(getByTestId('login-btn'))).not.toThrow();
    expect(() => fireEvent.press(getByTestId('register-btn'))).not.toThrow();
  });
});

