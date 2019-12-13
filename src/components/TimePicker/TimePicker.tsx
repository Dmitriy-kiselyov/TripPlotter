import React from 'react';

import './../../../assets/clock-picker/clockpicker.js';
// @ts-ignore
import jquery from '../../../node_modules/jquery';

import { Input } from '../Input/Input';

import './TimePicker.scss';

declare global {
    interface Window {
        $: any
    }
}

export interface ITimePickerProps {
    placeholder?: string;
    value?: string;
    place: 'bottom' | 'left' | 'top';
    onChange?: (time: string) => void;
    validationError?: boolean;
    onShow?: () => void;
}

function generateId() {
    return 'id' + Math.floor(Math.random() * 100000);
}

export class TimePicker extends React.PureComponent<ITimePickerProps> {
    private id: string;

    constructor(props: ITimePickerProps) {
        super(props);

        this.id = generateId();
    }

    componentDidMount(): void {
        const _this = this;

        jquery('#' + this.id).clockpicker({
            placement: this.props.place,
            align: 'right',
            autoclose: true,
            beforeShow: function() {
                if (_this.props.onShow) {
                    _this.props.onShow();
                }
            },
            afterDone: function () {
                // использовать Input нельзя, jquery не меняет value инпута
                if (_this.props.onChange) {
                    // @ts-ignore
                    _this.props.onChange(document.querySelector('#' + _this.id).value);
                }
            }
        });
    }

    render() {
        return (
            <Input
                id={this.id}
                value={this.props.value}
                className="TimePicker"
                placeholder={this.props.placeholder}
                validationError={this.props.validationError}
                readonly
                textCenter
            />
        );
    }
}
