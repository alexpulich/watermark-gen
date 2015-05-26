$(document).ready(function () {



    var spinnerX = $("#spinnerX").spinner({min: 0}),
        spinnerY = $("#spinnerY").spinner({min: 0});

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
        var strFiles = "files/",
            $img = $('<img>', {
            src: $("#file-upload").attr("data-url") + strFiles + data.files[0].name, // путь из данных атрибута добачной папки и имя файла из инпута
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
            var width = $(this).width(),
                height = $(this).height(),
                boxHeight = $('.wraper__image').height(),
                boxWidth = $('.wraper__image').width();

            console.log(boxHeight);
            console.log(boxWidth);

            // и масштабируем его добавочным классом
            if (width > height) {
                $img.addClass('image-upload-w');
                $('.wraper__image-bg').css({
                    'height': '' + Math.round(height * boxWidth / width) + 'px',
                    'width': boxWidth+'px'
                });
            } else {
                $img.addClass('image-upload-h');
                $('.wraper__image-bg').css({
                    'height': boxHeight+'px',
                    'width': '' + Math.round(width * boxHeight / height) + 'px'
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
            var strFiles = "files/", // переменная два раза появляется  в модуле должна быть скрытой глобальной для
                $wtm = $('<img>', {
                src: $("#watermark").attr("data-url") + strFiles + data.files[0].name, // путь из данных атрибута добачной папки и имя файла из инпута
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
                scroll: false,
                drag: function() {
                    spinnerX.spinner( "value", 15 );
                    }
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


});
