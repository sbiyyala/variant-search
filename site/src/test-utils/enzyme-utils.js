import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

function configureEnzyme() {
    configure({adapter: new Adapter()});
}

export {configureEnzyme};