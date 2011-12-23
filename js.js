function $()
{
    var elements = new Array();

    for (var i = 0; i < arguments.length; i++)
    {
        var element = arguments[i];
        if (typeof element == 'string')
        {
            if (document.getElementById)
                element = document.getElementById(element);
            else if (document.all)
                element = document.all[element];
        }
        if (arguments.length == 1)
            return element;
        elements.push(element);
    }
    return elements;
}

function set(option, value)
{
    localStorage[option] = value;
}

function get(option, defaultValue)
{
    if(localStorage[option] == null)
    {
        localStorage[option] = defaultValue;
        return defaultValue;
    }
    return localStorage[option];
}

function loadOptions()
{
    var blockerEnabled = get("blockerEnabled", false)
    var blockedMessage = get("blockText", "Shouldn't you be working?")
    var keyLength = get("keyLength", 15)
    var blacklist = JSON.parse(get("blacklist", "[]"))

    var status = blockerEnabled == "true" ? "Disable" : "Enable"
    var status = blockerEnabled == "true" ? "Disable" : "Enable"

    $("statusText").innerHTML = "Status: " + (blockerEnabled == "true" ? "Enabled" : "Disabled")
    $("statusButton").innerHTML = blockerEnabled == "true" ? "Disable" : "Enable"
    $("blockText").value = blockedMessage
    $("keyLength").value = keyLength
    $("blacklist").value =  blacklist.toString().replace(/,/g,'\n')

    $("blockText").disabled = blockerEnabled == "true"
    $("keyLength").disabled = blockerEnabled == "true"
    $("blacklist").disabled = blockerEnabled == "true"
    $("saveBlacklist").disabled = blockerEnabled == "true"

}

function toggleStatus()
{
    var status = get("blockerEnabled", false) == "true" ? false : true
    // if disabling, send to disable.html to enter code
    if(status == false)
        location.href="disable.html?url=options.html";
    else
        set("blockerEnabled", status)
}

function save()
{
    d = $('blacklist').value;
    var domainsArray = d.split('\n');
    
    for(i = 0; i < domainsArray.length; i++)
    {
        if(domainsArray[i]=='')
        {
            domainsArray.splice(i,1);
            i--;
        }
    }

    set("blacklist", JSON.stringify(domainsArray));
    set("blockText", $('blockText').value);
    set("keyLength", isNaN($('keyLength').value) ? 15 : $('keyLength').value);
}

function gup(name)
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}

function makeCode(len)
{
    var text = "";
    var possible = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789_";

    for(var i=0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}