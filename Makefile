start:
	@echo "Starting server..."
	forever start -a -e err.log app.js

stop:
	@echo "Stopping server..."
	forever stop app.js