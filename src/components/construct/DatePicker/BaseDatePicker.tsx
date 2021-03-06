import React from 'react';

// @ts-ignore
import jquery from '../../../../node_modules/jquery';
import '../../../../node_modules/air-datepicker';

import { Input } from '../Input/Input';
import { generateId } from '../../../lib/generateId';

import './DatePicker.scss';

export interface IBaseDatePickerProps {
    placeholder?: string;
    onShow?: () => void;
    validationError?: boolean;
    disabled?: boolean;
}

export abstract class BaseDatePicker<P extends IBaseDatePickerProps> extends React.Component<P> {
    private readonly id: string;

    constructor(props: P) {
        super(props);

        this.id = generateId('date');
    }

    componentDidMount(): void {
        jquery('#' + this.id).datepicker(this.getDatepickerParams());

        this.setupDate();
    }

    protected getDatePicker(): any {
        return jquery('#' + this.id).datepicker().data('datepicker');
    }

    protected abstract getDatepickerParams(): object;

    protected abstract setupDate(): void;

    render() {
        return (
            <Input
                id={this.id}
                value={this.getDateString()}
                placeholder={this.props.placeholder}
                validationError={this.props.validationError}
                textCenter
                readonly
                disabled={this.props.disabled}
            />
        );
    }

    protected abstract getDateString(): string | undefined;
}
