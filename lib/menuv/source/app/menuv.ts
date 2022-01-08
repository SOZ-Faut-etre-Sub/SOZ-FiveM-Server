/**
----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Version: 1.0.0
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
*/
import VUE from 'vue';
import STYLE from './vue_components/style';
import * as VueScrollTo from 'vue-scrollto';

VUE.use(VueScrollTo.default, {
    container: 'ul.menuv-items',
    duration: 500,
    easing: 'ease-in',
    offset: -25,
    force: true,
    cancelable: false,
    onStart: false,
    onDone: false,
    onCancel: false,
    x: false,
    y: true
});

export interface Sounds {
    type: 'native' | 'custom';
    name: string;
    library: string;
}

export interface Option {
    label: string;
    description: string;
    value: number;
}

export interface Item {
    index: number;
    type: 'button' | 'menu' | 'checkbox' | 'confirm' | 'range' | 'slider' | 'label' | 'unknown';
    uuid: string;
    icon: string;
    label: string;
    rightLabel: string;
    description: string;
    value: any;
    prev_value: any;
    values: Option[];
    min: number;
    max: number;
    disabled: boolean;
}

export interface Menu {
    hidden: boolean;
    theme: 'default' | 'native';
    resource: string;
    uuid: string;
    title: string;
    subtitle: string;
    position: 'topleft' | 'topcenter' | 'topright' | 'centerleft' | 'center' | 'centerright' | 'bottomleft' | 'bottomcenter' | 'bottomright';
    size: 'size-100' | 'size-110' | 'size-125' | 'size-150' | 'size-175' | 'size-200';
    color: {
        r: number,
        g: number,
        b: number
    };
    items: Item[];
    texture: string;
    dictionary: string;
    defaultSounds: Record<'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ENTER' | 'CLOSE', Sounds>;
}

