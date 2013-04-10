function toggle_notes() {
    $(".books tr").click(function() {
	if ($(this).hasClass("notes")) {
	    $(this).toggle();
	} else {
	    $(this).next().toggle();
	}
    });
}

function css_fix() {
    // See notes in CSS for why this is needed.
    $(".notes").hover(function() {
	$(this).prev().css("background-color", "#ffffcc");
    }, function() {
	$(this).prev().css("background-color", "");
    });
}

$(document).ready(function() {
    toggle_notes();
    css_fix();
});
