// using jQuery CSRF

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
// alert(csrftoken);

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
    // or any other URL that isn't scheme relative or absolute i.e relative.
    !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$(function(){
    // this the form for pin
    $('#pin_form form').submit(function(e){
        var id = $(this).attr('data-id');
        e.preventDefault();
        $.post(
            $('#pin_form form').attr('action'), 
            $('#pin_form form').serialize(),
            function(data){
                $('#map').dropPin('showPins', {
                    pin: '/static/images/default_pin.png',
                    pinDataSet: '/design/' + id + '/'
                });
                $('#pin_form').modal('hide');
            }
        );
    });
    $(document).on('submit','#pin_detail form',function(e){
        e.preventDefault();
        var id = $(this).attr('data-id');
        $.post(
            $('#pin_detail form').attr('action'),
            $('#pin_detail form').serialize(),
            function(){
                $('#map').dropPin('clickPin', id);
            }
        );
    });
});
