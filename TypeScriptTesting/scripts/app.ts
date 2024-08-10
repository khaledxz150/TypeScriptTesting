
interface JQuery {
    Baladi_call_action(options: BaladiCallActionOptions): JQuery;
    Baladi_load_view: (options: BaladiLoadViewOptions) => JQuery;

}

interface JQueryStatic {
    Baladi_call_action(options: BaladiCallActionOptions): JQueryStatic;
    Baladi_load_view(options: BaladiLoadViewOptions): JQueryStatic;
}
interface BaladiLoadViewOptions {
    url: string | null;
    data?: any;
    contentType?: string | null;
    dataType?: string | null;
    processData?: boolean | null;
    traditional?: boolean | null;
    methodtype?: string;
    target?: string;
    appendtype?: string;
    modalTitle?: string;
    popupHasSave?: boolean;
    success?: () => void;
    beforeSend?: () => void;
    complete?: () => void;
}

interface BaladiCallActionOptions {
    url: string | null;
    data?: any;
    contentType?: string | null;
    dataType?: string | null;
    async?: boolean;
    processData?: boolean;
    traditional?: boolean | null;
    methodtype?: string;
    showSuccessmsg?: boolean;
    beforeSend?: (jqXHR: JQueryXHR, settings: BaladiCallActionOptions) => void;
    success?: (data: any) => void;
    error?: (err: any) => void;
    complete?: (jqXHR: JQueryXHR, settings: BaladiCallActionOptions) => void;
    invalidCallback?: (data: any) => void;
}

function SubmitClosestForm(button: HTMLElement): void {
    const closestForm = $(button).closest('.modal-content').find('form');
    if (closestForm.length > 0) {
        closestForm.submit();
    } else {
        $("[type='submit']").hide();
    }
}

(function ($: JQueryStatic) {
    $.fn.Baladi_load_view = function (options: BaladiLoadViewOptions) {
        const settings: BaladiLoadViewOptions = {
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

        const request_settings: JQueryAjaxSettings = {
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

            requestxhr.done(function (response: string, status: JQuery.Ajax.SuccessTextStatus, xhr: JQuery.jqXHR) {
                if (settings.appendtype === 'replace') {
                    $(settings.target).empty().html(response);
                } else if (settings.appendtype === 'inside') {
                    $(settings.target).append(response);
                } else if (settings.appendtype === 'after') {
                    $(settings.target).after(response);
                } else if (settings.appendtype === 'before') {
                    $(settings.target).before(response);
                } else if (settings.appendtype === 'html') {
                    return response;
                } else if (settings.appendtype === 'popup') {
                    showPopup(response, settings.modalTitle, settings.popupHasSave);
                }

                if (typeof settings.success === 'function') {
                    settings.success.call(this);
                }
            });

            requestxhr.fail(function (XMLHttpRequest: JQuery.jqXHR, textStatus: JQuery.Ajax.ErrorTextStatus, errorThrown: string) {
                let obj: any;
                try {
                    obj = jQuery.parseJSON(XMLHttpRequest.responseText);
                    console.error(obj.Message);
                } catch (e) {
                    console.error("Error parsing response: ", XMLHttpRequest.responseText);
                }
            });
        } catch (e) {
            console.error((e as Error).message);
        }

        return this;
    };

    function showPopup(response: string, modalTitle: string | undefined, popupHasSave: boolean | undefined): void {
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
        } else {
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

    $.fn.Baladi_call_action = function (options: BaladiCallActionOptions) {
        const settings: BaladiCallActionOptions = {
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
            success: function (data: any) { },
            error: function (err: any) {
                HandleError(err);
            },
            complete: null,
            invalidCallback: function (data: any) {
                HandleError(data);
            }
        };

        if (options) { $.extend(settings, options); }

        const request_settings: JQueryAjaxSettings = {
            async: settings.async,
            cache: false,
            url: settings.url,
            type: settings.methodtype,
            data: settings.data,
            contentType: settings.contentType,
            processData: settings.processData,
            dataType: settings.dataType,
            traditional: settings.traditional,
            beforeSend: function (jqXHR: JQueryXHR) {
                if (typeof options.beforeSend === 'function') {
                    options.beforeSend(jqXHR, settings);
                } else {
                    $('.preloader.checking').show();
                }
            },
            success: function (response: any) {
                if (response.isError) {
                    if (settings.invalidCallback) settings.invalidCallback(response);
                } else {
                    if (settings.success) settings.success(response);
                }
            },
            error: function (xhr: JQueryXHR, textStatus: JQuery.Ajax.ErrorTextStatus, errorThrown: string) {
                $('.preloader.checking').hide();
                const response = xhr.responseJSON || JSON.parse(xhr.responseText || '{}');
                console.error(response || errorThrown);
                if (settings.error) settings.error(response);
            },
            complete: function (jqXHR: JQueryXHR) {
                if (typeof options.complete === 'function') {
                    options.complete(jqXHR, settings);
                } else {
                    $('.preloader.checking').hide();
                }
            }
        };

        try {
            $.ajax(request_settings);
        } catch (e) {
            console.error((e as Error).message);
        }

        return this;
    };

    function HandleError(data: any): void {
        $('#errorModal').remove();
        $('.preloader.checking').hide();
        $('body').append(data.popup);
        $('#errorModal').modal('show');
    }
})(jQuery);