import axios from 'axios';

import store from '../analytics';

import * as An from '../analytics';
console.log({An})
export const startTest = (test) => ({
            type: 'START_TEST_THUNK',
            payload: Promise.all([
                store.dispatch({
                    type: 'START_TEST',
                    payload: axios.post('https://www.google.com/account/login'),
                    meta: {
                        id: test
                    }
                })
            ])
        })
    