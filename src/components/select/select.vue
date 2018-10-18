<template>
    <div class="form-inline relative">
        <button class="btn select-btn dropdown-btn" :class="{'open':showDrop}" ref="trigger" :style="buttonStyle"
                @click="showDrop=!showDrop">
            <slot name="button" :default-key="defaultKey">
                <span>{{defaultKey}}</span>
                <em class="menu-arrow" :class="showDrop ? 'icon-angle-up' : 'icon-angle-down'"></em>
            </slot>
        </button>

        <ul :class="listClass" v-show="showDrop" ref="menu" :style="listStyle">
            <template v-if="hasSearch">
                <div class="line">
                    <div class="relative lineH30">
                        <input type="text" v-model="keyword" @input="searchHandler"
                               style="border: none; border-bottom: 1px solid #eee;height: 30px;" placeholder="输入搜索内容">
                        <div class="search-btn" @click="searchHandler" style="bottom: 2px;">
                            <i class="icon-search2 vm"></i>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="multiple">
                <li
                    v-for="(option,index) in options"
                    :key="index"
                    class="pl10 pr10 multiple"
                    :title="option[keys.disabled]?disabledTip : ''"
                    :class="{'disabled':option[keys.disabled]}"
                    v-bind="option.bindObj || {}">
                    <div class="checkbox-con">
                        <input type="checkbox" :disabled="option[keys.disabled]" @change="changeMultiple"
                               :value="option[keys.value]" v-model="selecteds">
                        <i></i>
                    </div>
                    <slot name="checkboxLabel" :item="option">
                        <label class="inline-block normal">{{option[keys.label]}}</label>
                    </slot>
                </li>
            </template>
            <template v-else>
                <li
                    v-for="(option,index) in options"
                    :key="index"
                    :class="option[keys.label]==defaultKey ? 'active' : ''"
                    @click="select(option[keys.value],option[keys.label],option)"
                    v-bind="option.bindObj || {}">
                    <span v-if="showOptionTitle" :title="option[keys.label]">{{option[keys.label]}}</span>
                    <span v-else>{{option[keys.label]}}</span>
                </li>
            </template>
            <template>
                <slot name="content"></slot>
            </template>
            <template>
                <slot name="footer"></slot>
            </template>
        </ul>

    </div>
