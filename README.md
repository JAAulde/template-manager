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
_Note the `id` attribute._
````
You can retrieve it like so:
````javascript
var hello_world_template = template_manager.get('hello_world');
````
_See how the `id` attribute of the DOM node is what we passed to `get()`?

If you have a template on the server at `/partials/hello_world.html`, you can retrieve it like so:
````javascript
var hello_world_template = template_manager.get('/partials/hello_world.html');
````
Simple, right? We just told `get()` the URL in the same way we told it an ID earlier.