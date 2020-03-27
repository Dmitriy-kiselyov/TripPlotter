import React from 'react';
import { BaseDatePicker, IBaseDatePickerProps } from './BaseDatePicker';

export interface IMultiDatePicker extends IBaseDatePickerProps {
    date?: [Date, Date];
    onChange: (date: [Date, Date] | null) => void;
}

export class MultiDatePicker extends BaseDatePicker<IMultiDatePicker> {
    private selectedDate?: [Date, Date] | [Date];

    protected getDatepickerParams(): object {
        const { date } = this.props;

        return {
            onShow: () => {
                if (this.props.onShow) {
                    this.props.onShow();
                }
            },
            onHide: () => {
                if (this.selectedDate && this.selectedDate.length === 1) {
                    this.getDatePicker().selectDate(null);
                    this.props.onChange(null);
                }
            },
            range: true,
            onSelect: this.handleSelect
        };
    }

    private handleSelect = (formattedDate: string, date?: [Date] | [Date, Date]) => {
        const { onChange } = this.props;

        this.selectedDate = date;

        if (!date) {
            onChange(null);
        }

        if (date.length === 2) {
            onChange(date);
        }
    };

    protected setupDate(): void {
        if (this.props.date) {
            this.getDatePicker().selectDate(this.props.date);
        }
    }

    protected getDateString(): string | undefined {
        const { date } = this.props;

        if (!date) {
            return undefined;
        }

        return super.dateToString(date[0]) + ' – ' + super.dateToString(date[1]);
    }
}
