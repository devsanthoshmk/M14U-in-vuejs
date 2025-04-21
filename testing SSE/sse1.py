from flask import Flask, Response, request, stream_with_context
from queue import Queue
import uuid

app = Flask(__name__)

# List of (client_id, queue)
clients = []

@app.route('/')
def index():
    client_id = str(uuid.uuid4())
    return f'''
        <!DOCTYPE html>
        <html>
        <body>
            <h2>SSE Listener</h2>
            <div><b>Client ID:</b> {client_id}</div>
            <div id="events"></div>
            <script>
                const clientId = "{client_id}";
                const evtSource = new EventSource("/stream?id=" + clientId);
                evtSource.onmessage = function(e) {{
                    const el = document.getElementById("events");
                    el.innerHTML += "<p>" + e.data + "</p>";
                }};

                function triggerBroadcast() {{
                    fetch('/trigger?id=' + clientId);
                }}
            </script>
            <button onclick="triggerBroadcast()">Trigger Broadcast</button>
        </body>
        </html>
    '''

@app.route('/stream')
def stream():
    client_id = request.args.get('id')
    q = Queue()
    clients.append((client_id, q))

    def event_stream():
        try:
            while True:
                data = q.get()
                yield f"data: {data}\n\n"
        except GeneratorExit:
            clients.remove((client_id, q))

    return Response(stream_with_context(event_stream()), content_type='text/event-stream')

@app.route('/trigger')
def trigger():
    trigger_id = request.args.get('id')
    message = f"Triggered at {request.remote_addr} ({trigger_id})"

    # Broadcast to all clients except the one that triggered
    for cid, q in clients:
        if cid != trigger_id:
            q.put(message)

    return "Broadcast triggered (except self)."

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
