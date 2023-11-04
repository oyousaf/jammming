import React from 'react';
import { render } from '@testing-library/react';
import Tracklist from './Tracklist';

describe('Tracklist Component', () => {
  test('renders without crashing', () => {
    render(<Tracklist searchResults={null} error={null} onAdd={() => {}} />);
  });

  test('displays an error message when an error is provided', () => {
    const errorMessage = 'An error occurred';
    const { getByText } = render(<Tracklist searchResults={null} error={errorMessage} onAdd={() => {}} />);
    const errorElement = getByText(`Error: ${errorMessage}`);
    expect(errorElement).toBeInTheDocument();
  });

  test('displays "No data received" message when no search results are provided', () => {
    const { getByText } = render(<Tracklist searchResults={null} error={null} onAdd={() => {}} />);
    const noDataMessage = getByText('No data received');
    expect(noDataMessage).toBeInTheDocument();
  });

  test('displays track items when search results are provided', () => {
    const searchResults = {
      tracks: {
        items: [{ data: { id: '1', name: 'Track 1' } }, { data: { id: '2', name: 'Track 2' } }],
      },
    };
    const { getByText } = render(<Tracklist searchResults={searchResults} error={null} onAdd={() => {}} />);
    const track1 = getByText('Track 1');
    const track2 = getByText('Track 2');
    expect(track1).toBeInTheDocument();
    expect(track2).toBeInTheDocument();
  });

  test('calls onAdd function when clicking the "+" button for a track', () => {
    const onAdd = jest.fn();
    const searchResults = {
      tracks: {
        items: [{ data: { id: '1', name: 'Track 1' } }],
      },
    };
    const { getByText } = render(<Tracklist searchResults={searchResults} error={null} onAdd={onAdd} />);
    const addButton = getByText('+');
    addButton.click();
    expect(onAdd).toHaveBeenCalled();
  });
});
