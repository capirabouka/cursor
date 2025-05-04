from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def do_GET(self):
        # Gérer les requêtes pour les fichiers vidéo
        if self.path.endswith('.mp4'):
            try:
                f = open(self.path[1:], 'rb')
                self.send_response(200)
                self.send_header('Content-type', 'video/mp4')
                self.end_headers()
                self.wfile.write(f.read())
                f.close()
                return
            except IOError:
                self.send_error(404, 'File not found')
                return
        return super().do_GET()

def run(server_class=HTTPServer, handler_class=CORSRequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Serveur démarré sur le port {port}")
    print(f"Ouvrez votre navigateur à l'adresse: http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run() 