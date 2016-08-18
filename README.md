# template-manager

A simple manager for loading and caching templates.

Get templates by ID/URL from `script` tags in the DOM or from the server via AJAX. Retrieved templates are cached for the next call. You can also inject a named template into the cache for retrieval later. This is handy for writing code that needs templates distributed with it.

## installation

## installation
### [bower](http://bower.io)
````bash
bower install jaaulde-template-manager
````

### [npm](https://www.npmjs.com)
````bash
npm install jaaulde-template-manager
````

### html
Download the code, link it in your HTML file.
````html
<script src="/path/to/jaaulde-template-manager.js"></script>
````

## usage

### Get a template from the DOM or Server
#### `template_manager.get()`
##### signature
````javascript
/**
 * Get a template from the Cache, DOM, or server
 *
 * @param  string id the ID or URL of the template
 *
 * @return string the tempalate
 */
get: function (id) {
````
##### example
If you have a template in the DOM like so:
````html
<script type="text/template" id="hello_world">
	<p>Hello, World! I'm {name}</p>
</script>
````
_Note the `id` attribute._

You can retrieve it like so:
````javascript
var hello_world_template = template_manager.get('hello_world');
````
See how the `id` attribute of the DOM node is what we passed to `get()`?

If you have a template on the server at `/partials/hello_world.html`, you can retrieve it like so:
````javascript
var hello_world_template = template_manager.get('/partials/hello_world.html');
````
Simple, right? We just told `get()` the URL in the same way we told it an ID earlier.

After the first successful fetch of any particular template, that template is cached for faster retrieval next time.

### Inject a template into the cache for later retrieval
#### `template_manager.cache()`
##### signature
````javascript
/**
 * Inject a template string into the cache by name
 *
 * @param  string id The ID you'll use when you want to get the
 *                   template from the manager
 * @param  string template The template to cache
 */
cache: function (id, template) {
````
##### example
````javascript
template_manager.cache('hello_world', '<script type="text/template" id="hello_world"><p>Hello, World! I\'m {name}</p></script>');
````
Later, when you're ready, you can ask for the template via `template_manager.get('hello_world')`.

### Using with build systems
The ability to inject things into the cache may not seem all that handy, but consider a JavaScript package that also needs templates, and is intended for distribution over Bower or NPM. Figuring out where to put templates, and how to reference them from the script, and how to keep file paths and URLs synced up on any number of systems to which the package could be installed is very difficult.

By including this package in that package's dependencies, however, the author could simply inject templates into the cache in her code. Even better, the author could write her package with actual HTML files holding each template in her `src`, and have a build file compile those and write lines of JavaScript that inject them into the cache in the `dist` output. Her `src` would be nice and clean, and her `dist` works wherever it is installed!

Here's an example in [GulpJS](http://gulpjs.com) using [gulp-angular-templatecache](https://www.npmjs.com/package/gulp-angular-templatecache). Note that this plugin was intended for use with [AngularJS](https://angularjs.org)' own template caching system for the same purpose, but provides enoug option overrides that, out of the box, it can be used for this package, too.
````javascript
gulp.task('templates', function () {
	return gulp
            .src('src/**/*.html')
            .pipe(plugins.htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(plugins.angularTemplatecache({
                templateHeader: '\n\t',
                templateBody: 'template_manager.cache(\'<%= url %>\',\'<%= contents %>\');',
                templateFooter: '\n',
                moduleSystem: 'iife'
            }))
            .pipe(gulp.dest('dist/'));
});
````