export default VUE.extend({
    template: '#menuv_template',
    name: 'menuv',
    components: {
        STYLE
    },
    data() {
        return {
            theme: 'native',
            resource: 'menuv',
            uuid: '',
            menu: false,
            show: false,
            title: 'MenuV',
            subtitle: '',
            position: 'topleft',
            size: 'size-110',
            texture: 'none',
            dictionary: 'none',
            color: {
                r: 0,
                g: 0,
                b: 255
            },
            items: [] as Item[],
            listener: (event: MessageEvent) => {},
            index: 0,
            sounds: {} as Record<'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ENTER' | 'CLOSE', Sounds>,
            cached_indexes: {} as Record<string, number>
        }
    },
    destroyed() {
        window.removeEventListener('message', this.listener)
    },
    mounted() {
        this.listener = (event: MessageEvent) => {
            const data: any = event.data ||(<any>event).detail;

            if (!data || !data.action) { return; }

            const typeRef = data.action as 'UPDATE_STATUS' | 'OPEN_MENU' | 'CLOSE_MENU' | 'UPDATE_TITLE' | 'UPDATE_SUBTITLE' | 'KEY_PRESSED' | 'RESOURCE_STOPPED' | 'UPDATE_ITEMS' | 'UPDATE_ITEM' | 'REFRESH_MENU'

            if (this[typeRef]) {
                this[typeRef](data);
            }
        };

        window.addEventListener('message', this.listener);

        this.POST('https://menuv/loaded', {});
    },
    watch: {
        theme() {},
        title() {},
        subtitle() {},
        position() {},
        color() {},
        options() {},
        menu() {},
        show() {},
        size() {},
        index(newValue, oldValue) {
            let prev_uuid = null;
            let next_uuid = null;

            if (oldValue >= 0 && oldValue < this.items.length) {
                prev_uuid = this.items[oldValue].uuid;
            }

            if (newValue >= 0 && newValue < this.items.length) {
                next_uuid = this.items[newValue].uuid;
            }

            this.cached_indexes[this.uuid] = newValue;
            this.POST(`https://menuv/switch`, { prev: prev_uuid, next: next_uuid, r: this.resource });
        },
        items: {
            deep: true,
            handler(newValue: Item[], oldValue: Item[]) {
                if (this.index >= newValue.length || this.index < 0) { return; }

                let sameItem = null;
                const currentItem = newValue[this.index];

                if (currentItem == null) { return; }

                for (var i = 0; i < oldValue.length; i++) {
                    if (currentItem.uuid == oldValue[i].uuid) {
                        sameItem = oldValue[i];
                    }
                }

                if (sameItem == null || currentItem.value == currentItem.prev_value) { return; }

                currentItem.prev_value = currentItem.value;

                this.POST(`https://menuv/update`, { uuid: currentItem.uuid, prev: sameItem.value, now: currentItem.value, r: this.resource });
            }
        }
    },
    updated: function() {
        if (this.index < 0) { return; }

        const el = document.getElementsByTagName('li');

        for (var i = 0; i < el.length; i++) {
            const index = el[i].getAttribute('index')

            if (index === null) { continue; }

            const idx = parseInt(index);

            if (idx == this.index) {
                this.$scrollTo(`li[index="${this.index}"]`, 0, {});
            }
        }
    },
    computed: {},
    methods: {
        UPDATE_STATUS({ status }: { status: boolean }) {
            if (this.menu) { this.show = status; }
        },
        OPEN_MENU({ menu, reopen }: { menu: Menu, reopen: boolean }) {
            this.POST(`https://menuv/open`, { uuid: this.uuid, new_uuid: menu.uuid, r: this.resource });
            this.RESET_MENU();

            this.theme = this.ENSURE(menu.theme, 'default');
            this.resource = this.ENSURE(menu.resource, 'menuv');
            this.uuid = this.ENSURE(menu.uuid, '00000000-0000-0000-0000-000000000000');
            this.title = this.ENSURE(menu.title, this.title);
            this.subtitle = this.ENSURE(menu.subtitle, this.subtitle);
            this.position = this.ENSURE(menu.position, 'topleft');
            this.size = this.ENSURE(menu.size, 'size-110');
            this.texture = this.ENSURE(menu.texture, 'none');
            this.dictionary = this.ENSURE(menu.dictionary, 'none');
            this.color = menu.color || this.color;
            this.sounds = menu.defaultSounds || this.sounds;
            this.show = !(menu.hidden || false);
            this.menu = true;

            const _items = this.items = menu.items || [];

            for (var i = 0; i < _items.length; i++) {
                _items[i].prev_value = _items[i].value;
            }

            this.items = _items.sort((item1, item2) => {
                if (item1.index > item2.index) { return 1; }
                if (item1.index < item2.index) { return -1; }

                return 0;
            });

            const index = (reopen || false) ? (this.cached_indexes[this.uuid] || 0) : 0;
            const nextIndex = this.NEXT_INDEX(index);
            const prevIndex = this.PREV_INDEX(nextIndex);

            this.index = prevIndex;
            this.cached_indexes[this.uuid] = prevIndex;
            this.POST(`https://menuv/opened`, { uuid: this.uuid, r: this.resource });
        },
        REFRESH_MENU({ menu }: { menu: Menu }) {
            const current_index = this.index + 0;

            this.RESET_MENU();

            this.theme = this.ENSURE(menu.theme, 'default');
            this.resource = this.ENSURE(menu.resource, 'menuv');
            this.uuid = this.ENSURE(menu.uuid, '00000000-0000-0000-0000-000000000000');
            this.title = this.ENSURE(menu.title, this.title);
            this.subtitle = this.ENSURE(menu.subtitle, this.subtitle);
            this.position = this.ENSURE(menu.position, 'topleft');
            this.size = this.ENSURE(menu.size, 'size-110');
            this.texture = this.ENSURE(menu.texture, 'none');
            this.dictionary = this.ENSURE(menu.dictionary, 'none');
            this.color = menu.color || this.color;
            this.sounds = menu.defaultSounds || this.sounds;
            this.show = !(menu.hidden || false);
            this.menu = true;

            const _items = this.items = menu.items || [];

            for (var i = 0; i < _items.length; i++) {
                _items[i].prev_value = _items[i].value;
            }

            this.items = this.items = _items.sort((item1, item2) => {
                if (item1.index > item2.index) { return 1; }
                if (item1.index < item2.index) { return -1; }

                return 0;
            });

            const nextIndex = this.NEXT_INDEX(current_index);
            const prevIndex = this.PREV_INDEX(nextIndex);

            this.index = prevIndex;
        },
        CLOSE_MENU({ uuid }: { uuid: string }) {
            if (this.uuid == uuid) {
                this.RESET_MENU();
            }
        },
        UPDATE_TITLE({ title, __uuid }: { title: string, __uuid: string }) {
            if (__uuid != this.uuid) { return; }

            this.title = title || this.title;
        },
        UPDATE_SUBTITLE({ subtitle, __uuid }: { subtitle: string, __uuid: string }) {
            if (__uuid != this.uuid) { return; }

            this.subtitle = subtitle || this.subtitle;
        },
        UPDATE_ITEMS({ items, __uuid }: { items: Item[], __uuid: string }) {
            if (__uuid != this.uuid) { return; }

            const _items = items || this.items;

            for (var i = 0; i < _items.length; i++) {
                _items[i].prev_value = _items[i].value;
            }

            this.items = _items;

            const nextIndex = this.NEXT_INDEX(this.index);
            const prevIndex = this.PREV_INDEX(nextIndex);

            this.index = prevIndex;
        },
        UPDATE_ITEM({ item, __uuid }: { item: Item, __uuid: string }) {
            if (__uuid != this.uuid || item == null || typeof item == "undefined") { return; }

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].uuid == item.uuid) {
                    this.items[i].icon = item.icon || this.items[i].icon;
                    this.items[i].label = item.label || this.items[i].label;
                    this.items[i].rightLabel = item.rightLabel || this.items[i].rightLabel;
                    this.items[i].description = item.description || this.items[i].description;
                    this.items[i].value = item.value || this.items[i].value;
                    this.items[i].values = item.values || this.items[i].values;
                    this.items[i].min = item.min || this.items[i].min;
                    this.items[i].max = item.max || this.items[i].max;
                    this.items[i].disabled = item.disabled || this.items[i].disabled;

                    if ((this.index == i && this.items[i].disabled) || (this.index < 0 && !this.items[i].disabled)) {
                        this.index = this.NEXT_INDEX(this.index);
                    }

                    return;
                }
            }
        },
        ADD_ITEM({ item, index, __uuid }: { item: Item, index?: number, __uuid: string }) {
            if (__uuid != this.uuid) { return; }

            item.prev_value = item.value;

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].uuid == item.uuid) {
                    this.UPDATE_ITEM({ item: item, __uuid: __uuid });
                    return;
                }
            }

            const _items = this.items;

            if (typeof index == 'undefined' || index == null || index < 0 || index >= _items.length) {
                _items.push(item);
            } else {
                _items.splice(index, 0, item);
            }

            this.items = _items.sort((item1, item2) => {
                if (item1.index > item2.index) { return 1; }
                if (item1.index < item2.index) { return -1; }

                return 0;
            });

            if (this.index < 0 && !item.disabled) { this.index = this.NEXT_INDEX(this.index); }
        },
        REMOVE_ITEM({ uuid, __uuid }: { uuid: string, __uuid: string }) {
            if (__uuid != this.uuid || typeof uuid != 'string' || uuid == '') { return }

            const _items = this.items;

            for (var i = 0; i < _items.length; i++) {
                if (_items[i].uuid == uuid) {
                    _items.splice(i, 1);
                }

                if (i == this.index) {
                    this.index = this.PREV_INDEX(this.index);
                }
            }

            this.items = _items.sort((item1, item2) => {
                if (item1.index > item2.index) { return 1; }
                if (item1.index < item2.index) { return -1; }

                return 0;
            });
        },
        RESET_MENU() {
            this.theme = 'default'
            this.resource = 'menuv';
            this.menu = false;
            this.show = false;
            this.uuid = '00000000-0000-0000-0000-000000000000';
            this.title = 'MenuV';
            this.subtitle = '';
            this.position = 'topleft';
            this.size = 'size-110';
            this.texture = 'none';
            this.dictionary = 'none';
            this.color.r = 0;
            this.color.g = 0;
            this.color.b = 255;
            this.items = [];
            this.sounds['UP'] = { type: 'custom', name: 'unknown', library: 'unknown' } as Sounds;
            this.sounds['DOWN'] = { type: 'custom', name: 'unknown', library: 'unknown' } as Sounds;
            this.sounds['LEFT'] = { type: 'custom', name: 'unknown', library: 'unknown' } as Sounds;
            this.sounds['RIGHT'] = { type: 'custom', name: 'unknown', library: 'unknown' } as Sounds;
            this.sounds['ENTER'] = { type: 'custom', name: 'unknown', library: 'unknown' } as Sounds;
            this.sounds['CLOSE'] = { type: 'custom', name: 'unknown', library: 'unknown' } as Sounds;
        },
        GET_SLIDER_LABEL({ uuid }: { uuid: string }) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].uuid == uuid && this.items[i].type == 'slider') {
                    const currentValue = this.items[i].value as number;
                    const values = this.items[i].values;

                    if (values.length == 0) { return ''; }

                    if (currentValue < 0 || currentValue >= values.length) {
                        return this.FORMAT_TEXT(values[0].label || 'Unknown');
                    }

                    return this.FORMAT_TEXT(values[currentValue].label || 'Unknown');
                }
            }

            return '';
        },
        GET_CURRENT_DESCRIPTION() {
            const index = this.index || 0;

            if (index >= 0 && index < this.items.length) {
                return this.FORMAT_TEXT(this.NL2BR(this.ENSURE(this.items[index].description, ''), true, false));
            }

            return '';
        },
        ENSURE: function<T>(input: any, output: T): T {
            const inputType = typeof input;
            const outputType = typeof output;

            if (inputType == 'undefined') { return output as T; }

            if (outputType == 'string') {
                if (inputType == 'string') {
                    const isEmpty = input == null || (input as string) == 'nil' || (input as string) == '';

                    if (isEmpty) { return output as T; }

                    return input as T;
                }

                if (inputType == 'number') { return (input as number).toString() as unknown as T || output as T; }

                return output as T;
            }

            if (outputType == 'number') {
                if (inputType == 'string') {
                    const isEmpty = input == null || (input as string) == 'nil' || (input as string) == '';

                    if (isEmpty) { return output as T; }

                    return Number(input as string) as unknown as T || output as T;
                }

                if (inputType == 'number') { return input as T; }

                return output as T;
            }

            return output as T;
        },
        TEXT_COLOR: function(r: number, g: number, b: number, o: number): string {
            o = o || 1.0

            if (o > 1.0) { o = 1.0; }
            if (o < 0.0) { o = 0.0; }

            const luminance = ( 0.299 * r + 0.587 * g + 0.114 * b)/255;

            if (luminance > 0.5) {
                return `rgba(0, 0, 0, ${o})`;
            }

            return `rgba(255, 255, 255, ${o})`;
        },
        IS_DEFAULT: function(input: any): boolean {
            if (typeof input == 'string') {
                return input == null || (input as string) == 'nil' || (input as string) == '';
            }

            if (typeof input == 'number') {
                return (input as number) == 0
            }

            if (typeof input == 'boolean') {
                return (input as boolean) == false
            }

            return false;
        },
        KEY_PRESSED({ key }: { key: string }) {
            if (!this.menu || !this.show) { return; }

            const k = key as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ENTER' | 'CLOSE'

            if (typeof k == 'undefined' || k == null) {
                return
            }

            const keyRef = `KEY_${k}` as 'KEY_UP' | 'KEY_DOWN' | 'KEY_LEFT' | 'KEY_RIGHT' | 'KEY_ENTER' | 'KEY_CLOSE' | 'KEY_CLOSE_ALL';

            if (this[keyRef]) {
                this[keyRef]();
            }
        },
        RESOURCE_STOPPED({ resource }: { resource: string }) {
            if (!this.menu) { return; }

            if (this.resource == resource) {
                this.RESET_MENU();
            }
        },
        KEY_UP: function() {
            const newIndex = this.PREV_INDEX(this.index);

            if (this.index != newIndex) {
                this.index = newIndex;

                if (this.sounds['UP'] && this.sounds['UP'].type == 'native') {
                    this.POST(`https://menuv/sound`, { key: 'UP' });
                }
            }
        },
        KEY_DOWN: function() {
            const newIndex = this.NEXT_INDEX(this.index);

            if (this.index != newIndex) {
                this.index = newIndex;

                if (this.sounds['DOWN'] && this.sounds['DOWN'].type == 'native') {
                    this.POST(`https://menuv/sound`, { key: 'DOWN' });
                }
            }
        },
        KEY_LEFT: function() {
            if (this.index < 0 || this.items.length <= this.index || this.items[this.index].disabled) { return; }

            const item = this.items[this.index];

            if (item.type == 'button' || item.type == 'menu' || item.type == 'label' || item.type == 'unknown') { return; }

            switch(item.type) {
                case 'confirm':
                case 'checkbox':
                    const boolean_value = item.value as boolean;

                    this.items[this.index].value = !boolean_value;

                    if (this.sounds['LEFT'] && this.sounds['LEFT'].type == 'native') {
                        this.POST(`https://menuv/sound`, { key: 'LEFT' });
                    }

                    break;
                case 'range':
                    let new_range_index = null;
                    let range_value = item.value as number;

                    if ((range_value - 1) <= item.min) { new_range_index = item.min; }
                    else if ((range_value - 1) >= item.max) { new_range_index = item.max; }
                    else { new_range_index = (this.items[this.index].value - 1); }

                    if (new_range_index != this.items[this.index].value) {
                        this.items[this.index].value = new_range_index;

                        if (this.sounds['LEFT'] && this.sounds['LEFT'].type == 'native') {
                            this.POST(`https://menuv/sound`, { key: 'LEFT' });
                        }
                    }

                    break;
                case 'slider':
                    let new_slider_index = null;
                    const slider_value = item.value as number;
                    const slider_values = item.values || [];

                    if (slider_values.length <= 0) { return; }
                    if ((slider_value - 1) < 0 || (slider_value - 1) >= slider_values.length) { new_slider_index = (slider_values.length - 1); }
                    else { new_slider_index = (this.items[this.index].value - 1); }

                    if (new_slider_index != this.items[this.index].value) {
                        this.items[this.index].value = new_slider_index;

                        if (this.sounds['LEFT'] && this.sounds['LEFT'].type == 'native') {
                            this.POST(`https://menuv/sound`, { key: 'LEFT' });
                        }
                    }

                    break;
            }
        },
        KEY_RIGHT: function() {
            if (this.index < 0 || this.items.length <= this.index || this.items[this.index].disabled) { return; }

            const item = this.items[this.index];

            if (item.type == 'button' || item.type == 'menu' || item.type == 'label' || item.type == 'unknown') { return; }

            switch(item.type) {
                case 'confirm':
                case 'checkbox':
                    const boolean_value = item.value as boolean;

                    this.items[this.index].value = !boolean_value;

                    if (this.sounds['RIGHT'] && this.sounds['RIGHT'].type == 'native') {
                        this.POST(`https://menuv/sound`, { key: 'RIGHT' });
                    }

                    break;
                case 'range':
                    let new_range_index = null;
                    let range_value = item.value as number;

                    if ((range_value + 1) <= item.min) { new_range_index = item.min; }
                    else if ((range_value + 1) >= item.max) { new_range_index = item.max; }
                    else { new_range_index = (this.items[this.index].value + 1); }

                    if (new_range_index != this.items[this.index].value) {
                        this.items[this.index].value = new_range_index;

                        if (this.sounds['RIGHT'] && this.sounds['RIGHT'].type == 'native') {
                            this.POST(`https://menuv/sound`, { key: 'RIGHT' });
                        }
                    }

                    break;
                case 'slider':
                    let new_slider_index = null;
                    const slider_value = item.value as number;
                    const slider_values = item.values || [];

                    if (slider_values.length <= 0) { return; }
                    if ((slider_value + 1) < 0 || (slider_value + 1) >= slider_values.length) { new_slider_index = 0; }
                    else { new_slider_index = (this.items[this.index].value + 1); }

                    if (new_slider_index != this.items[this.index].value) {
                        this.items[this.index].value = new_slider_index;

                        if (this.sounds['RIGHT'] && this.sounds['RIGHT'].type == 'native') {
                            this.POST(`https://menuv/sound`, { key: 'RIGHT' });
                        }
                    }

                    break;
            }
        },
        KEY_ENTER: function() {
            if (this.index < 0 || this.items.length <= this.index || this.items[this.index].disabled) { return; }

            if (this.sounds['ENTER'] && this.sounds['ENTER'].type == 'native') {
                this.POST(`https://menuv/sound`, { key: 'ENTER' });
            }

            const item = this.items[this.index];

            switch(item.type) {
                case 'button':
                case 'menu':
                    this.POST(`https://menuv/submit`, { uuid: item.uuid, value: null, r: this.resource });
                    break;
                case 'confirm':
                    this.POST(`https://menuv/submit`, { uuid: item.uuid, value: item.value as boolean, r: this.resource });
                    break;
                case 'range':
                    let range_value = item.value as number;

                    if (range_value <= item.min) { range_value = item.min; }
                    else if (range_value >= item.max) { range_value = item.max; }

                    this.POST(`https://menuv/submit`, { uuid: item.uuid, value: range_value, r: this.resource });
                    break;
                case 'checkbox':
                    const boolean_value = item.value as boolean;

                    this.items[this.index].value = !boolean_value;

                    this.POST(`https://menuv/submit`, { uuid: item.uuid, value: this.items[this.index].value, r: this.resource });
                    break;
                case 'slider':
                    let slider_value = item.value as number;
                    const slider_values = item.values || [];

                    if (slider_values.length <= 0 || slider_value < 0 || slider_value >= slider_values.length) { return; }

                    this.POST(`https://menuv/submit`, { uuid: item.uuid, value: slider_value, r: this.resource });
                    break;
            }
        },
        KEY_CLOSE: function() {
            if (this.sounds['CLOSE'] && this.sounds['CLOSE'].type == 'native') {
                this.POST(`https://menuv/sound`, { key: 'CLOSE' });
            }

            this.POST(`https://menuv/close`, { uuid: this.uuid, r: this.resource });
            this.CLOSE_MENU({ uuid: this.uuid });
        },
        KEY_CLOSE_ALL: function() {
            if (this.sounds['CLOSE'] && this.sounds['CLOSE'].type == 'native') {
                this.POST(`https://menuv/sound`, { key: 'CLOSE' });
            }

            this.POST(`https://menuv/close_all`, { r: this.resource });
            this.RESET_MENU();
        },
        POST: function(url: string, data: object|[]) {
            var request = new XMLHttpRequest();

            request.open('POST', url, true);
            request.open('POST', url, true);
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            request.send(JSON.stringify(data));
        },
        NEXT_INDEX: function(idx: number) {
            if (idx == null || typeof idx == "undefined") { idx = this.index; }

            let index = 0;
            let newIndex = -2;

            if (this.items.length <= 0) { return -1; }

            while (newIndex < -1) {
                if ((idx + 1 + index) < this.items.length) {
                    if (!this.items[(idx + 1 + index)].disabled) {
                        newIndex = (idx + 1 + index);
                    } else {
                        index++;
                    }
                } else if (index >= this.items.length) {
                    return -1;
                } else {
                    const addIndex = (idx + 1 + index) - this.items.length;

                    if (addIndex < this.items.length) {
                        if (!this.items[addIndex].disabled) {
                            newIndex = addIndex;
                        } else {
                            index++;
                        }
                    } else {
                        index++;
                    }
                }
            }

            if (newIndex < 0) { return -1; }

            return newIndex;
        },
        PREV_INDEX: function(idx: number) {
            if (idx == null || typeof idx == "undefined") { idx = this.index; }

            let index = 0;
            let newIndex = -2;

            if (this.items.length <= 0) { return -1; }

            while (newIndex < -1) {
                if ((idx - 1 - index) >= 0) {
                    if (!this.items[(idx - 1 - index)].disabled) {
                        newIndex = (idx - 1 - index);
                    } else {
                        index++;
                    }
                } else if (index >= this.items.length) {
                    return -1;
                } else {
                    const addIndex = (idx - 1 - index) + this.items.length;

                    if (addIndex < this.items.length && addIndex >= 0) {
                        if (!this.items[addIndex].disabled) {
                            newIndex = addIndex;
                        } else {
                            index++;
                        }
                    } else {
                        index++;
                    }
                }
            }

            if (newIndex < 0) { return -1; }

            return newIndex;
        },
        NL2BR: function(text: string, replaceMode: boolean, isXhtml: boolean) {
            var breakTag = (isXhtml) ? '<br />' : '<br>';
            var replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';

            return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
        },
        FORMAT_TEXT: function(text: string) {
            text = this.ENSURE(text, '');

            text = text.replace(/\^0/g, '<span style="color: black !important;">');
            text = text.replace(/\^1/g, '<span style="color: red !important;">');
            text = text.replace(/\^2/g, '<span style="color: green !important;">');
            text = text.replace(/\^3/g, '<span style="color: yellow !important;">');
            text = text.replace(/\^4/g, '<span style="color: blue !important;">');
            text = text.replace(/\^5/g, '<span style="color: cyan !important;">');
            text = text.replace(/\^6/g, '<span style="color: purple !important;">');
            text = text.replace(/\^7/g, '<span style="color: white !important;">');
            text = text.replace(/\^8/g, '<span style="color: darkred !important;">');
            text = text.replace(/\^9/g, '<span style="color: gray !important;">');
            text = text.replace(/~r~/g, '<span style="color: red !important;">');
            text = text.replace(/~g~/g, '<span style="color: green !important;">');
            text = text.replace(/~b~/g, '<span style="color: blue !important;">');
            text = text.replace(/~y~/g, '<span style="color: yellow !important;">');
            text = text.replace(/~p~/g, '<span style="color: purple !important;">');
            text = text.replace(/~c~/g, '<span style="color: gray !important;">');
            text = text.replace(/~m~/g, '<span style="color: darkgray !important;">');
            text = text.replace(/~u~/g, '<span style="color: black !important;">');
            text = text.replace(/~o~/g, '<span style="color: orange !important;">');
            text = text.replace(/~n~/g, '<br />');
            text = text.replace(/~s~/g, '<span style="color: white !important;">');
            text = text.replace(/~h~/g, '<strong>');

            const d = new DOMParser();
            const domObj = d.parseFromString(text || "", "text/html");

            return domObj.body.innerHTML;
        }
    }
});