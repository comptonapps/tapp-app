import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import Cell from './Cell';

it('should render without crashing', () => {
    render(<MemoryRouter><Cell hoverable={true}/></MemoryRouter>)
});

it('should match snapshot', () => {
    const { asFragment } = render(<MemoryRouter><Cell /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
});