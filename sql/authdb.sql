CREATE TABLE roles
(
    id   SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE users
(
    id uuid PRIMARY KEY NOT NULL,
    role_id INTEGER REFERENCES roles (id) NOT NULL,
    login   VARCHAR(255)                  NOT NULL,
    hash    VARCHAR(255)                  NOT NULL,
    salt    VARCHAR(255)                  NOT NULL
);
