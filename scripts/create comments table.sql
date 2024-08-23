CREATE TABLE IF NOT EXISTS comments (
	id SERIAL PRIMARY KEY,
	post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	created_at DATE,
	content TEXT
)