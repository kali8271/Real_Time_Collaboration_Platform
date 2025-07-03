import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthComponent from './AuthComponent';

// jest-dom is imported globally via jest.setup.js

describe('AuthComponent', () => {
  it('renders login form when not authenticated', () => {
    render(<AuthComponent />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders registration form when register button is clicked', () => {
    render(<AuthComponent />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
  });
}); 