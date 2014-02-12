var TOTAL = 0;
var IFRAME = null;
var INNER_IFRAME = null;

var RESPONSES = [];

var COUNTRIES = {
    "Albania": {regions: ["al"]},
    "Andorra": {regions: ["ad"]},
    "Armenia": {regions: ["am"]},
    "Austria": {regions: ["at"]},
    "Belarus": {regions: ["by"]},
    "Belgium": {regions: ["be"]},
    "Bosnia and Herzegovina": {regions:["ba"]},
    "Bulgaria": {regions: ["bg"]},
    "Croatia": {regions: ["hr"]},
    "Cyprus": {regions: ["cy"]},
    "Czech Republic": {regions: ["cz"]},
    "Denmark": {regions: ["dk"]},
    "Estonia": {regions: ["ee"]},
    "Finland": {regions: ["fi"]},
    "France": {regions: ["fr"]},
    "Georgia": {regions: ["ge"]},
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
    "Russia": {regions: ["ru-kgd", "ru-main"]},
    "San Marino": {regions: ["sm"]},
    "Serbia": {regions: ["rs"]},
    "Slovakia": {regions: ["sk"]},
    "Slovenia": {regions: ["si"]},
    "Spain": {regions: ["es"]},
    "Sweden": {regions: ["se"]},
    "Switzerland": {regions: ["ch"]},
    "Turkey": {regions: ["tr"]},
    "Ukraine": {regions: ["ua"]},
    "United Kingdom": {regions: ["gb-nir", "gb-gbn", "im"]}, // Isle of Man will be its own region next survey.
    "Vatican City": {regions: ["va"]},
    "Montenegro": {regions: ["me"]}
};

