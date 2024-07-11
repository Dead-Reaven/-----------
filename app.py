from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime  # Import the datetime module

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///driving_school.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    scores = db.relationship('Score', backref='user', lazy=True)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    score = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat(),
            'score': self.score
        }

# Создаем контекст приложения для db.create_all()
with app.app_context():
    db.create_all()

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    new_user = User(name=data['name'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.id, 'name': new_user.name}), 201

@app.route('/api/scores', methods=['POST'])
def add_score():
    data = request.get_json()
    user_id = data['user_id']
    date_str = data['date']
    score = data['score']

    # Convert the date string to a datetime.date object
    date = datetime.strptime(date_str, '%Y-%m-%d').date()

    new_score = Score(user_id=user_id, date=date, score=score)
    db.session.add(new_score)
    db.session.commit()
    return jsonify(new_score.serialize()), 201


# замість /api/scores/<int:user_id> було впроваджено /api/scores
@app.route('/api/scores', methods=['GET'])
def get_all_scores():
    scores = Score.query.all()
    return jsonify([score.serialize() for score in scores])

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
