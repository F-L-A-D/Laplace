from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess
import os

PORT = int(os.environ.get("PORT", 8080))

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        subprocess.run(["python", "-m", "scripts.run_collectors"])

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

if __name__ == "__main__":
    server = HTTPServer(("", PORT), Handler)
    print(f"Server running on {PORT}")
    server.serve_forever()