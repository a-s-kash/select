require('../css/all-any-style.css');

var $ = require('jquery');
var jQuery = require('jquery');

window.$ = $;
window.jQuery = jQuery;

var selectize = require('selectize');
window.selectize = selectize;

var editInputs = {
    edit: function (country, city, totel) {

        this.filterInputs.countryInput.val(false);
        this.filterInputs.cityInput.val(false);
        this.filterInputs.hotelInput.val(false);

        if(country){
            this.filterInputs.countryInput.val(true);
        } else if(city){
            this.filterInputs.cityInput.val(true);
        } else if(totel){
            this.filterInputs.hotelInput.val(true);
        }

    },
    init: function () {
        this.filterInputs.countryInput = $("#sletat_ru_tour_search_short_form_country");
        this.filterInputs.cityInput = $("#sletat_ru_tour_search_short_form_city");
        this.filterInputs.hotelInput = $("#sletat_ru_tour_search_short_form_hotel");
    },
    filterInputs: {
        countryInput: $('<div></div>'),
        cityInput: $('<div></div>'),
        hotelInput: $('<div></div>')
    }
};

$("#sletat_ru_tour_search_short_form_countryTo").selectize({
    load: function(query, callback) {
        var countDropdownList = $(".selectize-dropdown-content .option").length;

        if(countDropdownList == '0' && query.length > 2){

            $.ajax({
                url: '/search/to/filter/selectize/' + query,
                type: 'GET',
                dataType: 'json',
                error: function() {
                    callback();
                },
                success: function(res) {

                    callback(res.res);
                    switch (res.typeDirection) {
                        case 'country':
                            editInputs.edit(true, false, false);
                            break;
                        case 'city':
                            editInputs.edit(false, true, false);
                            break;
                        case 'hotel':
                            editInputs.edit(false, false, true);
                            break;
                        default :
                            editInputs.edit(false, false, false);
                            break;
                    }
                }
            });
        } else if (countDropdownList > 0){
            editInputs.edit(true, false, false);
        }
    }
});

