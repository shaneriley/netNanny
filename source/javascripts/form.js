$(function() {
  $("a").click(function(e) {
    e.preventDefault();
    $(this).closest("form").find("fieldset").toggle();
  });

  $("form").submit(false);

  $("form#default").netNanny();

  $("form#flowers").netNanny({ replacement_character: "\u2740" });

  $("form#single textarea").netNanny();

  $("form#selectors").netNanny({ input_selectors: ["[type=text]"] });
});
