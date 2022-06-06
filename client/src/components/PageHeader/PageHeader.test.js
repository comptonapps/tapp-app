import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import PageHeader from './PageHeader';

it('should render without crashing', () => {
    render(<MemoryRouter><PageHeader/></MemoryRouter>)
});

it('should match snapshot', () => {
    const { asFragment } = render(<MemoryRouter><PageHeader /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
});