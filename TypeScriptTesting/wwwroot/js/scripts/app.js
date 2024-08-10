function SubmitClosestForm(button) {
    const closestForm = $(button).closest('.modal-content').find('form');
    if (closestForm.length > 0) {
        closestForm.submit();
    }
    else {
        $("[type='submit']").hide();
    }
}
(function ($) {
    $.fn.Baladi_load_view = function (options) {
        const settings = {
            url: null,
            data: null,
            contentType: null,
            dataType: null,
            processData: null,
            traditional: null,
            methodtype: 'GET',
            target: "",
            appendtype: 'replace',
            modalTitle: "",
            popupHasSave: false,
            success: function () { },
            beforeSend: function () {
                $('.preloader.checking').show();
            },
            complete: function () {
                $('.preloader.checking').hide();
            }
        };
        if (options) {
            $.extend(settings, options);
        }
        const request_settings = {
            cache: false,
            url: settings.url,
            type: settings.methodtype,
            data: settings.data,
            contentType: settings.contentType,
            dataType: settings.dataType,
            processData: settings.processData,
            traditional: settings.traditional,
            beforeSend: settings.beforeSend,
            complete: settings.complete
        };
        try {
            const requestxhr = $.ajax(request_settings);
            requestxhr.done(function (response, status, xhr) {
                if (settings.appendtype === 'replace') {
                    $(settings.target).empty().html(response);
                }
                else if (settings.appendtype === 'inside') {
                    $(settings.target).append(response);
                }
                else if (settings.appendtype === 'after') {
                    $(settings.target).after(response);
                }
                else if (settings.appendtype === 'before') {
                    $(settings.target).before(response);
                }
                else if (settings.appendtype === 'html') {
                    return response;
                }
                else if (settings.appendtype === 'popup') {
                    showPopup(response, settings.modalTitle, settings.popupHasSave);
                }
                if (typeof settings.success === 'function') {
                    settings.success.call(this);
                }
            });
            requestxhr.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                let obj;
                try {
                    obj = jQuery.parseJSON(XMLHttpRequest.responseText);
                    console.error(obj.Message);
                }
                catch (e) {
                    console.error("Error parsing response: ", XMLHttpRequest.responseText);
                }
            });
        }
        catch (e) {
            console.error(e.message);
        }
        return this;
    };
    function showPopup(response, modalTitle, popupHasSave) {
        const modalId = 'modal-' + Date.now();
        const previousModal = $('.modal.fade.show');
        const modal = $(`<div class="modal fade" tabindex="-1" role="dialog" id="${modalId}"></div>`);
        const modalDialog = $('<div class="modal-dialog modal-lg" role="document"></div>');
        const modalContent = $('<div class="modal-content"></div>');
        const modalHeader = $(`<div class="modal-header"><h5 class="modal-title">${modalTitle}</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`);
        const modalBody = $('<div class="modal-body"></div>').html(response);
        let modalFooter;
        if (popupHasSave === true && response.includes('form')) {
            modalFooter = $('<div class="modal-footer flex-row-reverse"><button type="button" class="btn btn-secondary" data-dismiss="modal">إغلاق</button><button type="submit" onclick="SubmitClosestForm(this)" class="btn btn-primary">حفظ</button></div>');
        }
        else {
            modalFooter = $('<div class="modal-footer flex-row-reverse"><button type="button" class="btn btn-secondary" data-dismiss="modal">إغلاق</button></div>');
        }
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.append(modalContent);
        modal.append(modalDialog);
        const drop = $('.modal-backdrop');
        if (previousModal.length) {
            const currentZIndex = parseInt(drop.css('z-index'), 10);
            const newZIndex = currentZIndex + 31;
            drop.css('z-index', newZIndex);
        }
        modal.on('hidden.bs.modal', function () {
            const currentZIndex = parseInt(drop.css('z-index'), 10);
            const newZIndex = currentZIndex - 31;
            $('.modal-backdrop').css('z-index', newZIndex);
            $(`#${modalId}`).remove();
        });
        modal.modal('show');
        modal.on('shown.bs.modal', function () {
            const drop = $('.modal-backdrop');
            const currentZIndex = parseInt(drop.first().css('z-index'), 10);
            $(`#${modalId}`).css('z-index', currentZIndex + 1);
        });
    }
    $.fn.Baladi_call_action = function (options) {
        const settings = {
            url: null,
            data: null,
            contentType: null,
            dataType: null,
            async: true,
            processData: false,
            traditional: null,
            methodtype: 'POST',
            showSuccessmsg: true,
            beforeSend: null,
            success: function (data) { },
            error: function (err) {
                HandleError(err);
            },
            complete: null,
            invalidCallback: function (data) {
                HandleError(data);
            }
        };
        if (options) {
            $.extend(settings, options);
        }
        const request_settings = {
            async: settings.async,
            cache: false,
            url: settings.url,
            type: settings.methodtype,
            data: settings.data,
            contentType: settings.contentType,
            processData: settings.processData,
            dataType: settings.dataType,
            traditional: settings.traditional,
            beforeSend: function (jqXHR) {
                if (typeof options.beforeSend === 'function') {
                    options.beforeSend(jqXHR, settings);
                }
                else {
                    $('.preloader.checking').show();
                }
            },
            success: function (response) {
                if (response.isError) {
                    if (settings.invalidCallback)
                        settings.invalidCallback(response);
                }
                else {
                    if (settings.success)
                        settings.success(response);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $('.preloader.checking').hide();
                const response = xhr.responseJSON || JSON.parse(xhr.responseText || '{}');
                console.error(response || errorThrown);
                if (settings.error)
                    settings.error(response);
            },
            complete: function (jqXHR) {
                if (typeof options.complete === 'function') {
                    options.complete(jqXHR, settings);
                }
                else {
                    $('.preloader.checking').hide();
                }
            }
        };
        try {
            $.ajax(request_settings);
        }
        catch (e) {
            console.error(e.message);
        }
        return this;
    };
    function HandleError(data) {
        $('#errorModal').remove();
        $('.preloader.checking').hide();
        $('body').append(data.popup);
        $('#errorModal').modal('show');
    }
})(jQuery);
//# sourceMappingURL=app.js.map