
# Brunch config. This is *not* the artemis-glitter config, which is handled by the node-config
#   module.



exports.config =
	#  See http://brunch.readthedocs.org/en/latest/config.html for documentation.
	modules:
		definition: false
		wrapper: false
	paths:
		public: "_public/"
		watched: ["webclient","bower_components"]
	files:
		javascripts:
			joinTo:
				'js/app.js': /^webclient/
				'js/vendor.js': /^vendor|bower_components(?:\/|\\)[^_]/
# 				'js/vendor.js': /^vendor(?:\/|\\)[^_]/
			order:
				before: []
				after: []

		stylesheets:
			joinTo:
				'css/app.css': /^(webclient)(?:\/|\\)[^_]/
# 				'css/app.css': /^(webclient|bower_components)(?:\/|\\)[^_]/
			order:
				before: []
				after: []

		templates:
			joinTo: 'js/app.js'

	conventions:
		ignored: [ /\/test/ , /\/examples/ , /\/bin/ ]
		vendor: [ /^bower_components/  ]



	modules:
		wrapper: 'commonjs'

