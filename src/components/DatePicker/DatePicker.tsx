import React from 'react';

import '../../../node_modules/air-datepicker';

import { Input } from '../Input/Input';

import './DatePicker.scss';

export class DatePicker extends React.PureComponent<{}> {
    render() {
        return (
            <Input
                className="datepicker-here"
                placeholder="Дата путешествия"
                textCenter
                readonly
            />
        );
    }
}
