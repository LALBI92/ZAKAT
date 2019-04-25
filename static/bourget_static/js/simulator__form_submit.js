function set_charts_options(chart_div, json) {

    if (json != undefined) {
        var options = json;
        options.chart.renderTo = chart_div;
        chart1 = new Highcharts.Chart(options);
    }
    else {
        $('#'+chart_div).html("");
    }
}
var div_show = null;
function showDiv(div_id) {
    if (div_show != null) {
        div_show.hide();
        $('#' + div_show.attr("id") + '_a').removeClass("active");
    }
    div_show = $("#" + div_id);
    div_show.show();
    $('#' + div_id + '_a').addClass("active");
}

function form_simu_only_submit(form, errors, url, is_json, is_ajax) {
    if (!is_ajax) return true;

    field = "<input type=\"hidden\" name=\"is_json\">";
    form.prepend(field);

    if (is_json) {
        $("input[name=is_json]").attr('value', '1');
        $.post(url, form.serializeArray(), function(json) {
            if (json.data.errors != "") {
                errors.show();
                errors.html(json.data.errors);
            }
            else {
                errors.hide();
            }
        }, 'json');
    }
    return false;
}

function form_privatesimu_submit( form, result, errors, url, is_json, is_ajax, apport) {
    //alert(is_ajax);
    if (!is_ajax) return true;

    console.log(form);
    console.log(result);
    console.log(errors);
    console.log(url);
    console.log(is_json);
    console.log(is_ajax);
    console.log(apport);

    field = "<input type=\"hidden\" name=\"is_json\">";
    form.prepend(field);

    if (is_json) {
        $("input[name=is_json]").attr('value', '1');
        $.post(url, form.serializeArray(), function(json) {
            console.log("barbarian");
            console.log(json);
            result.html(json.data.results);
            if (apport) { apport.html(json.data.apports); }
            if (json.data.errors != "") {
                errors.show();
                result.hide();
                if (apport) {apport.hide();}
                $('#div_simu_ov').hide();
                errors.html(json.data.errors);
            }
            else {
                errors.hide();
                result.show();
                if (apport) {apport.show();}
                $('#div_simu_ov').show();
            }
        }, 'json');
    }
    else {
        $.post(url, form.serializeArray(), function(data) {
            result.html(data);
        });
    }
    return false;
}


function form_simu_submit(chart, form, result, errors, table, url, is_json, is_ajax, apport) {
    //alert(is_ajax);
    if (!is_ajax) return true;

    field = "<input type=\"hidden\" name=\"is_json\">";
    form.prepend(field);

    if (is_json) {
        $("input[name=is_json]").attr('value', '1');
        $.post(url, form.serializeArray(), function(json) {
            form.find('button[type="submit"]').html('calculez votre financement');
            // if(json.impersonated){
            if(!json.data.errors){
                $('#send_simulation').removeClass('hide').attr('data-instance', json.instanceID);
            }
            // }
            result.html(json.data.results);
            if (apport) { apport.html(json.data.apports); }
            table.html(json.data.table);
            set_charts_options(chart, json.chart);
            if (json.data.errors != "") {
                errors.show();
                result.hide();
                if (apport) {apport.hide();}
                $('#div_simu_ov').hide();
                errors.html(json.data.errors);
            }
            else {
                errors.hide();
                result.show();
                if (apport) {apport.show();}
                $('#div_simu_ov').show();
            }
        }, 'json');
    }
    else {
        $.post(url, form.serializeArray(), function(data) {
            result.html(data);
        });
    }
    div_show = $("#" + chart);
    //showDiv(table.attr("id"));
    return false;
}
