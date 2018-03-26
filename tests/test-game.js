// simule une partie

// simulate mouse click (https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript)

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

var clicks = [[3,13],[4,14],[14,12],[12,14],[3,15],[5,13],[13,15],[11,13],[2,10],[6,14],[14,10],[10,14],[1,11],[7,13],[13,13],[11,11],[7,13],[8,14],[16,12],[10,10],[5,13],[5,11],[11,13],[1,11],[3,9],[9,11],[15,13],[3,9],[0,12],[6,10],[13,9],[3,15],[6,10],[7,11],[10,10],[0,12],[2,12],[14,12],[14,14],[2,10],[2,14],[12,12],[12,14],[2,12],[3,11],[4,10],[13,11],[3,13],[1,13],[9,13],[10,14],[2,14],[9,13],[10,12],[11,11],[1,13],[9,11],[15,13],[15,11],[3,11]]; // coordonnées des cases à cliquer

for (var i=0, max = clicks.length; i<max; i++) {
  setTimeout(simulate,100*i,ID[clicks[i][0]][clicks[i][1]], "click");
}
