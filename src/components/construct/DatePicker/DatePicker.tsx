import React from 'react';

// @ts-ignore
import jquery from '../../../../node_modules/jquery';
import '../../../../node_modules/air-datepicker';

import { Input } from '../Input/Input';

import './DatePicker.scss';

export interface IDatePickerProps {
    placeholder?: string;
    date?: Date;
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
            startDate: this.props.date,
            onShow: () => {
                if (this.props.onShow) {
                    this.props.onShow();
                }
            },
            onSelect: (formattedDate: string, date?: Date) => this.props.onChange(date || null)
        });

        if (this.props.date) {
            // Datepicker не умеет выделять первичную дату
            const { date } = this.props;
            const selector = `.datepicker--cell-day[data-month="${date.getMonth()}"][data-date="${date.getDate()}"]`;
            const el = document.querySelector(selector);

            if (el) {
                el.classList.add('-selected-');
            }
        }
    }

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

    private getDateString(): string | undefined {
        const { date } = this.props;

        if (!date) {
            return undefined;
        }

        return withLeadZero(date.getDate()) + '.' + withLeadZero(date.getMonth() + 1) + '.' + date.getFullYear();
    }
}

function withLeadZero(n: number): string {
    return n >= 10 ? String(n) : '0' + n;
}
