from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('offer')
def handle_offer(offer):
    emit('offer', offer, broadcast=True)

@socketio.on('answer')
def handle_answer(answer):
    emit('answer', answer, broadcast=True)

@socketio.on('ice-candidate')
def handle_ice_candidate(candidate):
    emit('ice-candidate', candidate, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
