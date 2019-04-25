// =====================================
// ZIPCODE AUTO-COMPLETE FOR SIGNUP-PAGE
// =====================================

$('#id_individual-pays').on('change', function (event) {
    var cur_pays = $(this).val();
    if (cur_pays == "FR") {
        $("#citycomplete").removeAttr('disabled', false);
    } else {
        $("#citycomplete").attr('disabled',true).val('');
    }
});

$("#citycomplete").autocomplete('/userinfos/api/city/', {
    mustMatch: false,
    maxItemsToShow: 12,
    selectFirst: false,
    autoFill: false,
    selectOnly: false,
    remoteDataType: 'json',
    useCache: true,
    filterResults: true,
    onItemSelect: function(data) {
        var str = data["value"];
        data = str.split('(');
        if (data.length > 1) {
            ville = data[0];
            zip_code = data[1];
            $("#id_individual-zip_code").val(zip_code.substr(0, zip_code.length - 1));
            $("#id_individual-ville").val(ville.substr(0, ville.length - 1));
            $('#citycomplete').trigger('blur');
        }
    },
    processData: function(data) {
        var i, processed = [];
        for (i=0; i < data.length; i++) {
            processed.push([data[i][0]]);
        }
        return processed;
    }
});

//============================
// JS FOR SIGNUP PAGE
//============================
$(document).ready(function () {
    var pays_field = '#signup-form #id_individual-pays';
    /* var options = $(pays_field).find('option[value="FR"], option[value="RE"], option[value="BE"], option[value="LU"]').detach();
    $(pays_field).prepend('<option disabled>────────────────</option>');
    $(options[2]).prependTo(pays_field);
    $(options[0]).prependTo(pays_field);
    $(options[3]).prependTo(pays_field);
    $(options[1]).prependTo(pays_field);*/
    var options = $(pays_field).find('option[value="FR"], option[value="BE"], option[value="LU"]').detach();
    $(pays_field).prepend('<option disabled>────────────────</option>');
    $(options[2]).prependTo(pays_field);
    $(options[0]).prependTo(pays_field);
    $(options[1]).prependTo(pays_field);

    $('#signup-form #id_individual-pays').on('change', function (event) {
        var value = $(this).val();
        if(value === 'FR' || value === 'RE'){
            $('#signup-form #city_search').show();
            $('#signup-form #id_individual-ville, #signup-form #id_individual-zip_code').hide();
            $('#id_individual-ville ~ .form-control-placeholder').hide();
            $('#id_individual-zip_code ~ .form-control-placeholder').hide();
        }else{
            $('#signup-form #city_search').hide();
            $('#signup-form #id_individual-ville, #signup-form #id_individual-zip_code').show();
            $('#id_individual-ville ~ .form-control-placeholder').show();
            $('#id_individual-zip_code ~ .form-control-placeholder').show();
        }
    }).trigger('change');

    jQuery.validator.addMethod("checkSignupPostalCode", function(value, element) {
        var city = $('#signup-form #id_individual-ville').val();
        var postal = $('#signup-form #id_individual-zip_code').val();
        return this.optional(element) || (!isEmpty(city) && !isEmpty(postal));
    }, "Entrez un code postal valide.");

    $('#signup-form').validate({
        ignore: ':hidden:not(#id_individual-agreement)',
        errorElement: 'div',
        rules: {
            'last_name': 'required',
            'first_name': 'required',
            'individual-civility': 'required',
            'email': {'required': true},
            'password': {'required': true, minlength:6},
            'password2': {'required': true, equalTo: '#password_id'},
            'individual-pays': {'required': true},
            'city_postal': {'required':true, 'checkSignupPostalCode': true},
            'individual-where_got_to_know': 'required',
            'individual-agreement': 'required',
            'individual-ville': 'required',
            'individual-zip_code': 'required'
        },
        errorPlacement: function(error, element) {
            var elementName = element.attr('name');
            if (elementName == "individual-agreement" ){
                $('#signup-form #agreement_wraper').append(error);
            }
            else
                error.insertAfter(element);
        }
    });
});

