CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(155) UNIQUE,
    image VARCHAR(255),
    interest VARCHAR(80)[],
    provider VARCHAR(80),
    role VARCHAR(80) DEFAULT 'user'
)