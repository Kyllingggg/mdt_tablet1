name 'C:\Users\kylli\Desktop\iza'
version '0.0.0'
fx_version 'cerulean'
game 'gta5'
node_version '22'

client_script 'dist/client.js'
server_script 'dist/server.js'
ui_page 'dist/web/index.html'

files {
	'locales/*.json',
	'dist/*.json',
	'dist/web/*.svg',
}
