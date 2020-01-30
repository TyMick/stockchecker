$(function() {
  function serializeWithoutBlanks() {
    return $("form :input")
      .filter(function(index, element) {
        return $(element).val() != "";
      })
      .serialize();
  }

  function displayResult(result) {
    $("#apiOutput").text(JSON.stringify(result, null, 2));
    hljs.highlightBlock(document.getElementById("apiOutput"));
  }

  $("form").submit(function() {
    event.preventDefault();
    $.ajax({
      url: "/api/stock-prices",
      type: "get",
      data: serializeWithoutBlanks(),
      success: displayResult
    });
  });
});
