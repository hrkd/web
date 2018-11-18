<template>
  <div id="app">
    <!--div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div-->
    <div id="content">
      <h1>HRKD.NET</h1>
    <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
  $mq-tb: 667px;

  @mixin mq_sp {
    @media only screen and (max-width: $mq-tb) {
      @content;
    }
  }

  @mixin mq_without_sp {
    @media only screen and (min-width: $mq-tb + 1) {
      @content;
    }
  }

  html {
    height: 100%;
    background: '#222222';
  }
  body {
    margin: 0;
    padding: 0;
    position: relative;
    height: 100%;

    &> iframe {
      position: fixed;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
  }

  h1, h2, h3, h4, h5, h6 {
      font-family: 'PT Sans', sans-serif;
      font-style: italic;
      font-weight: bold;
      letter-spacing: 1pt;
      margin-top: 1.6em;
      margin-bottom: .8em;
      &:after {
        content: '';
        display: inline-block;
        min-height: 2px;
        min-width: 10px;
        background: #FFC729;
      }
  }

  #app {
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 2;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: fixed;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #eee;

    #content {
      width: 90vw;
      padding-bottom: 2em;
      @include mq_without_sp(){
        width: 500px;
      }
      text-align: left;
      margin: 0 auto;

      a {
        color:#FFC729;
      }

      h1 {
        font-size: 36px;
        &:after {
          height: 5px;
          width: 20px;
        }
      }

      h2 {
        font-size: 18px;
        &:after {
          height: 3px;
          width: 10px;
        }
      }

      h3 {
        font-size: 14px;
        &:after {
          display: none;
        }
      }

      p,li {
        color: #aaa;
        font-size: 13px;
        line-height: 1.8em;

        span {
          color: #666;
          margin: 0 1em;
        }
      }

      ul {
        margin: 0 0 0 1em;
        padding: 0;

        li {
          line-height: 1.6em;
          margin-bottom: 0.6em;
        }
      }
    }
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
