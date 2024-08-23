CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
	order_num INT,
    type VARCHAR(50),
    content TEXT
);