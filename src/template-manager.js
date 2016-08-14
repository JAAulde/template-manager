(function (context) {
	'use strict';

	var $ = context.jQuery,
		template_manager,
		cache = {},
		fetchers = {
			fetchCache: function (id) {
				return cache[id] || null;
			},
			fetchElement: function (id) {
				var template = null;

				$('#' + id).each(function () {
					template_manager.cache(id, $.trim($(this).text()));

					return false;
				});

				return fetchers.fetchCache(id);
			},
			fetchNetwork: function (url) {
				var template = null;

				$.ajax({
					type: 'GET',
					url: url,
					dataType: 'html',
					async: false,
					success: function (data) {
						template_manager.cache(url, data);
					}
				});

				return fetchers.fetchCache(url);
			}
		};

	context.template_manager = template_manager = {
		get: function (id) {
			var template = null,
			methods = [
				'fetchNetwork',
				'fetchElement',
				'fetchCache'
			],
			method;

			while (template === null && methods.length) {
				template = fetchers[methods.pop()](id);
			}

			return template;
		},
		cache: function (id, template) {
			cache[id] = template;
		}
	};
}(this));