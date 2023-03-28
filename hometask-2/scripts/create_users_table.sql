CREATE TABLE users (
	id UUID PRIMARY KEY,
	login VARCHAR ( 30 ) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	age SMALLINT CHECK(age > 3 AND age < 131) NOT NULL,
	is_deleted boolean NOT NULL
);
