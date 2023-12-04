<!-- svelte-ignore css-unused-selector -->
<script>
import config from '$lib/config';
</script>

<style lang="scss">
@font-face {
  font-family: ibm_vga;
  src: url(/WebPlus_IBM_VGA_8x16.woff) format("woff");
  src: url(/PxPlus_IBM_VGA_8x16.ttf) format("truetype");
  font-weight: 400;
}

a {
  color: #ee64ae;
  text-shadow: 0 0 0.5px #ee64ae;
  transition: 0.1s color, 0.1s text-shadow;
  cursor: pointer;
}
a:hover {
  color: #f075b7;
  text-shadow: 0 0 2px #ee64ae;
}
b {
  font-weight: normal;
  text-shadow: 0 0 1px currentColor;
  transition: 0.1s color, 0.1s text-shadow;
}

b {
  color: #ffffff;
}

.black {
  color: #46465c;
}
b.black {
  color: #634560;
}
.red {
  color: #e95678;
}
b.red {
  color: #ec6a88;
}
.green {
  color: #29d398;
}
b.green {
  color: #3fdaa4;
}
.yellow {
  color: #fab795;
}
b.yellow {
  color: #fbc3a7;
}
.blue {
  color: #26bbd9;
}
b.blue {
  color: #3fc6de;
}
.magenta {
  color: #ee64ae;
}
b.magenta {
  color: #f075b7;
}
.cyan {
  color: #59e3e3;
}
b.cyan {
  color: #6be6e6;
}
.white {
  color: #fdf0ed;
}
b.white {
  color: #ffffff;
}

.black-bg {
  background-color: #46465c;
}
.red-bg {
  background-color: #e95678;
}
.green-bg {
  background-color: #29d398;
}
.yellow-bg {
  background-color: #fab795;
}
.blue-bg {
  background-color: #26bbd9;
}
.magenta-bg {
  background-color: #ee64ae;
}
.cyan-bg {
  background-color: #59e3e3;
}
.white-bg {
  background-color: #fdf0ed;
}
.bright-black-bg {
  background-color: #634560;
}
.bright-red-bg {
  background-color: #ec6a88;
}
.bright-green-bg {
  background-color: #3fdaa4;
}
.bright-yellow-bg {
  background-color: #fbc3a7;
}
.bright-blue-bg {
  background-color: #3fc6de;
}
.bright-magenta-bg {
  background-color: #f075b7;
}
.bright-cyan-bg {
  background-color: #6be6e6;
}
.bright-white-bg {
  background-color: #ffffff;
}

.red, .green, .yellow, .blue, .magenta, .cyan {
  text-shadow: 0 0 0.5px currentColor;
}

.blinker {
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  0% {
    opacity: 1;
  }
  49.9% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.command {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
}
.commandsymbol {
  flex: 0 0 auto;
}

.silentlink {
  color: inherit;
  text-decoration: none;
  text-shadow: none;
}

.commandline {
  font-size: 16px;
  font-family: NotoEmoji-Regular, ibm_vga, monospace;
  background-color: #17101a;
  color: #e6dedc;
  padding: 2em;
}
</style>

<div class="command commandline">
  <span>
    <!-- UPDATEME The following line determines the text in the command line in the header -->
    <a href="/" class="silentlink">{config.subDomain}.</a><a href="{config.rootURL}" class="silentlink">{config.rootDomain}</a>
  </span>
  <div class="green commandsymbol">λ</div>
  <span><slot/></span>
  <span class="blinker">█</span>
</div>