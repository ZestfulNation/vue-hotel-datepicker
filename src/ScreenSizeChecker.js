const screenSizeChecker = {
    install(Vue) {
        if (!this.hasOwnProperty('event')) {
            this.event = new Vue();
        }

        Vue.mixin({
            data() {
                return {
                    screenSize: this.handleWindowResize(),
                };
            },

            methods: {
                handleWindowResize() {
                    let screenSizeInEm = window.innerWidth / parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);

                    if (screenSizeInEm < 31) {
                        this.screenSize = 'smartphone';
                    }
                    else if (screenSizeInEm > 30 && screenSizeInEm < 49) {
                        this.screenSize = 'tablet';
                    }
                    else if (screenSizeInEm > 48) {
                        this.screenSize = 'desktop';
                    }

                    return this.screenSize;
                },

                // Check if the page height has changed
                onElementHeightChange(el, callback){
                    let lastHeight = el.clientHeight;
                    let newHeight = lastHeight;

                    (function run(){
                        newHeight = el.clientHeight;

                        if( lastHeight !== newHeight ){
                            callback();
                        }

                        lastHeight = newHeight;

                        if( el.onElementHeightChangeTimer ) {
                            clearTimeout(el.onElementHeightChangeTimer);
                        }

                        el.onElementHeightChangeTimer = setTimeout(run, 1000);
                    })();
                },

                emitHeighChangeEvent() {
                    screenSizeChecker.event.$emit('heightChanged');
                }
            },

            mounted() {
                window.addEventListener('resize', this.handleWindowResize);

                this.onElementHeightChange(document.body, () => {
                    this.emitHeighChangeEvent();
                });
            },

            beforeDestroy: function () {
                window.removeEventListener('resize', this. handleWindowResize);
            },

        });
    }
};

export default screenSizeChecker;
