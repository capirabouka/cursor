from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def do_GET(self):
        print(f"Requête reçue pour: {self.path}")
        
        # Gérer les requêtes pour les fichiers vidéo
        if self.path.endswith('.mp4'):
            try:
                file_path = self.path[1:]  # Enlever le premier slash
                print(f"Tentative d'ouverture du fichier: {file_path}")
                
                if not os.path.exists(file_path):
                    print(f"Fichier non trouvé: {file_path}")
                    self.send_error(404, 'File not found')
                    return
                
                file_size = os.path.getsize(file_path)
                print(f"Taille du fichier: {file_size} bytes")
                
                self.send_response(200)
                self.send_header('Content-type', 'video/mp4')
                self.send_header('Content-Length', str(file_size))
                self.send_header('Accept-Ranges', 'bytes')
                self.end_headers()
                
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                print(f"Fichier envoyé avec succès: {file_path}")
                return
            except Exception as e:
                print(f"Erreur lors de l'envoi du fichier: {str(e)}")
                self.send_error(500, f'Internal server error: {str(e)}')
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