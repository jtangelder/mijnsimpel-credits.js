start:
	@echo "Starting server..."
	forever start -l forever.log -e err.log app.js

stop:
	@echo "Stopping server..."
	forever stop app.js