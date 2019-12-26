import React from 'react';

// @ts-ignore
import jquery from '../../../node_modules/jquery';
import '../../../node_modules/air-datepicker';

import { Input } from '../Input/Input';

import './DatePicker.scss';

export interface IDatePickerProps {
    placeholder?: string;
    onShow?: () => void;
    onChange: (date: Date | null) => void;
    validationError?: boolean;
    disabled?: boolean;
}

export class DatePicker extends React.PureComponent<IDatePickerProps> {
    private readonly id: string;

    constructor(props: IDatePickerProps) {
        super(props);

        this.id = 'id' + String(Math.random()).slice(2);
    }

    componentDidMount(): void {
        jquery('#' + this.id).datepicker({
            minDate: new Date(),
            onShow: () => {
                if (this.props.onShow) {
                    this.props.onShow();
                }
            },
            onSelect: (formattedDate: string, date?: Date) => this.props.onChange(date || null)
        })
    }

    render() {
        return (
            <Input
                id={this.id}
                placeholder={this.props.placeholder}
                validationError={this.props.validationError}
                textCenter
                readonly
                disabled={this.props.disabled}
            />
        );
    }
}