// The list of questions. Also acts as a mapping against the spreadsheet itself.
var QUESTIONS = [
    {
        title: "Age",
        filters: [
            {text: "Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input })},
            {text: "12 or younger", f: (function(input) { return '12 or under' == input })},
            {text: "13 to 16", f: (function(input) { return '13 - 16' == input })},
            {text: "17 to 20", f: (function(input) { return '17 - 20' == input })},
            {text: "21 to 25", f: (function(input) { return '21 - 25' == input })},
            {text: "26 to 30", f: (function(input) { return '26 - 30' == input })},
            {text: "31 to 35", f: (function(input) { return '31 - 35' == input })},
            {text: "36 to 40", f: (function(input) { return '36 - 40' == input })},
            {text: "41 to 45", f: (function(input) { return '41 - 45' == input })},
            {text: "46 to 50", f: (function(input) { return '46 - 50' == input })},
            {text: "51 to 55", f: (function(input) { return '51 - 55' == input })},
            {text: "56 to 60", f: (function(input) { return '56 - 60' == input })},
            {text: "61+", f: (function(input) { return '61 or over' == input })}
        ]
    },
    {} // The countries... Not used.
]

// Both of these have a 1:1 correspondance.

var QUESTIONS_ADDED = [];
var FILTERS_ADDED = [] ;

function prepare_countries() {
    // Initialize COUNTRIES
    for (var country in COUNTRIES) {
        COUNTRIES[country].total = 0;
        COUNTRIES[country].percentage = 0;
        COUNTRIES[country].colour = "#f0f0f0";
    }

    $.get("/static/res/reddit-europe-survey-end-of-2013/europe_survey.csv", function(csv) {
        var responses = csv.split('\n');

        // Go through every response.
        for (var i=0; i<responses.length; i++) {
            var response = responses[i].replace(/"/g, "").split(/\t/);
            
            if (COUNTRIES[response[4]] == undefined) {
                // If you ain't European bud, we ain't graphin' you.
                continue;
            }

            // Go through every question in the current response.
            RESPONSES.push(response);
        }

        update_map(false);
    });
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
    // If we've added all the questions, don't prompt another select box. Also, since we're
    // mapping against the country field, make sure to not count that as a question, so 
    // subtract one from the total number of questions.
    if (QUESTIONS_ADDED.length == (QUESTIONS.length - 1)) {
        alert("You can't make any more queries! :(");
        return false;
    }

    // Build, display, and select the first option in the QUESTIONS select box.
    var global_select_box = build_global_select_box();
    $("#new_question").html(global_select_box);
    $("#main_question option:first").attr('selected', 'selected');
    var question_id = parseInt($("#main_question option:selected").val());

    // Build, display, and select the first option in the FILTERS select box.
    var filters_select_box = build_local_select_box(question_id);
    $("#new_question").append(filters_select_box);
    $("#filtered_question option:first").attr('selected', 'selected');

    // Add a finished link to clear the current question from being added.
    var finished_link = " <a href='#' id='finished_question'>Done!</a>";
    $("#new_question").append(finished_link);

    $("#finished_question").click(function(e) {
        e.preventDefault();
        var question_id = parseInt($("#main_question option:selected").val());
        var filter_id = parseInt($("#filtered_question option:selected").val());
        
        QUESTIONS_ADDED.push(question_id);
        FILTERS_ADDED.push(filter_id);

        var remove_question = "<em><a href='#' class='remove_question' id='remove_" + question_id + "'>(Remove)</a></em>";
        var added_question = "<p id='question_" + question_id + "' class='query'><strong>Query -- " + QUESTIONS[question_id].title + 
                             ":</strong> " + QUESTIONS[question_id].filters[filter_id].text + " " + remove_question + "</p>";
        $("#questions_added").append(added_question);
        $("#new_question").html('');

        // We need to update the map any case the user deletes an already-established question,
        // and then clicks the "add" button to add this current question.

        update_map(false);

        update_handlers();
    });

    // Update the map with everything in QUESTIONS/FILTERS_ADDED, and also include
    // the current selected question and filter.

    var question_id = parseInt($("#main_question option:selected").val());
    var filter_id = parseInt($("#filtered_question option:selected").val());

    update_map({
        question_id: question_id, 
        filter_id: filter_id
    });

    update_handlers();
}

function update_handlers() {
    // Removing already added questions.
    $(".remove_question").click(function(e) {
        e.preventDefault();
        var id = $(this).attr('id').split("remove_")[1];
        var location_in_array = QUESTIONS_ADDED.indexOf(id);
        QUESTIONS_ADDED.splice(location_in_array, 1);
        FILTERS_ADDED.splice(location_in_array, 1);
        $("#question_" + id).remove();
        update_map(false);
    });

    // Update the map on any filter change.
    $("#filtered_question").change(function() {
        var question_id = parseInt($("#main_question option:selected").val());
        var filter_id = parseInt($("#filtered_question option:selected").val());

        update_map({
            question_id: question_id, 
            filter_id: filter_id
        });
    })
}

function update_map(current_query) {
    // Because we want to update the map in real-time as a user selects a potential question,
    // make sure to potentially include the question being played around with in addition to
    // everything else that has already been selected.
    
    var questions_selected = [];
    questions_selected.push.apply(questions_selected, QUESTIONS_ADDED);

    var filters_selected = [];
    filters_selected.push.apply(filters_selected, FILTERS_ADDED);

    if (current_query) {
        questions_selected.push(current_query.question_id);
        filters_selected.push(current_query.filter_id);
    }

    // Reset countries and counts.

    for (var country in COUNTRIES) {
        COUNTRIES[country].total = 0;
        COUNTRIES[country].percentage = 0;
        COUNTRIES[country].colour = "#f0f0f0"
    }

    TOTAL = 0;

    // If there are no questions selected, then reset the map.

    if (!questions_selected.length) {
        for (var i=0; i<RESPONSES.length; i++) {
            COUNTRIES[RESPONSES[i][4]].total++;
            TOTAL++;
        }

        $("#total").html(TOTAL);
        colour_countries();
        return false;
    }

    // Now that we have our final list of questions, build the results!

    for (var i=0; i<RESPONSES.length; i++) {
        var add = true;
        var response = RESPONSES[i];

        for (var j=0; j<questions_selected.length; j++) {
            var current_question = questions_selected[j];
            var current_filter = filters_selected[j];

            if (!QUESTIONS[current_question].filters[current_filter].f(response[current_question])) {
                add = false;
                break;
            }
        }

        if (add) {
            COUNTRIES[response[4]].total++;
            TOTAL++;
        }
    }

    $("#total").html(TOTAL);
    colour_countries();
}

function darken_colour(colour, shade) {
    var colour_int = parseInt(colour.substring(1),16);
     
    var red = (colour_int & 0xFF0000) >> 16;
    var green = (colour_int & 0x00FF00) >> 8;
    var blue = (colour_int & 0x0000FF) >> 0;
    
    red = red + Math.floor((shade / 255) * red);
    green = green + Math.floor((shade / 255) * green);
    blue = blue + Math.floor((shade / 255) * blue);
           
    var new_colour_int = (red << 16) + (green << 8) + (blue);
    var new_colour = "#" + new_colour_int.toString(16);

    if (new_colour.indexOf("-") == -1) {
        return new_colour;
    } else {
        return "#000000"
    }
}

function colour_countries() {
    base_colour = "#FFCCCC";
    var iframe = document.getElementById('map_of_europe');
    var inner_iframe = iframe.contentDocument || iframe.contentWindow.document;

    for (var country in COUNTRIES) {
        if (COUNTRIES[country].total == 0){
            COUNTRIES[country].percentage = 0;
            COUNTRIES[country].colour = "#f0f0f0";
        } else {
            var percentage = (COUNTRIES[country].total / TOTAL) * 100;
            COUNTRIES[country].percentage = percentage; // Round to 2.
            COUNTRIES[country].colour = darken_colour(base_colour, -parseInt(percentage) * 10); // A simple scalar for greater variance.
        }

        // We can finally colour in the countries now.
        for (var i=0; i<COUNTRIES[country].regions.length; i++) {
            inner_iframe.getElementById(COUNTRIES[country].regions[i]).style.fill = COUNTRIES[country].colour;
        }
    }
}

$(document).ready(function() {
    $("#start_app").click(function(e) {
        e.preventDefault();
        $(this).hide();

        IFRAME = document.getElementById('map_of_europe');
        INNER_IFRAME = IFRAME.contentDocument || IFRAME.contentWindow.document;
        prepare_countries();

        $("#add_question").show();
        $("#add_question > a").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            add_question();
        });
    });
});
