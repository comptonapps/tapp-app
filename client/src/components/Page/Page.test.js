import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import Page from './Page';

it('should render without crashing', () => {
    render(<MemoryRouter><Page/></MemoryRouter>)
});

it('should match snapshot', () => {
    const { asFragment } = render(<MemoryRouter><Page /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
});