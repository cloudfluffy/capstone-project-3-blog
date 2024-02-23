$(".toggle").on("click", function () {
    $(this).hide();
    $(".hide", $(this).parent()).show();
    $('form[action="/toedit"]', $(this).parent()).hide();
});

$(".cancel").on("click", function () {
    $(this).parent().hide();
    $(".toggle", $(this).parent().parent()).show();
    $('form[action="/toedit"]', $(this).parent().parent()).show();
});