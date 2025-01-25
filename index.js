var unityInstanceRef;
var unsubscribe;

var container = document.querySelector("#unity-container");
var progressBarContainer = document.querySelector(".progress-bar-container");
var progressBar = document.querySelector(".progress-bar");

var buildUrl = "Build";
var loaderUrl = buildUrl + "/TelegramMiniApp-MergeMemes-WebBuild.loader.js";
var config = {
    dataUrl: buildUrl + "/TelegramMiniApp-MergeMemes-WebBuild.data.unityweb",
    frameworkUrl: buildUrl + "/TelegramMiniApp-MergeMemes-WebBuild.framework.js.unityweb",
    codeUrl: buildUrl + "/TelegramMiniApp-MergeMemes-WebBuild.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Veiterio Games",
    productName: "Merge Memes",
    productVersion: "1.2.9"
};

function isMobile()
{
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

if (isMobile())
  {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

progressBarContainer.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;

script.onload = () =>
{
  createUnityInstance(document.querySelector("#unity-canvas"), config, (progress) =>
  {
    progressBar.style.width = (progress * 100) + "%";
  })
  .then((unityInstance) =>
  {
    unityInstanceRef = unityInstance;
    window.unityInstance = unityInstance;

    progressBarContainer.style.display = "none";
  })
  .catch((message) =>
  {
    console.error(message);
  });
};

document.body.appendChild(script);

window.addEventListener('load', function () 
{
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();

  console.log("Telegram Web App has been expanded to full screen");

  var version = Telegram.WebApp.version;
  var versionFloat = parseFloat(version);

  if (versionFloat >= 7.7) 
  {
    Telegram.WebApp.disableVerticalSwipes();

    console.log('Activating vertical swipe disable');
  }

  console.log(`Telegram Web App opened with version: ${version}`);
});