//======================
// FLASH MESSAGES
//======================

$("body #messages_box,body #jsmessages_box").click(function(){
    $("#messages_box, #jsmessages_box").slideUp();
});
function showTopFlash(message, type) {
    $('body #jsmessages_box').html('<div class="top-alert '+type+'">' + message +'</div>').slideDown();
    setTimeout(function() {
        $('body #jsmessages_box').hide('blind', {}, 500)
    }, 5000);
}

//====================
// Immoobiller page videos
//====================
var immobillerPlayer;
$('#immobiller-small-video').YTPlayer({
    fitToBackground: false,
    videoId: 'Cj1r7bm1L5o',
    playerVars: {
        modestbranding: 0,
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        branding: 0,
        rel: 0,
        autohide: 0,
        start: 0
    },
    events: {
        'onStateChange': function onStateChange(e) {

        },
        'onReady': function onReady(e) {
            immobillerPlayer = e.target;
            immobillerPlayer.stopVideo();
            var video_info = immobillerPlayer.getVideoData();
            var video_id = video_info.video_id;
        }
    }
});

//==================
// Handling FOOTER FOR HOME
//==================
if($('.js__footer').length){
    $( window ).resize(function() {
        var body_hight = $(window).height();
        if(body_hight > 800){
            $('.l-page, .ext-wraper, .home-page').height(body_hight-100);
            $('.footer').css('bottom', 0)
        }else{
            $('.l-page, .ext-wraper, .home-page').removeAttr('style');
            $('.footer').removeAttr('style')
        }
    });
}
$(document).ready(function () {
    $(window).trigger('resize');
});

//=============================
// TOP NAV POSITION ON ADMIN LOGIN
//=============================
$(document).ready(function () {
    var cmsToolBar = $('#cms_toolbar .cms_toolbar-trigger');
    if(cmsToolBar.hasClass("cms_toolbar-trigger-expanded"))
        $('.navbar-fixed-top.mod--custom').css('margin-top', "30px");
});
$('#cms_toolbar .cms_toolbar-trigger').on('click', function(){
    if(!$(this).hasClass("cms_toolbar-trigger-expanded"))
        $('.navbar-fixed-top.mod--custom').css('margin-top', "30px");
    else
        $('.navbar-fixed-top.mod--custom').css('margin-top', "0");
});

//============================
// METHOD TO CHECK VALUE
//============================
function isEmpty( val ) {

    // test results
    //---------------
    // []        true, empty array
    // {}        true, empty object
    // null      true
    // undefined true
    // ""        true, empty string
    // ''        true, empty string
    // 0         false, number
    // true      false, boolean
    // false     false, boolean
    // Date      false
    // function  false
    if (val === undefined)
        return true;
    if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
        return false;
    if (val == null || val.length === 0)        // null or 0 length array
        return true;
    if (typeof (val) == "object") {
        // empty object
        var r = true;
        for (var f in val)
            r = false;
        return r;
    }

    return false;
}


//===========================
// PASSWORD FIELD STRENGTH
//===========================
function generateFrPasswordStrength(wraper, field) {
    if(isEmpty(wraper)) wraper = 'thepwddiv';
    if(isEmpty(field)) wraper = 'password';
    var pwdwidget = new PasswordWidget('thepwddiv','password');
    pwdwidget.inputClasses = 'form-control mod--theme';
    pwdwidget.placeholder = 'Mot de passe';
    pwdwidget.txtShow = "<i class='fa fa-eye'></i>";
    pwdwidget.txtMask = "<i class='fa fa-eye-slash'></i>";
    pwdwidget.txtGenerate = "Générer";

    pwdwidget.txtWeaker='Très faible';
    pwdwidget.txtWeak='Faible';

    pwdwidget.txtMediumWeek='Moyen';
    pwdwidget.txtMedium='Fort';

    pwdwidget.txtGood='Très fort';
    pwdwidget.MakePWDWidget();
}