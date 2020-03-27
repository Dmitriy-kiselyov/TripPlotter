import React from 'react';
import { BaseDatePicker, IBaseDatePickerProps } from './BaseDatePicker';

export interface ISingleDatePickerProps extends IBaseDatePickerProps {
    date?: Date;
    onChange: (date: Date | null) => void;
}

export class SingleDatePicker extends BaseDatePicker<ISingleDatePickerProps> {
    protected getDatepickerParams(): object {
        return {
            onShow: () => {
                if (this.props.onShow) {
                    this.props.onShow();
                }
            },
            range: false,
            onSelect: this.handleSelect
        };
    }

    private handleSelect = (formattedDate: string, date?: Date) => this.props.onChange(date || null);

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

        return super.dateToString(date);
    }
}
