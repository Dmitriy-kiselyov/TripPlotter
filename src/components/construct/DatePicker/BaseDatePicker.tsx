import React from 'react';

// @ts-ignore
import jquery from '../../../../node_modules/jquery';
import '../../../../node_modules/air-datepicker';

import { Input } from '../Input/Input';

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

        this.id = 'id' + String(Math.random()).slice(2);
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

    protected dateToString(date: Date): string | undefined {
        return withLeadZero(date.getDate()) + '.' + withLeadZero(date.getMonth() + 1) + '.' + date.getFullYear();
    }
}

function withLeadZero(n: number): string {
    return n >= 10 ? String(n) : '0' + n;
}
