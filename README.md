# qoopido.remux #
An REM and JS based approach to responsive web design. The idea was born in late 2012 and ended in REMux and an according article which was published on CSS-Tricks.

By popular demand and due to the great feedback to the aforementioned article I decided to revamp REMux and put it in a separate repository.


## Advantages of REMux 2.0 ##
- JS part is now optional (only required if you need to react on JS events for layout changes)
- JS part is only approx. 1.7KB minified and gzipped in contrast to approx. 4KB before
- Problems with browser zoom should be eliminated once and for all
- Initialization of JS part does not need to happen in the body
- Complete set of LESS mixins included


## General Usage ##
Include remux.less from the assets directory of this repository into your projects LESS directory structure and change the two variables at the top according to your project needs. Next change your projects CSS/LESS to use the mixins provided whereever you have static "px" properties

Afterwards define your breakpoints via media queries in one of three ways (examples only) according to your project needs:


### 1. Pure CSS, no layout IDs needed ###
~~~
// mobile
@media screen and (min-width: 300px) { html { font-size: 10px; } }
@media screen and (min-width: 330px) { html { font-size: 11px; } }
@media screen and (min-width: 360px) { html { font-size: 12px; } }
@media screen and (min-width: 390px) { html { font-size: 13px; } }
@media screen and (min-width: 420px) { html { font-size: 14px; } }
@media screen and (min-width: 450px) { html { font-size: 15px; } }
@media screen and (min-width: 480px) { html { font-size: 16px; } }
@media screen and (min-width: 510px) { html { font-size: 17px; } }
@media screen and (min-width: 540px) { html { font-size: 18px; } }
@media screen and (min-width: 570px) { html { font-size: 19px; } }
@media screen and (min-width: 600px) { html { font-size: 20px; } }
@media screen and (min-width: 630px) { html { font-size: 21px; } }
@media screen and (min-width: 660px) { html { font-size: 22px; } }
@media screen and (min-width: 690px) { html { font-size: 23px; } }

// desktop
@media screen and (min-width: 700px) { html { font-size: 10px; } }
@media screen and (min-width: 770px) { html { font-size: 11px; } }
@media screen and (min-width: 840px) { html { font-size: 12px; } }
@media screen and (min-width: 910px) { html { font-size: 13px; } }
@media screen and (min-width: 980px) { html { font-size: 14px; } }
@media screen and (min-width: 1050px) { html { font-size: 15px; } }
@media screen and (min-width: 1120px) { html { font-size: 16px; } }
@media screen and (min-width: 1190px) { html { font-size: 17px; } }
@media screen and (min-width: 1260px) { html { font-size: 18px; } }
~~~


### 2. Pure CSS including layout IDs ###
~~~
// layout IDs
@media screen and (min-width: 300px) { html:after { content: "mobile"; display: none; } }
@media screen and (min-width: 700px) { html:after { content: "desktop"; display: none; } }

// mobile
@media screen and (min-width: 300px) { html { font-size: 10px; } }
@media screen and (min-width: 330px) { html { font-size: 11px; } }
@media screen and (min-width: 360px) { html { font-size: 12px; } }
@media screen and (min-width: 390px) { html { font-size: 13px; } }
@media screen and (min-width: 420px) { html { font-size: 14px; } }
@media screen and (min-width: 450px) { html { font-size: 15px; } }
@media screen and (min-width: 480px) { html { font-size: 16px; } }
@media screen and (min-width: 510px) { html { font-size: 17px; } }
@media screen and (min-width: 540px) { html { font-size: 18px; } }
@media screen and (min-width: 570px) { html { font-size: 19px; } }
@media screen and (min-width: 600px) { html { font-size: 20px; } }
@media screen and (min-width: 630px) { html { font-size: 21px; } }
@media screen and (min-width: 660px) { html { font-size: 22px; } }
@media screen and (min-width: 690px) { html { font-size: 23px; } }

// desktop
@media screen and (min-width: 700px) { html { font-size: 10px; } }
@media screen and (min-width: 770px) { html { font-size: 11px; } }
@media screen and (min-width: 840px) { html { font-size: 12px; } }
@media screen and (min-width: 910px) { html { font-size: 13px; } }
@media screen and (min-width: 980px) { html { font-size: 14px; } }
@media screen and (min-width: 1050px) { html { font-size: 15px; } }
@media screen and (min-width: 1120px) { html { font-size: 16px; } }
@media screen and (min-width: 1190px) { html { font-size: 17px; } }
@media screen and (min-width: 1260px) { html { font-size: 18px; } }
~~~


### 3. Via JS part of REMux (anywhere after remux.js include) ###
~~~
<script type="text/javascript">
	window.qoopido.remux
		.addLayout({
			mobile:  { width: 420, min: 10, max: 23 },
			desktop: { width: 980, min: 10, max: 18 }
		});
</script>
~~~

The JS variant will generate and inject a stylesheet which is more or less identical to the previous pure CSS variant.

You will only need the JS part if you have to react on font-size or layout changes in javascript (e.g. responsive images). If you require to do so simply register an event listener which will receive the current state as its first and only argument:
~~~
<script type="text/javascript">
	window.qoopido.remux
		.on('statechange', function(state) {
			console.log(state);
		});
</script>
~~



## List of current mixins ##
- font-size
- line-height
- left
- right
- top
- bottom
- width
- min-width
- height
- min-height
- margin
- margin-top
- margin-right
- margin-bottom
- margin-left
- padding
- padding-top
- padding-right
- padding-bottom
- padding-left
- border
- border-top
- border-right
- border-bottom
- border-left
- text-shadow

Let me know if you are missing a specific mixin as this is naturally a work in progress


## Dependencies ##
Requires base.js and emitter.js from my qoopido.js library which is included as a submodule in assets/vendor/qoopido.js
