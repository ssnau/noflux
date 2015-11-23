'use strict';

var win = typeof window !== 'undefined' ? window : { __noflux_env: 'production' };
module.exports = {
    muteConsole: false,
    isDev: function isDev() {
        return win.__noflux_env !== 'production';
    }
};