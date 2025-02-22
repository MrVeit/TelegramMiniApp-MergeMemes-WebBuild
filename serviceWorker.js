let buildDirectory = "Build"
let templateDataDir = "TemplateData";

let cacheName = "MemeCache";
let buildVersion = "default";

self.addEventListener("message", (event) =>
{
  if (event && event.data.type == "INIT_BUILD_INFO")
  {
    const buildInfo = event.data.payload;

    cacheName = `${cacheName}_${buildInfo.version}_${buildInfo.buildInfo}`;

    console.log(cacheName);

    buildVersion = buildInfo.version;

    console.log(`Service Worker initialized with cache name: ${cacheName}`);
  }
});

self.addEventListener("install", function(event)
{
  console.log('service worker: install ' + buildVersion);

  event.waitUntil(
    caches.open(cacheName).then((cache) =>
    {
      return cache.addAll([
          "./",
          `index.html`,
          `index.js`,
          `buildConfigLoader.js`,
          `${buildDirectory}/TelegramMiniApp-MergeMemes-WebBuild.loader.js`,
          `${buildDirectory}/TelegramMiniApp-MergeMemes-WebBuild.data.unityweb`,
          `${buildDirectory}/TelegramMiniApp-MergeMemes-WebBuild.framework.js.unityweb`,
          `${buildDirectory}/TelegramMiniApp-MergeMemes-WebBuild.wasm.unityweb`,
          `${templateDataDir}/Background.jpg`,
          `${templateDataDir}/DesktopBackground.jpg`,
          `${templateDataDir}/favicon.ico`,
          `${templateDataDir}/ProgressBar-Background.png`,
          `${templateDataDir}/ProgressBar-Fill.png`,
          `${templateDataDir}/Fonts/Mont Heavy.otf`
        ]);
    })
    .catch((error) =>
    {
      console.error('Failed to cache files:', error);
    })
  );
});
  
self.addEventListener('activate', function(event) 
{
  console.log('service worker: Activate ' + buildVersion);

  event.waitUntil(
      caches.keys().then(function(keyList)
      {
        return Promise.all(
          keyList.map(function(key)
          {
            if (key !== cacheName)
            {
              console.log('service worker: Removing old cache', key);

              return caches.delete(key);
            }
          })
        );
      })
    );

    return self.clients.claim();
});
  
  self.addEventListener('message', function(event)
  {
    console.log('service worker: Message ' + buildVersion);

    if (event.data.title && event.data.title === 'VersionTest')
    {
      if (event.data.version !== version)
      {
        messageClient(event.source, { title: 'ReplaceWorker' });
      }
      else
      {
        messageClient(event.source, { title: 'SameVersion' });
      }
    }
  });
  
  let messageClient = async function(clientSource, message) {
    clientSource.postMessage(message);
  };
