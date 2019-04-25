var salary_val = 3000;
var apport_val = 50000;

$.fn.digits = function(){
    return this.each(function(){
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ") );
    })
};

function mortgage(capital, years, apport, taux) {
    reste_capital = capital - ((capital * apport) / 100);
    months = years * 12;
    i = taux / 1200.0;
    m = reste_capital*i*Math.pow(1+i,months)/(Math.pow(1+i,months)-1);
    var m_ = m;
    m = Math.round(m);
    return m;
}

function update_mortgage(salary, apport) {

    var budget_maximum = simulator_sub_calculation(salary, apport, 20);
    $( "#res" ).text(Math.round(budget_maximum) + '€');
    $( "#salary" ).digits();
    $( "#amount" ).digits();
    $( "#res" ).digits();
    $( "#apport" ).digits();
}

$(function() {
    totalSimulations(0,  '#total-simu');

    $(document).on('click', '#sim_votra_finance', function (event) {
        event.preventDefault();
        var url = $(this).attr('href') + '?revenus='+salary_val+'&apport='+apport_val;
        window.location.href = url;
    })


    $('#slider_salary').bootstrapSlider({
        value: salary_val,
        min: 500,
        max: 15000,
        step: 250,
        formatter: function(value) {
            salary_val = value;
            $( "#salary" ).text( value + "€");
            update_mortgage(salary_val, apport_val);
            return value;
        }
    });
    $('#slider_apport').bootstrapSlider({
        value: apport_val,
        min: 10000,
        max: 200000,
        step: 1000,
        formatter: function(value) {
            $( "#apport" ).text( value + "€");
            apport_val = value;
            update_mortgage(salary_val, apport_val);
            return value;
        }
    });

    $( "#salary" ).text( salary_val + "€" );
    $( "#apport" ).text( apport_val + "€" );

    update_mortgage(salary_val, apport_val);

    // $( ".next_widget" ).click(function(e) {
    //     $("#mini_simu .block_widget").hide();
    //     $("#mini_simu .block_yesno").show();
    //     e.preventDefault();
    // });


    // $(".block_yesno .switch-input").change(function(){
    //     if ($('.block_yesno .switch-input:checked').length == $('.block_yesno .switch-input').length) {
    //         $( "#buttons_mini_simu2" ).show();
    //         $( "#buttons_mini_simu3" ).hide();
    //     } else {
    //         $( "#buttons_mini_simu2" ).hide();
    //         $( "#buttons_mini_simu3" ).show();
    //     }
    // });
});


function simulator_sub_calculation(revenu_mensuel, apport, duree) {

    var tx_marge_annuel = 2.8;
    var tx_marge_mensualise = tx_marge_annuel / 12;
    var nombre_mensualites = duree * 12;
    var tva = parseInt(20 / 100);
    var debours_acqui = 751;
    var taux_publicite = 0.715;
    var taux_conservateur = 0.1;
    var taux_mutation = 5.09;
    var taux_privilege = 0.45;
    var debours = 800;
    var formalites_forfait = 351;
    var formalites_publicite_fonc = 19.5;
    var provision_puv = 500;

    var mensualite_loyer = 0.37 * revenu_mensuel;
    var my_fin = (mensualite_loyer * (1 - Math.pow((1 + (tx_marge_mensualise / 100)), -nombre_mensualites))) / (tx_marge_mensualise / 100);
    var sommedispo = my_fin + apport;
    var total_financement = nombre_mensualites * mensualite_loyer;
    var cout_global = total_financement + apport;
    var droits_mutation = ((taux_mutation + taux_privilege) / 100) * sommedispo;
    var frais_debours_formalites = debours + ((formalites_forfait + formalites_publicite_fonc) * (1 + tva));
    var cout_intermediaire = sommedispo - droits_mutation - frais_debours_formalites;
    var emoluments_vente = emoluments(cout_intermediaire) * (1 + tva);
    var frais_revente = droits_mutation + frais_debours_formalites + emoluments_vente;
    var revenus_banque = total_financement - my_fin;

    var frais_dossier = 0;
    if ((my_fin / 100) > 1000)
        frais_dossier = 1000;
    else if((my_fin / 100) < 300)
        frais_dossier = 300;
    else
        frais_dossier = (my_fin*1) / 100;

    var prix_revente = cout_global - frais_revente - frais_dossier - 500;
    var total = prix_revente - revenus_banque - debours_acqui;
    var emol_acqui = emoluments(total)
    var emol_acqui_tva = (emol_acqui + 270 + 170) * (1 + tva);
    var total_emol = total - emol_acqui_tva;
    var prix = total_emol / (1 + ((taux_publicite + taux_conservateur) / 100));
    var prix_arr = Math.floor(parseFloat(prix) / 100) * 100;


    var mul_factor = 0;
    if (revenu_mensuel > 4000) {
        mul_factor = 100/12;
    }
    else {
        mul_factor = 100/20;
    }
    var max_apport = 0;
    if  ((apport * mul_factor) < prix)
        max_apport = (apport * mul_factor);

    var frais_notaire_achat = Math.ceil(parseFloat(total - prix + debours_acqui) / 100) * 100;
    var apport_client_net = apport - frais_revente;
    var marge_banque = Math.floor(revenus_banque / prix_arr * 100);

    var budget_maximum = 0;
    if (max_apport != 0)
        budget_maximum = max_apport;
    else
        budget_maximum = prix_arr;

    return budget_maximum

}

function emoluments(prix) {
    var tranche1 = 6500;
    var tranche2 = 17000;
    var tranche3 = 60000;
    var taux1 = 0.0400;
    var taux2 = 0.0165;
    var taux3 = 0.0110;
    var taux4 = 0.00825;
    var res = 0;

    if (prix <= tranche1)
        res = taux1 * prix;
    else if (prix <= tranche2)
        res = (taux1 * tranche1) + ((prix - tranche1) * taux2);
    else if (prix <= tranche3)
        res = (taux1 * tranche1) + (taux2 * (tranche2 - tranche1)) + ((prix - tranche2) * taux3);
    else
        res = (taux1 * tranche1) + (taux2 * (tranche2 - tranche1)) + (taux3 * (tranche3 - tranche2)) + ((prix - tranche3) * taux4);

    return res;
}


function totalSimulations(FirstDay , htmlId) {
    var days = [984,1040,880,960,788,1376,1205];
    var today = new moment();
    var addEachDay = days[today.day()];
    var startS = new moment(today.format('MM-DD-YYYY'), 'MM-DD-YYYY').toDate().getTime() / 1000;
    var nowS = Math.floor(moment.now() / 1000);
    var res = FirstDay + (((nowS - startS) / (60*60*24)) * addEachDay);
    $({someValue: 0}).animate({someValue: res}, {
        duration: 2000,
        easing:'swing',
        step: function() {
            $(htmlId).text(commaSeparateNumber(Math.round(this.someValue)));
        }
    });
}


function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
    }
    return val;
}
