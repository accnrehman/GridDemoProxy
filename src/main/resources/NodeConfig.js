$(document).ready(function() {

	$("#hub_validate").click(function(event) {
		var url = $("#hub_url").val();
		$.ajax({
			url : "?status=&url=" + url,
			type : 'POST',
			context : document.body,
			success : function(data, textStatus, jqXHR) {
				var result = eval('(' + jqXHR.responseText + ')');
				updatePage(result);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert("Affreux. " + jqXHR.responseText);
			}
		}); // end ajax
	});

	$("#reset").click(function(event) {
		$.ajax({
			url : "?reset",
			type : 'POST',
			context : document.body,
			success : function(data, textStatus, jqXHR) {
				var result = eval('(' + jqXHR.responseText + ')');
				updatePage(result);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert("Affreux. " + jqXHR.responseText);
			}
		}); // end ajax
	});

	$("#capabilities").delegate(".validate_cap", "click", function() {
		var index = $(this).attr('index');

		$(this).attr('src', '/extra/resources/loader.gif');
		$(this).attr('title', 'trying to run a test.');
		$(this).attr('class', '');

		$.ajax({
			url : "?validate=" + index,
			type : 'POST',
			context : document.body,
			success : function(data, textStatus, jqXHR) {
				var result = eval('(' + jqXHR.responseText + ')');
				updatePage(result);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert("Affreux. " + jqXHR.responseText);
			}
		}); // end ajax
	});

	var old;
	$("#browserLocation").keypress(function(event) {
		var keyCode = event.keyCode || event.which;
		if (keyCode == 9) {
			path = $(this).val();
			event.preventDefault();
			if (path != old) {
				$.ajax({
					url : "?completion=" + path,
					type : 'POST',
					context : document.body,
					success : function(data, textStatus, jqXHR) {
						var result = eval('(' + jqXHR.responseText + ')');
						updatePage(result);
						validatePath(result.browserLocation);
						if (result.isDirectory) {
							old = 'ferret';
						}
					},
					error : function(jqXHR, textStatus, errorThrown) {
						alert("Affreux. " + jqXHR.responseText);
					}
				}); // end ajax
			}

		} else if (keyCode == 13) {
			var path = $(this).val();
			event.preventDefault();
			$.ajax({
				url : "?submit=" + path,
				type : 'POST',
				context : document.body,
				success : function(data, textStatus, jqXHR) {
					var result = eval('(' + jqXHR.responseText + ')');
					updatePage(result);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert("Affreux. " + jqXHR.responseText);
				}
			}); // end ajax
		}
	}); // end keypress

	$("#browserLocation").keyup(function(event) {
		var keyCode = event.keyCode || event.which;
		if (keyCode != 9) {
			$("#completionHelp").html('');
		}
		var path = $(this).val();
		validatePath(path);
	}); // end keyup

	function updatePage(result) {
		for ( var property in result) {
			// update some attributes ?
			if (property.indexOf('.') != -1) {
				var id = property.split(".")[0];
				var attr = property.split(".")[1];
				if ($('#' + id).length) {
					$('#' + id).attr(attr,result[property]);
				}
			// html or value.
			} else {
				if ($('#' + property).length) {
					$('#' + property).val(result[property]);
					$('#' + property).html(result[property]);

				}
			}

		}
	}

	function validatePath(path) {
		$.ajax({
			url : "?current=" + path,
			type : 'POST',
			context : document.body,
			success : function(data, textStatus, jqXHR) {
				var result = eval('(' + jqXHR.responseText + ')');
				updatePage(result);

			},
			error : function(jqXHR, textStatus, errorThrown) {
				$('#info').html(jqXHR.responseText);
			}
		}); // end ajax
	}

});
