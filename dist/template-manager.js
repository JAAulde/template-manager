/*jslint */
/*global module: true, exports: true, define: false */

/**
 * @file template-manager.js A simple manager for loading and caching templates
 * @version 1.0.3
 * @copyright Jim Auldridge <auldridgej@gmail.com> 2016
 * @license MIT
 * @see {@link https://github.com/JAAulde/template-manager|GitHub Repository}
 */

/**
 * Scope isolator
 * @param object scope A reference to the call scope
 */
(function (scope) {
    'use strict';

    /**
     * IIFE for injecting module into whichever require/scope is in use
     *
     * @param string name The name of module being created
     * @param function definition Function which produces and returns the created module
     */
    (function (name, definition) {
        if (typeof module === 'object' && module !== null && module.exports) {
            module.exports = exports = definition();
        } else if (typeof define === 'function' && define.amd) {
            define(definition);
        } else {
            scope[name] = definition();
        }
    }('template_manager', function () {
        var $ = scope.jQuery,
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

        template_manager = {
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
            /**
             * Inject a template string into the cache by name
             *
             * @param  string id The ID you'll use when you want to get the
             *                   template from the manager
             * @param  string template The template to cache
             */
            cache: function (id, template) {
                cache[id] = template;
            }
        };

        return template_manager;
    }));
}(this));