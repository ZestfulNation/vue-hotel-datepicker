<template lang="html">
<div>
  <div v-highlightjs v-if='this.sourceCode.length'>
    <code :class="this.lang" v-text='sourceCode'></code>
  </div>
  <div v-highlightjs v-if='this.inlineCode'>
    <code :class="this.lang" v-text='inlineCode'></code>
  </div>
</div>
</template>

<script>
import { get } from 'axios';

export default {
  name: 'Snippet',

  data() {
    return {
      sourceCode: [],
    }
  },

  props: {
    sourcePath: {
      type: String
    },
    inlineCode: {
      type: String
    },
    lang: {
      type: String,
      default: 'html'
    }
  },

  mounted(){
    if (this.sourcePath) {
      get(this.sourcePath)
      .then(response => {
        this.sourceCode = response.data
      })
      .catch(e => {
        console.error(e)
      })
    }
  }
}
</script>

<style lang="scss">
.html {
  .hljs-name {
    color: #ff79c6;
  }
}

.hljs {
  display: block;
  overflow-x: auto;
  padding: 16px;
  background: #282a36;
  white-space: pre;
}

.hljs-built_in,
.hljs-selector-tag,
.hljs-section,
.hljs-link {
  color: #8be9fd;
}

.hljs-keyword {
  color: #ff79c6;
}

.hljs,
.hljs-subst {
  color: #f8f8f2;
}

.hljs-title {
  color: #50fa7b;
}

.hljs-string,
.hljs-meta,
.hljs-name,
.hljs-type,
.hljs-attr,
.hljs-symbol,
.hljs-bullet,
.hljs-addition,
.hljs-variable,
.hljs-template-tag,
.hljs-template-variable {
  color: #f1fa8c;
}

.hljs-comment,
.hljs-quote,
.hljs-deletion {
  color: #6272a4;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-title,
.hljs-section,
.hljs-doctag,
.hljs-type,
.hljs-name,
.hljs-strong {
  font-weight: bold;
}

.hljs-literal,
.hljs-number {
  color: #bd93f9;
}

.hljs-emphasis {
  font-style: italic;
}
</style>
