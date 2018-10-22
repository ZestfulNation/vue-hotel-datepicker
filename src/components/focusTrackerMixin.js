export default {
  data() {
    return {
      activeElement: null
    };
  },

  methods: {
    focusChanged (event) {
      this.activeElement = event.target.id;
    },
  },

  watch: {
    activeElement(e) {
      // console.log(e);
      // this.activeElement = e;
    }
  },

  mounted() {
    document.addEventListener('focusin', this.focusChanged);
  },

  destroyed() {
    document.removeEventListener('focusin', this.focusChanged);
  },
};