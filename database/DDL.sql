CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(32) UNIQUE,
    password VARCHAR(100),
    fullname VARCHAR(100),
    role ENUM("USER", "ADMIN") DEFAULT "USER",
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP ON UPDATE NOW()
);

-- ============= MOVIES =================

CREATE TABLE movies (
	id INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(100),
	rating ENUM("G", "PG", "PG-13", "R", "NC-17"),
	duration INT,
	synopsis TEXT,
	is_active ENUM("Y", "N") DEFAULT "Y",
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP ON UPDATE NOW()
);

CREATE TABLE movies_cast_map (
	movie_id INT,
	actor VARCHAR(100),
	as_character VARCHAR(64),
	FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE movies_director_map (
	movie_id INT,
	director VARCHAR(100),
	FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE movies_genre_map (
	movie_id INT,
	genre VARCHAR(16),
	FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- =========== THEATRES ====================

CREATE TABLE theatres (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100)
);

CREATE TABLE theatres_seat (
	id INT PRIMARY KEY AUTO_INCREMENT,
	theatre_id INT,
	seat VARCHAR(16),
	FOREIGN KEY (theatre_id) REFERENCES theatres(id)
);

-- ============ SCREENING ===================

CREATE TABLE screening (
	id VARCHAR(64) PRIMARY KEY DEFAULT (UUID()),
	movie_id INT,
	theatre_id INT,
	show_time TIMESTAMP,
	created_at TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (movie_id) REFERENCES movies(id),
	FOREIGN KEY (theatre_id) REFERENCES theatres(id)
);

-- ============= ORDERS =================

CREATE TABLE orders (
	id VARCHAR(64) PRIMARY KEY DEFAULT (UUID()),
	user_id INT,
	screening_id VARCHAR(64),
	status ENUM("READY","COMPLETED"),
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP ON UPDATE NOW(),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (screening_id) REFERENCES screening(id)
);

CREATE TABLE orders_detail (
	id VARCHAR(64) PRIMARY KEY DEFAULT (UUID()),
	order_id VARCHAR(64),
	seat_id INT,
	FOREIGN KEY (order_id) REFERENCES orders(id),
	FOREIGN KEY (seat_id) REFERENCES theatres_seat(id)
);