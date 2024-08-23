CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(80),
    tags VARCHAR(20)[],
    user_id INTEGER REFERENCES users(id),
    user_name VARCHAR(100)
);
