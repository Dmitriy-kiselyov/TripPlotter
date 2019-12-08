// @ts-ignore
import jquery from './../../node_modules/jquery';
import './../../assets/clock-picker/clockpicker.js';

declare global {
    interface Window {
        __clockPricker: () => {};
        jQuery: any;
        $: any;
    }
}

window.jQuery = window.$ = jquery;
window.__clockPricker();
