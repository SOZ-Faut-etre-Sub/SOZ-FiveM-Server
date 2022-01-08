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
import { CreateElement } from 'vue/types/umd';

export default VUE.component('v-style', {
    render: function(createElement: CreateElement) {
        return createElement('style', this.$slots.default);
    }
});