</template>
<script>
    export default {
        name: 'Select',
        created() {
            let self = this;
            let keys = self.keys;
            if (self.multiple) {
                self.defaultKey = self.placeholder;
                if (self.defaultValue.length > 0) {
                    self.selecteds = self.defaultValue;
                }
            } else if (self.defaultValue) {
                self.defaultKey = self.placeholder;
                self.options.forEach(function (option) {
                    if (option[keys.value] == self.defaultValue) {
                        self.defaultKey = option[keys.label];
                    }
                })
            } else {
                self.defaultKey = self.placeholder;
            }
        },
        mounted: function () {

        },
        watch: {
            showDrop: function (newVal) {
                if (newVal) {
                    let self = this;
                    let trigger = this.$refs.trigger;
                    let menu = this.$refs.menu;
                    if (self.showDrop && self.type < 2) {
                        self._closeEvent = self.listen(window, 'click', function (ev) {
                            if (!trigger.contains(ev.target) && !menu.contains(ev.target)) {
                                self.showDrop = false;
                                self._closeEvent.remove();
                            }
                        })
                    }
                }
            },
            defaultValue: function (newVal) {
                let self = this;
                let keys = self.keys;
                if (self.multiple) {
                    if (newVal.length > 0) {
                        self.selecteds = newVal;
                    }
                } else if (newVal) {
                    self.defaultKey = self.placeholder;
                    self.options.forEach(function (option) {
                        if (option[keys.value] == newVal) {
                            self.defaultKey = option[keys.label];
                            return
                        }
                    })
                } else {
                    self.defaultKey = self.options[0][keys.label];
                }
            },
            placeholder(val) {
                if (this.customContent) {
                    this.defaultKey = val;
                }
            },
            options: function (newVal) {
                let self = this;
                let keys = self.keys;
                if (!self.multiple) {
                    if (newVal) {
                        self.defaultKey = self.placeholder;
                        newVal.forEach(function (option) {
                            if (option[keys.value] == self.defaultValue) {
                                self.defaultKey = option[keys.label];
                                return
                            }
                        })
                    } else {
                        self.defaultKey = self.placeholder;
                    }
                }
            }
        },
        beforeDestroy: function () {
            if (this._closeEvent) {
                this._closeEvent.remove();
            }
        },
        data: function () {
            return {
                showDrop: false,
                defaultKey: '',
                menuEnter: false,
                selecteds: [],
                keyword: ''
            }
        },
        props: {
            defaultValue: [String, Boolean, Number, Array],
            options: Array,
            field: String,
            type: {
                type: Number,
                default: 1
            },
            multiple: {
                type: Boolean,
                default: false
            },
            hasCheckbox: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '自定义'
            },
            width: String,
            listWidth: String,
            hasSearch: {
                type: Boolean,
                default: false
            },
            keys: {
                type: Object,
                default: () => {
                    return {
                        value: 'value',
                        label: 'key',
                        disabled: 'ban'
                    }
                }
            },
            listCls: {
                type: String,
                default: ''
            },
            disabledTip: {
                type: String,
                default: ''
            },
            showOptionTitle: {
                type: Boolean,
                default: false
            },
            customContent: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            buttonStyle() {
                let style = {};
                if (this.width) {
                    style.width = this.width;
                }
                if (this.hasSearch) {
                    style.minWidth = '200px';
                }
                return style
            },
            listStyle() {
                let style = {};
                if (this.listWidth) {
                    style.width = this.listWidth;
                }
                return style
            },
            listClass() {
                let {customContent, listCls} = this;
                let base = customContent ? 'dropdown-menu' : 'options';
                return listCls ? `${listCls}` : `${base}`
            }
        },
        methods: {
            listen: function (target, event, cb) {
                if (target.addEventListener) {
                    target.addEventListener(event, cb, false);
                    return {
                        remove: function () {
                            target.removeEventListener(event, cb, false);
                        }
                    }
                } else {
                    target.attachEvent('on' + event, cb);
                    return {
                        remove: function () {
                            target.detachEvent('on' + event, cb);
                        }
                    }
                }
            },
            select: function (val, key, item) {
                let field = this.field;
                this.showDrop = false;
                if (this.defaultKey !== key) {
                    this.defaultKey = key;
                    this.$emit('change', {field: field, value: val, item: item});
                }
            },
            triggerMouseLeave: function () {
                let me = this;
                setTimeout(function () {
                    if (!me.menuEnter) {
                        me.showDrop = false;
                    }
                }, 200)
            },
            menuMouseEnter: function () {
                let me = this;
                me.menuEnter = true;
            },
            menuMouseLeave: function () {
                let me = this;
                me.menuEnter = false;
                me.showDrop = false;
            },
            changeMultiple() {
                let me = this;
                let _arr = [];
                let obj = {};
                if (me.selecteds.length > 0) {
                    me.options.forEach(function (val) {
                        me.selecteds.forEach(function (select) {
                            if (select == val[me.keys.value]) {
                                let _obj = {};
                                _obj.label = val[me.keys.label];
                                _obj.value = val[me.keys.value];
                                _arr.push(_obj)
                            }
                        })
                    });
                }
                obj.select = me.selecteds;
                obj.selectObj = _arr;
                me.$emit('change', obj)
            },
            searchHandler() {
                this.keyword = this.keyword.replace(/^\s+/g, '').replace(/\s+/g, ' ');
                let obj = {keyword: this.keyword};
                this.$emit('search', obj)
            }
        }

    }
</script>