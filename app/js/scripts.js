$( document ).ready(function() {
	var spinner = $( ".spinner" ).spinner({
		min: 0
	});

	var sliderRange = $(".slider-range"),
		sliderMin = sliderRange.data('min');
		sliderMax = sliderRange.data('max');
		sliderStep = sliderRange.data('step')


	sliderRange.slider({
		value: 0,
		min: sliderMin,
		max: sliderMax,
		step: sliderStep,
		range: 'min'
	})

	$("#file").change(function(){
		var file = $(this).val().split('\\').pop();
		$("#value-file").html(file);
	})
	$("#watermark").change(function(){
		var file = $(this).val().split('\\').pop();
		$("#value-watermark").html(file);
	})
});