var MainSearchShortFormFunctions2 = {
    init: function () {

        var dataElements = {
            amount: {
                input: $("#sletat_ru_tour_search_short_form_adults"),
                html_content: $("#SLBlockFieldAdultsAndChild"),
                input_content: $("#SLBlockInputContentAmount"),
                counter: $("<div></div>"),
                plus: $("<span></span>"),
                minus: $("<span></span>"),
                output: $("<div></div>"),
                button_add_child: $("<div></div>"),
                button_add_child_for_on_click: $("<div></div>"),
                agesList: $("<div></div>"),

                amountInt: 2,
                setOutput: function (amountInt) {

                    if (amountInt < 1) {
                        amountInt = 1;
                    } else if (amountInt > 4) {
                        amountInt = 4;
                    }

                    switch (amountInt) {
                        case 1:
                            dataElements.amount.input_content.html('1 человек');
                            dataElements.amount.output.html('1 взрослый');
                            dataElements.amount.input.val(1);
                            break;
                        case 2:
                        case 3:
                        case 4:
                            dataElements.amount.input_content.html(amountInt + ' человека');
                            dataElements.amount.output.html(amountInt + ' взрослых');
                            dataElements.amount.input.val(amountInt);
                            break;
                    }
                    dataElements.amount.amountInt = amountInt;
                    return amountInt;
                },
                makeAgesBlock: function () {
                    var amount_kids_ages_list = $("<div></div>");
                    amount_kids_ages_list.addClass('tourists-amount__kids-ages-list');
                    for (var i = 0; i < 14; i++) {
                        var ageItem = $("<div></div>");
                        ageItem.addClass('tourists-amount__age-item');
                        var sageItemNum =  $("<span></span>");
                        sageItemNum.addClass('tourists-amount__age-item-num');
                        ageItem.html(sageItemNum);
                        amount_kids_ages_list.append(ageItem);
                        var ageItemName = '';
                        switch (ageItem) {
                            case 1:
                                ageItemName = 'год';
                                break;
                            case 2:
                            case 3:
                            case 4:
                                ageItemName = 'года';
                                break;
                            case 0:
                            default :
                                ageItemName = 'лет';
                                break;
                        }
                        sageItemNum.text(i + ' ' + ageItemName);
                        sageItemNum.data('age-item-num', i);
                    }
                    dataElements.amount.agesList = amount_kids_ages_list;
                    $('.tourists-amount__age-item-num').on('click', function () {
                        $(this).data('age-item-num');
                        var amountSelected = $("<div></div>");
                        var amountSelectedItem = $("<div></div>");
                        var amountSelectedItemDelete = $("<span></span>");

                        amountSelected.addClass('tourists-amount__selected-kids');
                        amountSelectedItem.addClass('tourists-amount__selected-kids-item');
                        amountSelectedItemDelete.addClass('tourists-amount__delete-child-btn');

                        amountSelectedItem.text('Ребенок, ' + $(this).text());
                        amountSelectedItem.append(amountSelectedItemDelete);
                        amountSelected.append(amountSelectedItem);
                    });
                }
            },
            nights: {
                setItem: function (num) {

                    if(num < 1){
                        num = 1;
                    } else if (num > 29) {
                        num = 29;
                    }

                    var night = 'ночь';
                    if((num > 1 && num < 5) || (num > 21 && num < 25)){
                        night = 'ночи';
                    } else if (num > 5 && num !== 21){
                        night = 'ночей';
                    }
                    var interval = $("#sletat_ru_tour_search_short_form_include_nights_interval");

                    var nightsInterval = '';

                    if(interval.serialize() !== ''){
                        nightsInterval = $("<span></span>");
                        nightsInterval.addClass('nights-amount__included-interval-text');
                        nightsInterval.addClass('nights-amount__included-interval-text_opened');
                        nightsInterval.text('± 2');
                    }

                    var nightsText = $('.nights-amount__nights-text');
                    nightsText.text(num + ' ' + night);
                    nightsText.append(nightsInterval);
                    dataElements.nights.input.val(num);
                    return num;
                },
                input: $("#sletat_ru_tour_search_short_form_nights"),
                amountInt: 2
            },
            form: $("form[name=\"sletat_ru_tour_search_short_form\"]"),
            generateActionUrm: function () {
                console.log(this.form.serializeArray());
                return '';
            }
        };

        dataElements.amount.html_content.html('');

        MainSearchShortFormFunctions2.load_settings(dataElements);
        MainSearchShortFormFunctions2.load_on_clicks(dataElements);

    },

    load_settings: function (dataElements) {

        // dataElements.amount.content.addClass('tourists-amount__content');
        dataElements.amount.counter.addClass('tourists-amount__adults-counter');
        dataElements.amount.plus.html('+');
        dataElements.amount.minus.html('-');

        dataElements.amount.setOutput(2);
        dataElements.amount.counter.append(dataElements.amount.minus);
        dataElements.amount.counter.append(dataElements.amount.output);
        dataElements.amount.counter.append(dataElements.amount.plus);

        dataElements.amount.button_add_child.addClass('on-move-tooltip');
        dataElements.amount.button_add_child.addClass('on-move-tooltip_tourists-amount');

        dataElements.nights.amountInt = dataElements.nights.setItem(dataElements.nights.amountInt);
    },
    closeAll: function(dataElements){
        $(".directions").removeClass('uikit-select_opened');

        $(".departure-dates").removeClass('departure-dates_opened');

        $(".nights-amount").removeClass('nights-amount_opened');
        $('.nights-amount__content').removeClass('nights-amount__content_opened');

        $(".tourists-amount").removeClass('tourists-amount_opened');
        dataElements.amount.html_content.removeClass('active');
        dataElements.amount.html_content.html('');
    },
    load_on_clicks: function (dataElements) {

        this.load_on_click_functions.amount(dataElements);

        $(".nights-amount__nights-text").on('click', function () {

            var nightsBlock = $(".nights-amount");
            if (!nightsBlock.hasClass('nights-amount_opened')) {
                MainSearchShortFormFunctions2.closeAll(dataElements);
                nightsBlock.addClass('nights-amount_opened');
                $('.nights-amount__content').addClass('nights-amount__content_opened');
            } else {
                MainSearchShortFormFunctions2.closeAll(dataElements);
            }
        });

        $('.nights-amount__control-buttons_opened span').on('click', function () {
            var mathOperation = $(this).text();
            var amountInt = dataElements.nights.amountInt;
            if(mathOperation == '+'){
                amountInt++;
            } else {
                amountInt--;
            }
            dataElements.nights.amountInt = dataElements.nights.setItem(amountInt);
        });

        $("#sletat_ru_tour_search_short_form_include_nights_interval").on('click', function () {
            dataElements.nights.amountInt = dataElements.nights.setItem(dataElements.nights.amountInt);
        });

        $(".departure-dates").on('click', function () {

            var departureDatesBlock = $(".departure-dates");
            if (!departureDatesBlock.hasClass('departure-dates_opened')) {
                MainSearchShortFormFunctions2.closeAll(dataElements);
                departureDatesBlock.addClass('departure-dates_opened');
            } else {
                MainSearchShortFormFunctions2.closeAll(dataElements);
            }
        });

        $(".directions").on('click', function () {

            var departureBlock = $(".directions");
            if (!departureBlock.hasClass('uikit-select_opened')) {
                MainSearchShortFormFunctions2.closeAll(dataElements);
                departureBlock.addClass('uikit-select_opened');
            }
        });

        dataElements.form.submit(function (e) {

            var arr = dataElements.form.serializeArray();

            var pre = {
                departureFrom: arr[0].value,
                departureTo: arr[1].value,
                departureDate: arr[2].value,
                nights: arr[3].value
            };

            if(arr[4].name === "sletat_ru_tour_search_short_form[include_nights_interval]"){
                pre.adults = arr[5].value;
                pre.nights += '+2';
            } else {
                pre.adults = arr[4].value
            }

            var link = '/searchFromFilter/' + pre.departureTo + '/' + pre.departureDate + '/' + pre.nights + '/' + pre.adults;

            document.location.href = link;

            return false;
        });
    },
    load_on_click_functions: {
        amount: function (dataElements) {
            dataElements.amount.input_content.on('click', function () {
                if (dataElements.amount.html_content.hasClass('active')) {
                    MainSearchShortFormFunctions2.closeAll(dataElements);
                } else {
                    MainSearchShortFormFunctions2.closeAll(dataElements);
                    $(".tourists-amount").addClass('tourists-amount_opened');
                    dataElements.amount.html_content.addClass('active');
                    dataElements.amount.html_content.append(dataElements.amount.counter);
                    dataElements.amount.html_content.append(dataElements.amount.button_add_child);

                    dataElements.amount.plus.on('click', function () {
                        dataElements.amount.amountInt++;
                        dataElements.amount.setOutput(dataElements.amount.amountInt);
                    });

                    dataElements.amount.minus.on('click', function () {
                        dataElements.amount.amountInt--;
                        dataElements.amount.setOutput(dataElements.amount.amountInt);
                    });

                    dataElements.amount.button_add_child.on('click', function () {
                        if (dataElements.amount.button_add_child.hasClass('active')) {
                            dataElements.amount.button_add_child.removeClass('active');
                            dataElements.amount.agesList.remove();
                        } else {
                            dataElements.amount.button_add_child.addClass('active');
                            dataElements.amount.makeAgesBlock();
                            dataElements.amount.html_content.append(dataElements.amount.agesList);
                        }
                    });
                }
            });

        }
    }
};

window.MainSearchShortFormFunctions2 = MainSearchShortFormFunctions2;
