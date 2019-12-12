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
    placeholder: string;
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
        jquery('#' + this.id).clockpicker({
            placement: 'bottom',
            align: 'right',
            autoclose: true
        });
    }

    render() {
        return (
            <Input
                id={this.id}
                className="TimePicker"
                placeholder={this.props.placeholder}
                readonly
                textCenter
            />
        );
    }
}
