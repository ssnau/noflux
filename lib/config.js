var win = typeof window !== 'undefined' ? window : {__noflux_env: 'production'};
module.exports = {
    muteConsole: false,
    isDev: () => win.__noflux_env !== 'production'
};
