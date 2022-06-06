import { render, screen, } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import NewAuthForm from './NewAuthForm';
import { store } from '../../index';
import { Provider } from 'react-redux'
import App from '../../App'

const root = document.createElement('div');

beforeEach(() => {
    document.body.appendChild(root);
    const content = (
        <Provider store={store}>
            <App />
        </Provider>
    );

    render(
        content,
        root
    )
});

// afterEach(() => {
//     unmountComponentAtNode(container);
//     container.remove()
//     container = null
// })

it('should render without crashing', () => {
    render(<MemoryRouter><NewAuthForm/></MemoryRouter>)
});

it('should match snapshot', () => {
    const { asFragment } = render(<MemoryRouter><NewAuthForm /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
});