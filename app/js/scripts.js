$(document).ready(function () {



    var spinner = $(".spinner").spinner({
        min: 0
    });

    var sliderRange = $(".slider-range"),
        sliderMin = sliderRange.data('min');
    sliderMax = sliderRange.data('max');
    sliderStep = sliderRange.data('step');


    sliderRange.slider({
        value: 0,
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        range: 'min'
    });

    // событие отправки изображения на сервер
    $('#file-upload').fileupload({
        dataType: 'json',
        add: function (e, data) { // отправляем картинку на сервер
            data.submit();
            console.log('отправляем картинку на сервер');
        }
    }).bind('fileuploaddone', function (e, data) {

        // выводим картинку в наш документ после события загрузки картинки на сервер
        // проверим впервые ли загружается картинка, если нет очистим область вывода

        if ($('.wraper__image').length > 0) {
            $('.image-upload').remove();
        } else {
            // создаем обертку для изображения
            console.log('создаем обертку для изображения');
            $(".generate__preview").append("<div class='wraper__image'></div>");
            $(".wraper__image").append("<div class='wraper__image-bg'></div>");
        }

        // создаем элемент изображения
        var $img = $('<img>', {
            src: $("#file-upload").attr("data-url") + "files/" + data.files[0].name, // путь из данных атрибута добачной папки и имя файла из инпута
            alt: 'Основное изображение',
            title: 'Ваше изображение',
            class: 'image-upload' // добавим класс для изображения
        });

        // ждем загрузки картинки браузером
        $img.load(function () {
            // удаляем атрибуты width и height
            $(this).removeAttr("width")
                .removeAttr("height")
                .css({
                    width: "",
                    height: ""
                });

            // получаем  цифры размера изображения
            var width = $(this).width();
            var height = $(this).height();

            console.log('width= ' + width + ' height= ' + height);
            // и масштабируем его добавочным классом
            if (width > height) {
                $img.addClass('image-upload-w');
                $('.wraper__image-bg').css({
                    'height': '' + Math.round(height * 653 / width) + 'px',
                    'width': '653px'
                });
            } else {
                $img.addClass('image-upload-h');
                $('.wraper__image-bg').css({
                    'height': '534px',
                    'width': '' + Math.round(width * 534 / height) + 'px'
                });
            }
        });

        // добавляем изображение в документ
        $(".wraper__image-bg").append($img);

    });

    // событие отправки #watermark на сервер
    $('#watermark').fileupload({
        dataType: 'json',
        add: function (e, data) { // отправляем картинку на сервер
            data.submit();
            console.log('отправляем #watermark на сервер');
        }
    }).bind('fileuploaddone', function (e, data) {

        // проверим есть ли фон, если да загрузим ватемарк
        if ($('.wraper__image').length > 0) {

            // удаляем предыдущий вотемарк
            if ($('#drag').length > 0) {
                $('#drag').remove();
            }
            // создаем элемент изображения
            var $wtm = $('<img>', {
                src: $("#watermark").attr("data-url") + "files/" + data.files[0].name, // путь из данных атрибута добачной папки и имя файла из инпута
                alt: 'Основное изображение',
                title: 'Ваше изображение',
                id: 'drag',
                class: 'image-watermark ui-widget ui-widget-content' // добавим класс для изображения
            });


            // добавляем изображение в документ

            $(".wraper__image-bg").append($wtm);
            //$wtm.wrap('<div id="drag"></div>');
            $("#drag").draggable({
                containment: ".image-upload",
                scroll: false
            });
        }

    });



    $("#file-upload").change(function () {
        var file = $(this).val().split('\\').pop();
        $("#value-file").html(file);
    })

    $("#watermark").change(function () {
        var file = $(this).val().split('\\').pop();
        $("#value-watermark").html(file);
    })

    sliderRange.on("slidechange", function (event, ui) {
        $("#drag").fadeTo(200, (1 - ui.value / 100));
    });
    $(".switcher__input").on('click', function () {
        console.log(this.id);
        var drag = $("#drag");

        if (drag.parent().offset() !== undefined) {
            console.log(drag);
            switch (this.id) {
            case "switcher1":

                drag.offset({
                    top: drag.parent().offset().top,
                    left: drag.parent().offset().left
                });
                $(".spinner")[1].value = 0;
                $(".spinner")[0].value = 0;
                break
            case "switcher2":
                drag.offset({
                    top: (drag.parent().offset().top),
                    left: (drag.parent().offset().left + (drag.parent().width() - drag.width()) / 2)
                });
                $(".spinner")[1].value = 0;
                $(".spinner")[0].value = (drag.parent().width() - drag.width()) / 2;

                break
            case "switcher3":
                drag.offset({
                    top: (drag.parent().offset().top),
                    left: (drag.parent().offset().left + drag.parent().width() - drag.width())
                });
                $(".spinner")[1].value = 0;
                $(".spinner")[0].value = drag.parent().width() - drag.width();
                break
            case "switcher4":
                drag.offset({
                    top: (drag.parent().offset().top + (drag.parent().height() - drag.height()) / 2),
                    left: (drag.parent().offset().left)
                });
                $(".spinner")[1].value = ((drag.parent().height() - drag.height()) / 2);
                $(".spinner")[0].value = 0;
                break
            case "switcher5":
                drag.offset({
                    top: (drag.parent().offset().top + (drag.parent().height() - drag.height()) / 2),
                    left: (drag.parent().offset().left + (drag.parent().width() - drag.width()) / 2)
                });
                $(".spinner")[1].value = ((drag.parent().height() - drag.height()) / 2);
                $(".spinner")[0].value = ((drag.parent().width() - drag.width()) / 2);
                break
            case "switcher6":
                drag.offset({
                    top: (drag.parent().offset().top + (drag.parent().height() - drag.height()) / 2),
                    left: (drag.parent().offset().left + drag.parent().width() - drag.width())
                });
                $(".spinner")[1].value = ((drag.parent().height() - drag.height()) / 2);
                $(".spinner")[0].value = (drag.parent().width() - drag.width());
                break
            case "switcher7":
                drag.offset({
                    top: (drag.parent().offset().top + drag.parent().height() - drag.height()),
                    left: (drag.parent().offset().left)
                });
                $(".spinner")[1].value = (drag.parent().height() - drag.height());
                $(".spinner")[0].value = 0;
                break
            case "switcher8":
                drag.offset({
                    top: (drag.parent().offset().top + drag.parent().height() - drag.height()),
                    left: (drag.parent().offset().left + (drag.parent().width() - drag.width()) / 2)
                });
                $(".spinner")[1].value = (drag.parent().height() - drag.height());
                $(".spinner")[0].value = ((drag.parent().width() - drag.width()) / 2);
                break
            case "switcher9":
                drag.offset({
                    top: (drag.parent().offset().top + drag.parent().height() - drag.height()),
                    left: (drag.parent().offset().left + drag.parent().width() - drag.width())
                });
                $(".spinner")[1].value = (drag.parent().height() - drag.height());
                $(".spinner")[0].value = (drag.parent().width() - drag.width());
                break

            };
        };
    });

});