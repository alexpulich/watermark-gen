var createWatermark = (function(){

    function _setUpListeners(){
        $("form").on("submit", _submitForm);
        $("form").on("click", ".generate__form-row", _removeError);
    }
    // Обработка отправки запроса на обработку формы
    function _submitForm(e){
        e.preventDefault();

        var form = $(this);
        if (_validateForm(form) === false) {
            return false;
        };

        var url = form.attr("action"),
            img = $("#value-file").html(),
            watermark = $("#value-watermark").html(),
            x = $("#spinnerX").val(),
            y = $("#spinnerY").val(),
            opancity = $("#opancity").attr('data-val'),
            widthimg = $('.wraper__image-bg').width(),
            heightimg = $('.wraper__image-bg').height(),
            data = {'img': img, 'watermark' : watermark, 'x': x, 'y': y, 'opancity': opancity, "widthImg" : widthimg, "heightImg" : heightimg};

        var defObject = _ajaxForm(data, url);

        if (defObject) {
            defObject.done(function(ans){
                var status = ans.status,
                    fille = ans.filename;

                $.fileDownload("server/download.php", {
                    httpMethod: "POST",
                    data: ans
                })
            });
        }
    }

    function _validateForm(form){
        var inputFile = form.find('.input-file'),
            valid = true;
        $.each(inputFile, function(index, val) {
            var inputFile = $(val),
                val = inputFile.val(),
                formUpload = inputFile.closest(".generate__form-row").find('.generate__form-upload');

            if (formUpload.html() === ""){
                formUpload.tooltip({
                    content: "Выберете файл",
                    position: "bottom"
                });
                valid = false;
            } else {
                var name = formUpload.attr("id");
                return $('.tooltip[data-tooltip="' + name + '"]').remove();
            }
        });
        console.log(valid);
        return valid;
    }

    // Удаление ошибки
    function _removeError(){
        var name = $(this).find('.generate__form-upload').attr("id");
        $('.tooltip[data-tooltip="' + name + '"]').remove();
    }

    // Ajax передача данных
    function _ajaxForm(data, url){
        return $.ajax({
            url:url,
            type:"POST",
            dataType: 'json',
            data: data
        }).fail(function() {
        return console.log("Проблемы с php");
        })
    }

    return {
        // Инициализация модуля
        init: function(){
            _setUpListeners();
        }
    }
})();

if ($('.generate__form').length){
    createWatermark.init();
}

