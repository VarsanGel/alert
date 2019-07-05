var parts = window.location.href.split("/");
check();
function check()
{
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", 'http://'+parts[2]+'/game/index.php?page=eventList&ajax=1',true);
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4) {
            var events = Array();
            var content = document.createElement('div');
            content.innerHTML = xmlhttp.responseText.replace(/<script(.|\s)*?\/script>/g, '');

            for (i=0; i < content.getElementsByTagName('table')[0].getElementsByTagName('tr').length; i++) {
                var row = content.getElementsByTagName('table')[0].getElementsByTagName('tr')[i];
                if (row.innerHTML.match(/\b hostile \b/) != null) {
                    var get_id = /counter-eventlist-([0-9]*)/g;

                    var event_id = get_id.exec(row.innerHTML)[1];
                    var get_time = new RegExp('\\$\\("#counter-eventlist-' + event_id + '"\\),([0-9]+)\\)');
                    var event_time = get_time.exec(xmlhttp.responseText)[1];

                    events.push({
                        id: event_id,
                        time: event_time
                    });
                }
            };

            chrome.extension.sendMessage({events: events}, function(response) {
                window.setTimeout('check()', response.interval * 1000);
            })
        }
    }

    xmlhttp.send(null);
};