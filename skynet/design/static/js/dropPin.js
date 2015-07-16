/*!
 * dropPin - because image maps are icky
 * http://duncanheron.github.com/dropPin/
 *
 */
(function($) {
    $(document).keyup(function(e){
        if(e.which ==  27 || e.keyCode == 27){
            $('span.pin.tmp').remove();
            $('div.popover').remove();
        }
    })
    $.fn.dropPin = function(method) {
        var defaults = {
            fixedHeight: $('#img_design').height(),
            fixedWidth: $('#img_design').width(),
            dropPinPath: '/js/dropPin/',
            pin: 'dropPin/default_pin.png',
            xoffset: 10,
            yoffset: 30, //need to change this to work out icon heigh/width then subtract margin from it
            cursor: 'crosshair',
            pinclass: '',
            userevent: 'click',
            hiddenXid: '#xcoord', //used for saving to db via hidden form field
            hiddenYid: '#ycoord', //used for saving to db via hidden form field
            pinX: false, //set to value if you pass pin co-ords to overirde click binding to position
            pinY: false, //set to value if you pass pin co-ords to overirde click binding to position
            pinDataSet: '', //array of pin coordinates for front end render
            afterpin: function(x, y, pin) {
                // $('#pin_form').modal();
                // calc pixel to percent
                var xval = Math.round(x / $('#img_design').width() * Math.pow(10, 7)) / Math.pow(10, 7);
                var yval = Math.round(y / $('#img_design').height() * Math.pow(10, 7)) / Math.pow(10, 7);
                $('#div_id_x').hide();
                $('#div_id_y').hide();
                $('#id_category').val('')
                $('#id_msg').val('')
                var placement = 'right';
                if(x > $('#img_design').width() - 400){
                    placement = 'left';
                }
                pin.popover({
                    'content': $('#pin_form').html(),
                    'placement': placement,
                    'html': true
                }).popover('show');
                $('.popover form input[name="x"]').val(xval);
                $('.popover form input[name="y"]').val(yval);
            },
            clickpin: function(id) {
                $.get('/design/pin/' + id, function(data) {
                    $('#pin_detail .modal-body').html(data);
                    $('#pin_detail form').attr('data-id', id);
                    $('#pin_detail').modal();
                });
            }
        }

        var methods = {
            init: function(options) {

                var options = $.extend(defaults, options);
                var thisObj = this;

                this.css({
                    'background-repeat': 'no-repeat',
                    'cursor': options.cursor,
                    'background-color': options.backgroundColor,
                    'height': options.fixedHeight,
                    'width': options.fixedWidth
                });
                var i = 10;
                thisObj.on(options.userevent, function(ev) {
                    if ($(ev.target).attr('id') == 'img_design') {
                        i = i + 10;
                        var $img = $(thisObj);
                        var offset = $img.offset();
                        var x = ev.pageX - offset.left;
                        var y = ev.pageY - offset.top;

                        var xval = (x - options.xoffset);
                        var yval = (y - options.yoffset);

                        var pinC = $('<span class="pin tmp">&nbsp;</span>')
                        pinC.css('top', yval + 'px');
                        pinC.css('left', xval + 'px');
                        pinC.css('z-index', i);
                        $('span.pin.tmp').remove();
                        $('div.popover').remove();
                        pinC.appendTo(thisObj);
                        if (options.afterpin != null) {
                            options.afterpin(xval, yval, pinC);
                        }
                    }
                });
            },
            showPins: function(options) {
                var options = $.extend(defaults, options);

                this.css({
                    'cursor': options.cursor,
                    'background-color': options.backgroundColor,
                    'height': options.fixedHeight,
                    'width': options.fixedWidth
                });
                if (typeof(options.pinDataSet) == 'string') {
                    var this_img = this;
                    $.get(options.pinDataSet, function(data) {
                        for (var i = 0; i < (data).markers.length; i++) {
                            var dataPin = data.markers[i];

                            dataPin.xcoord = dataPin.xcoord * $('#img_design').width();
                            dataPin.ycoord = dataPin.ycoord * $('#img_design').height();

                            var imgC = $('<span class="pin ' + options.pinclass + '" >'+dataPin.number+'</span>');
                            imgC.css('top', dataPin.ycoord + 'px');
                            imgC.css('left', dataPin.xcoord + 'px');
                            imgC.css({
                                'cursor': 'pointer'
                            });
                            imgC.attr('data-id', dataPin.id);
                            imgC.attr('src', options.pin);
                            imgC.attr('title', dataPin.title);
                            imgC.click(function(e) {
                                if (options.clickpin != null)
                                    options.clickpin($(this).attr('data-id'));
                            });
                            imgC.appendTo(this_img);
                        }
                    }, 'json');
                } else {
                    var data = options.pinDataSet
                    for (var i = 0; i < (data).markers.length; i++) {
                        var dataPin = data.markers[i];

                        dataPin.xcoord = dataPin.xcoord * $('#img_design').width();
                        dataPin.ycoord = dataPin.ycoord * $('#img_design').height();

                        var imgC = $('<span class="pin ' + options.pinclass + '" >'+dataPin.number+'</span>');
                        imgC.css('top', dataPin.ycoord + 'px');
                        imgC.css('left', dataPin.xcoord + 'px');
                        imgC.css({
                            'cursor': 'pointer'
                        });
                        imgC.attr('data-id', dataPin.id);
                        imgC.attr('src', options.pin);
                        imgC.attr('title', dataPin.title);
                        imgC.click(function(e) {
                            if (options.clickpin != null) {
                                options.clickpin($(this).attr('data-id'));
                            }
                        });
                        imgC.appendTo(this);
                    }
                }
            },
            clickPin: function(id) {
                defaults.clickpin(id);
            }
        }

        if (methods[method]) {

            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        } else if (typeof method === 'object' || !method) {

            return methods.init.apply(this, arguments);

        } else {

            alert("method does not exist");

        }


    }

})(jQuery);