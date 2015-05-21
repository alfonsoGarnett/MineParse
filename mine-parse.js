<!DOCTYPE HTML>
<html>
<head>
  <title>MineParse Demo</title>
  <link rel="stylesheet" href="style/style.css">
  <script src="js/mine-parse.js"></script>
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js"></script>
</head>
<body>
<div id="mainContainer">
  <h1> MineParse </h1>
  <div id="inputContainer">
      <div class="containerLabel">
          <i class="fa fa-pencil-square"></i>
          Input
      </div>
      <textarea id="input">
§nMinecraft Formatting

§r§00 §11 §22 §33
§44 §55 §66 §77
§88 §99 §aa §bb
§cc §dd §ee §ff
    
§r§0k §kMinecraft
§rl §lMinecraft
§rm §mMinecraft
§rn §nMinecraft
§ro §oMinecraft
§rr §rMinecraft
      </textarea>
      <button id="parse">
          <i class="fa fa-angle-right"></i>
          Parse
      </button>
  </div>
  <div id="inBetween"></div>
  <div id="outputContainer">
      <div class="containerLabel">
          <i class="fa fa-eye"></i>
          Output <span id="parseTime"></span>
      </div>
      <div id="output"></div>
  </div>
  <script>
    var input = document.getElementById('input'),
        output = document.getElementById('output'),
        parseBtn = document.getElementById('parse'),
        parseTime = document.getElementById('parseTime'),
        outputContainer = document.getElementById('outputContainer'),
        scrollInterval;

    parseBtn.onclick = function () {
      var parseStart = Date.now(),
          result = mineParse( input.value ),
          scroll = document.body.scrollTop;
      parseTime.innerHTML = '~ ' + ( (Date.now() - parseStart) / 1000 ) + ' seconds';
      output.innerHTML = '';
      if(window.innerWidth < 850) {
        scrollInterval = setInterval(function () {
            scroll += 5;
            window.scrollTo(0, scroll);
            if(scroll >= outputContainer.offsetTop) {
                window.scrollTo(0, outputContainer.offsetTop);
                output.appendChild( result.parsed );
                clearInterval(scrollInterval);
            }
        }, 0);
      } else {
          output.appendChild( result.parsed );
      }
    };
  </script>
</div>
</body>
</html>
