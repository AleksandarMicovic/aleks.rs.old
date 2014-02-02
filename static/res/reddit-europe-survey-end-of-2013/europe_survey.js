var COUNTRIES = {
    "Albania": {regions: ["al"]},
    "Andorra": {regions: ["ad"]},
    "Armenia": {regions: ["hy"]},
    "Austria": {regions: ["at"]},
    "Belarus": {regions: ["by"]},
    "Belgium": {regions: ["be"]},
    "Bosnia and Herzegovina": {regions:["ba"]},
    "Bulgaria": {regions: ["bg"]},
    "Croatia": {regions: ["hr"]},
    "Cyprus": {regions: ["cy"]},
    "Czech Republic": {regions: ["cz"]},
    "Denmark": {regions: ["dk", "fo"]},
    "Estonia": {regions: ["ee"]},
    "Finland": {regions: ["fi"]},
    "France": {regions: ["fr"]},
    "Georgia": {regions: ["ka"]},
    "Germany": {regions: ["de"]},
    "Greece": {regions: ["gr"]},
    "Hungary": {regions: ["hu"]},
    "Iceland": {regions: ["is"]},
    "Ireland": {regions: ["ie"]},
    "Italy": {regions: ["it"]},
    "Latvia": {regions:["lv"]},
    "Liechtenstein": {regions: ["li"]},
    "Lithuania": {regions: ["lt"]},
    "Luxembourg": {regions: ["lu"]},
    "Macedonia": {regions: ["mk"]},
    "Malta": {regions: ["mt"]},
    "Moldova": {regions: ["md"]},
    "Monaco": {regions: ["mc"]},
    "Netherlands": {regions: ["nl"]},
    "Norway": {regions: ["no"]},
    "Poland": {regions: ["pl"]},
    "Portugal": {regions: ["pt"]},
    "Romania": {regions: ["ro"]},
    "Russia": {regions: ["ru"]},
    "San Marino": {regions: ["sm"]},
    "Serbia": {regions: ["rs", "Kosovo"]},
    "Slovakia": {regions: ["sk"]},
    "Slovenia": {regions: ["si"]},
    "Spain": {regions: ["es"]},
    "Sweden": {regions: ["se"]},
    "Switzerland": {regions: ["ch"]},
    "Turkey": {regions: ["tr"]},
    "Ukraine": {regions: ["ua"]},
    "United Kingdom": {regions: ["gb", "gi", "im"]}, // Isle of Man will be its own region next survey.
    "Vatican City": {regions: ["va"]},
    "Montenegro": {regions: ["me"]}
};

QUESTIONS = [
    //{}, The country. Not needing it since we're ranking against it.
    {
        title: "Age",
        filters: [
            {text: "Undisclosed", value: "Prefer not to answer. Sorry.", f: (function(input) { return 'Prefer not to answer. Sorry.' == input })},
            {text: "12 or younger", value: "12 or under", f: (function(input) { return '12 or under' == input })},
            {text: "13 to 16", value: "13 - 16", f: (function(input) { return '13 - 16' == input })},
            {text: "17 to 20", value: "17 - 20", f: (function(input) { return '17 - 20' == input })},
            {text: "21 to 25", value: "21 - 25", f: (function(input) { return '21 - 25' == input })},
            {text: "26 to 30", value: "26 - 30", f: (function(input) { return '26 - 30' == input })},
            {text: "31 to 35", value: "31 - 35", f: (function(input) { return '31 - 35' == input })},
            {text: "36 to 40", value: "36 - 40", f: (function(input) { return '36 - 40' == input })},
            {text: "41 to 45", value: "41 - 45", f: (function(input) { return '41 - 45' == input })},
            {text: "46 to 50", value: "46 - 50", f: (function(input) { return '46 - 50' == input })},
            {text: "51 to 55", value: "51 - 55", f: (function(input) { return '51 - 55' == input })},
            {text: "56 to 60", value: "56 - 60", f: (function(input) { return '56 - 60' == input })},
            {text: "61+", value: "61 or over", f: (function(input) { return '61 or over' == input })}
        ]
    }
]

QUESTIONS_ADDED = [];

function prepare_countries() {
    // Initialize COUNTRIES
    for (var country in COUNTRIES) {
        COUNTRIES[country].total = 0;
        COUNTRIES[country].percentage = 0;
        COUNTRIES[country].colour = "#CCCCCC";
    }

    $.get("/static/res/reddit-europe-survey-end-of-2013/europe_survey.csv", function(csv) {
        var responses = csv.split('\n');

        // Go through every response.
        for (var i=0; i<responses.length; i++) {
            var response = responses[i].replace(/"/g, "").split(/\t/);
            
            if (COUNTRIES[response[4]] == undefined) {
                console.log(response[4]);
            }

            // Go through every question in the current response.
            for (var j=0; j<response.length; j++) {
            }
        }

        // Everything has been prepared. Move on!
    });
}

function prepare_map() {
    // Colour the water.
}

function build_global_select_box() {
    var select_box = "<select id='main_question'>";

    for (var i=0; i<QUESTIONS.length; i++) {
        if ($.inArray(i, QUESTIONS_ADDED) == -1) {
            select_box += "<option value='" + i + "'>" + QUESTIONS[i].title + "</option>";
        }
    }

    select_box += "</select>";
    

    return select_box;
}

function build_local_select_box(id) {
    var select_box = "<select id='filtered_question'>";

    for (var i=0; i<QUESTIONS[id].filters.length; i++) {
        select_box += "<option value='" + i + "'>"  + QUESTIONS[id].filters[i].text + "</option>";
    }

    select_box += "</select>";

    return select_box;
}

function add_question() {
    // Build, display, and select the first option in the QUESTIONS select box.
    var global_select_box = build_global_select_box();
    $("#new_question").html(global_select_box);
    $("#main_question option:first").attr('selected', 'selected');

    // Build, display, and select the first option in the FILTERS select box.
    var filters_select_box = build_local_select_box(parseInt($("#main_question :selected").val()));
    $("#new_question").append(filters_select_box);
    $("#filtered_question option:first").attr('selected', 'selected');
}

$(document).ready(function() {
    prepare_countries();

    $("#add_question").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        add_question();
    });
});
