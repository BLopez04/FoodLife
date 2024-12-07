import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React, { useState } from "react";
import Form from "./Form";


describe('Form Component Tests', () => {
  it('renders the form with initial values', () => {
    const { getByLabelText, getByText } = render(<Form handleSubmit={jest.fn()} />);
    expect(getByLabelText(/date/i)).toHaveValue('');
    expect(getByLabelText(/item/i)).toHaveValue('');
    expect(getByLabelText(/price/i)).toHaveValue(null);
    expect(getByLabelText(/type/i)).toHaveValue('personal');
    expect(getByText(/submit/i)).toBeInTheDocument();
  });

  it('updates state when inputs change', () => {
    const { getByLabelText } = render(<Form handleSubmit={jest.fn()} />);

    fireEvent.change(getByLabelText(/date/i), { target: { value: '2024-12-06' } });
    expect(getByLabelText(/date/i)).toHaveValue('2024-12-06');

    fireEvent.change(getByLabelText(/item/i), { target: { value: 'Book' } });
    expect(getByLabelText(/item/i)).toHaveValue('Book');

    fireEvent.change(getByLabelText(/price/i), { target: { value: '25.00' } });
    expect(getByLabelText(/price/i)).toHaveValue(25.00);

    fireEvent.change(getByLabelText(/type/i), { target: { value: 'meal' } });
    expect(getByLabelText(/type/i)).toHaveValue('meal');
  });

  it('submits the form and resets the inputs', () => {
    const mockHandleSubmit = jest.fn();
    const { getByLabelText, getByText } = render(<Form handleSubmit={mockHandleSubmit} />);

    fireEvent.change(getByLabelText(/date/i), { target: { value: '2024-12-06' } });
    fireEvent.change(getByLabelText(/item/i), { target: { value: 'Milk' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '3.99' } });
    fireEvent.change(getByLabelText(/type/i), { target: { value: 'grocery' } });

    fireEvent.click(getByText(/submit/i));

    expect(mockHandleSubmit).toHaveBeenCalledWith({
      date: '2024-12-06',
      price: 3.99,
      name: 'Milk',
      type: 'grocery',
    });

    // Ensure form resets
    expect(getByLabelText(/date/i)).toHaveValue('');
    expect(getByLabelText(/item/i)).toHaveValue('');
    expect(getByLabelText(/price/i)).toHaveValue(null);
    expect(getByLabelText(/type/i)).toHaveValue('personal');
  });

  it('handles invalid inputs gracefully', () => {
    const { getByLabelText } = render(<Form handleSubmit={jest.fn()} />);

    fireEvent.change(getByLabelText(/price/i), { target: { value: '-10' } });
    expect(getByLabelText(/price/i)).toHaveValue(-10); // Input accepts it, logic can sanitize if needed
  });
});

