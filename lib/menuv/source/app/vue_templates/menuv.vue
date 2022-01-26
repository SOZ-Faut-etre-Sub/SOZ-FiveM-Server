<!--
----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Version: 1.0.0
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
-->
<template>
  <div id="menuv" class="menuv" :class="[{'hide': !show || !menu}, position, size, theme]" :data-uuid="uuid">
    <v-style>
      html,
      body {
        color: {{TEXT_COLOR(color.r, color.g, color.b)}};
      }

      .menuv.{{theme}} .menuv-header {
        background: url("https://nui-img/{{dictionary}}/{{texture}}") no-repeat;
        background-size: 100%;
      }

      .menuv.{{theme}} .menuv-header .menuv-bg-icon i,
      .menuv.{{theme}} .menuv-header .menuv-bg-icon svg {
        color: rgb({{color.r}},{{color.g}},{{color.b}});
      }

      .menuv.{{theme}} .menuv-subheader {
        background-color: rgb({{color.r}},{{color.g}},{{color.b}});
      }

      .menuv.{{theme}} .menuv-items .menuv-item.active {
        padding: 0.25em 0.5em;
        background-color: rgba({{color.r}},{{color.g}},{{color.b}}, .6);
        color: {{TEXT_COLOR(color.r, color.g, color.b)}};
      }

      .menuv.{{theme}} .menuv-items .menuv-item.active i,
      .menuv.{{theme}} .menuv-items .menuv-item.active svg {
        color: {{TEXT_COLOR(color.r, color.g, color.b)}};
      }

      .menuv.{{theme}} .menuv-items .menuv-item.active span.menuv-icon {
        border-right: 1px solid {{TEXT_COLOR(color.r, color.g, color.b)}};
      }

      .menuv.{{theme}} .menuv-items input[type="range"]::-webkit-slider-runnable-track {
        background: rgba({{color.r}},{{color.g}},{{color.b}}, 0.50);
        box-shadow: 0px 0px 0px {{TEXT_COLOR(color.r, color.g, color.b, 0.50)}};
        border: 0px solid {{TEXT_COLOR(color.r, color.g, color.b, 0.50)}};
      }

      .menuv.{{theme}} .menuv-items input[type="range"]::-webkit-slider-thumb {
        border: 1px solid rgb({{color.r}},{{color.g}},{{color.b}});
        background: rgb({{color.r}},{{color.g}},{{color.b}});
        box-shadow: 0px 0px 0px {{TEXT_COLOR(color.r, color.g, color.b, 0.50)}};
      }

      .menuv.{{theme}} .menuv-items .menuv-item.active input[type="range"]::-webkit-slider-thumb {
        background: {{TEXT_COLOR(color.r, color.g, color.b)}} !important;
        border: 1px solid {{TEXT_COLOR(color.r, color.g, color.b, 0.50)}} !important;
      }

      .menuv.{{theme}} .menuv-items .menuv-item.active input[type="range"]::-webkit-slider-runnable-track,
      .menuv.{{theme}} .menuv-items .menuv-item.active input[type="range"]:focus::-webkit-slider-runnable-track {
        background: {{TEXT_COLOR(color.r, color.g, color.b, 0.50)}} !important;
      }

      .menuv.{{theme}} .menuv-items input[type="range"]:focus::-webkit-slider-runnable-track {
        background: rgba({{color.r}},{{color.g}},{{color.b}}, 0.50);
      }

      .menuv.{{theme}} .menuv-items .menuv-desc {
        border-left: 0.375em solid rgb({{color.r}},{{color.g}},{{color.b}});
      }
    </v-style>
    <header class="menuv-header">
      <strong v-html="FORMAT_TEXT(title)"></strong>
    </header>
    <nav class="menuv-subheader" v-html="FORMAT_TEXT(subtitle)"></nav>
    <ul class="menuv-items" ref="items">
      <li class="menuv-item media" v-for="item in items" :key="item.uuid" :class="[{'active': (index + 1) == item.index, 'hasIcon': ENSURE(item.icon, 'none') != 'none', 'disabled': item.disabled }, (`menuv-${item.type}`)]" :index="(item.index - 1)">
        <div class="media-left item-icon" v-if="ENSURE(item.icon, 'none') != 'none'">
          <span class="menuv-icon">{{ENSURE(item.icon, 'none')}}</span>
        </div>
        <div class="media-content flex-left item-title" v-html="FORMAT_TEXT(item.label)"></div>
        <div class="media-right">
          <i v-if="item.type == 'checkbox'" :class="{'fas fa-check': item.value, 'far fa-square': !item.value}"></i>
          <input type="range" :min="item.min" :max="item.max" :value="(item.value)" v-if="item.type == 'range'">
          <span class="menuv-options" v-if="item.type == 'confirm'">
            <span class="menuv-btn" :class="{'active': item.value}">YES</span>
            <span class="menuv-btn" :class="{'active': !item.value}">NO</span>
          </span>
          <span class="menuv-label" v-if="item.type == 'label'" v-html="FORMAT_TEXT(item.value)"></span>
          <span class="menuv-options" v-if="item.rightLabel">
            <span class="item-title" v-html="FORMAT_TEXT(item.rightLabel)"></span>
          </span>
          <span class="menuv-options" v-if="item.type == 'slider'">
            <i class="fas fa-chevron-left"></i>
            <span v-html="GET_SLIDER_LABEL({ uuid: item.uuid })"></span>
            <i class="fas fa-chevron-right"></i>
          </span>
        </div>
      </li>
    </ul>
    <footer class="menuv-description" :class="{'hide': IS_DEFAULT(GET_CURRENT_DESCRIPTION())}">
      <strong v-html="GET_CURRENT_DESCRIPTION()"></strong>
    </footer>
  </div>
</template>

<script lang="ts" src="./../menuv.ts"></script>
