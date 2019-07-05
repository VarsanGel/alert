var audioElement = new Audio();

function openOptions()
{
    var id = chrome.i18n.getMessage("@@extension_id") + "/options.html";
    chrome.tabs.getAllInWindow( undefined, function(tabs)
    {
        for( var i = 0, tab; tab = tabs[ i ]; i++)
        {
            if( tab.url && tab.url.indexOf( id ) != -1 )
            {
                chrome.tabs.update( tab.id, {selected: true} );
                return;
            }
        }
        chrome.tabs.create( {'url': chrome.extension.getURL( 'options.html' ) },
            function( tab )
            {
            }
        );
    });
}

function show() {
    var notification = webkitNotifications.createNotification(
        'ogame-48.png',
        'Someone is attacking you in OGame',
        'Contact me at chrome.dev@digitalform.ro for problems or suggestions.'
    );

    notification.show();

    if (localStorage.sound != '')
    {
        if (localStorage.sound == 'custom')
        {
            source = localStorage.audio_raw;
        }
        else
        {
            source = localStorage.sound;
        }

        if (navigator.platform.toLowerCase().indexOf("linux") != -1 || !audioElement.src || audioElement.src.indexOf(source) == -1) {
          audioElement.src = source;
        }

        if (localStorage.loop)
        {
            audioElement.loop = true;
        }
        audioElement.play();
    }

    notification.onclose = function ()
    {
        audioElement.pause();
    }

    if (localStorage.auto_hide != 0) {
        setTimeout(function () {
            notification.cancel();
            audioElement.pause();
        }, localStorage.auto_hide * 1000);
    }
}

if (!webkitNotifications) {
    chrome.tabs.create({url: 'error.html'});
}

if (!localStorage.init) {
    localStorage.init = true;
    localStorage.interval = 60;
    localStorage.auto_hide = 0;
    localStorage.sound = 'ding.ogg';
    localStorage.alert_on = 1;
    localStorage.loop = 0;
    localStorage.audio_raw = false;

    openOptions();
};

var events_notified = Array();

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        var alerted = false;


        sendResponse({
            interval: localStorage.interval
        });

        for (i in request.events)
        {
            console.log(request.events[i]);
            if (!events_notified[request.events[i].id] && (request.events[i].time >= 180 || (request.events[i].time < 180 && localStorage.alert_on == 2)))
            {
                events_notified[request.events[i].id] = true;

                if (!alerted)
                {
                    alerted = true;
                    show();
                }
            }
        }
    }
);

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-25389296-6']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

