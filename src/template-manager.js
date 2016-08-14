/* jslint */

/**
 * @file template-manager.js A simple manager for loading and caching templates
 * @version %%GULP_INJECT_VERSION%%
 * @copyright Jim Auldridge <auldridgej@gmail.com> 2016
 * @license MIT
 * @see {@link https://github.com/JAAulde/template-manager|GitHub Repository}
 */
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
                $('[id="' + id + '"]:first').each(function () {
                    template_manager.cache(id, $.trim($(this).text()));

                    return false;
                });

                return fetchers.fetchCache(id);
            },
            fetchNetwork: function (url) {
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
        /**
         * Get a template from the Cache, DOM, or server
         *
         * @param  string id the ID or URL of the template
         *
         * @return string the tempalate
         */
        get: function (id) {
            var template = null,
                methods = [
                    'fetchNetwork',
                    'fetchElement',
                    'fetchCache'
                ];

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