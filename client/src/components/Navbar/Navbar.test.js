import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar';

it('should render without crashing', () => {
    render(<MemoryRouter><Navbar/></MemoryRouter>)
});

it('should match snapshot', () => {
    const { asFragment } = render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
});