var watermark = (function () {

    var spinnerX = $("#spinnerX").spinner({
            min: 0,
            spin: function (e, ui) {
                if (ui.value < ($(".wraper__image-bg").width() - $("#drag").width() + 1)) {
                    $('#drag').css('left', ui.value + 'px');
                } else {
                    //если пытаемся выйти за границы подложки по координате х - вернуться в начало
                    $('#drag').css('left', '0px');
                    $(this).spinner("value", 0);
                    return false;
                };
            }
        }),
        spinnerY = $("#spinnerY").spinner({
            min: 0,
            spin: function (e, ui) {
                if (ui.value < ($(".wraper__image-bg").height() - $("#drag").height() + 1)) {
                    $('#drag').css('top', ui.value + 'px');
                } else {
                    //если пытаемся выйти за границы подложки по координает у - вернуться в начало
                    $('#drag').css('top', '0px');
                    $(this).spinner("value", 0);
                    return false;
                };
            }
        }),
        sliderRange = $(".slider-range");


    sliderRange.slider({
        value: 0,
        min: sliderRange.data('min'),
        max: sliderRange.data('max'),
        step: sliderRange.data('step'),
        range: 'min',
        animate: false,
        slide: function (event, ui) {
            $(".slider-range").attr('data-val', ui.value);
            $("#drag").fadeTo(0, (1 - ui.value / 100));

        }
    });

    function _setUpListeners() { // начало прослушки событий

        // событие отправки изображения на сервер
        $('#file-upload').fileupload({
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 150000,
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
            add: function (e, data) { // отправляем картинку на сервер
                data.submit();
                console.log('отправляем картинку на сервер');
            },
            done: function (e, data) {
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
                        boxWidth = $('.wraper__image').width(),
                        f = boxWidth / boxHeight,
                        setResize = function (classCss, h, w) {
                            $img.addClass(classCss);

                            $('.wraper__image-bg').css({
                                'height': h + 'px',
                                'width': w + 'px'
                            });
                        };

                    //и масштабируем его добавочным классом
                    if ((width < boxWidth) && (height < boxHeight)) {
                        setResize('', height, width);
                    } else if (f < width / height) {
                        setResize('image-upload-w ', Math.round(boxWidth * height / width), boxWidth);

                    } else {
                        setResize('image-upload-h ', boxHeight, Math.round(boxHeight * width / height));
                    }

                });

                // добавляем изображение в документ
                $(".wraper__image-bg").prepend($img);
            }
        });
        // конец события отправки изображения на сервер

        // событие отправки #watermark на сервер
        $('#watermark').fileupload({
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 150000,
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
            add: function (e, data) { // отправляем картинку на сервер
                data.submit();
                console.log('отправляем #watermark на сервер');
            },
            done: function (e, data) {
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


                    // по умолчанию новый вотемарк находится слева вверху
                    spinnerX.spinner("value", 0);
                    spinnerY.spinner("value", 0);

                    // выполняем drageble и отслеживаем и выводим координаты вотемарка
                    $("#drag").draggable({
                        containment: ".image-upload",
                        scroll: false,
                        drag: function () {
                            spinnerY.spinner("value", parseInt($('#drag').css('top')));
                            spinnerX.spinner("value", parseInt($('#drag').css('left')));
                        }
                    });


                }

            }
        });
        // конец события отправки #watermark на сервер
        $("#file-upload").change(function () {
            var file = $(this).val().split('\\').pop(),
                extfile = file.split('.').pop();
            $("#value-file").html(file);
        });

        $("#watermark").change(function () {
            var file = $(this).val().split('\\').pop();
            $("#value-watermark").html(file);
        });
        // очищение по кнопке сброс - кроме стандартных действий reset с элементами формы
        $(".generate__form-btn-reset").on('click', function () {
            $('#value-file').empty(); // удаляем содержимое дива - имя файла подложки
            $('#value-watermark').empty(); // удаляем содержимое дива - имая файла вотемарк
            $(".wraper__image").remove(); // удаляем обертку обоих картинок со всем содержимым
            sliderRange.slider("value", 0); // устанавливаем прозрачность в ноль
        });
        //обработка нажатия на кнопки позиционирования
        $(".switcher__input").on('click', function () {
            var drag = $("#drag");

            if (drag.parent().offset() !== undefined) {
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
                    $(".spinner")[0].value = parseInt((drag.parent().width() - drag.width()) / 2);

                    break
                case "switcher3":
                    drag.offset({
                        top: (drag.parent().offset().top),
                        left: (drag.parent().offset().left + drag.parent().width() - drag.width())
                    });
                    $(".spinner")[1].value = 0;
                    $(".spinner")[0].value = parseInt(drag.parent().width() - drag.width());
                    break
                case "switcher4":
                    drag.offset({
                        top: (drag.parent().offset().top + (drag.parent().height() - drag.height()) / 2),
                        left: (drag.parent().offset().left)
                    });
                    $(".spinner")[1].value = parseInt((drag.parent().height() - drag.height()) / 2);
                    $(".spinner")[0].value = 0;
                    break
                case "switcher5":
                    drag.offset({
                        top: (drag.parent().offset().top + (drag.parent().height() - drag.height()) / 2),
                        left: (drag.parent().offset().left + (drag.parent().width() - drag.width()) / 2)
                    });
                    $(".spinner")[1].value = parseInt((drag.parent().height() - drag.height()) / 2);
                    $(".spinner")[0].value = parseInt((drag.parent().width() - drag.width()) / 2);
                    break
                case "switcher6":
                    drag.offset({
                        top: (drag.parent().offset().top + (drag.parent().height() - drag.height()) / 2),
                        left: (drag.parent().offset().left + drag.parent().width() - drag.width())
                    });
                    $(".spinner")[1].value = parseInt((drag.parent().height() - drag.height()) / 2);
                    $(".spinner")[0].value = parseInt(drag.parent().width() - drag.width());
                    break
                case "switcher7":
                    drag.offset({
                        top: (drag.parent().offset().top + drag.parent().height() - drag.height()),
                        left: (drag.parent().offset().left)
                    });
                    $(".spinner")[1].value = parseInt(drag.parent().height() - drag.height());
                    $(".spinner")[0].value = 0;
                    break
                case "switcher8":
                    drag.offset({
                        top: (drag.parent().offset().top + drag.parent().height() - drag.height()),
                        left: (drag.parent().offset().left + (drag.parent().width() - drag.width()) / 2)
                    });
                    $(".spinner")[1].value = parseInt(drag.parent().height() - drag.height());
                    $(".spinner")[0].value = parseInt((drag.parent().width() - drag.width()) / 2);
                    break
                case "switcher9":
                    drag.offset({
                        top: (drag.parent().offset().top + drag.parent().height() - drag.height()),
                        left: (drag.parent().offset().left + drag.parent().width() - drag.width())
                    });
                    $(".spinner")[1].value = parseInt(drag.parent().height() - drag.height());
                    $(".spinner")[0].value = parseInt(drag.parent().width() - drag.width());
                    break


                };
            };
        });


    }; //конец прослушки событий

    return {
        init: function () {
            _setUpListeners();
        }
    }



})();

watermark.init();