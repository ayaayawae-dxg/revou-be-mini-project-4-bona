# Mini Project + Milestone Assignment: Building a Movie Ticket Booking RESTful API with Authentication and Authorization using TypeScript and Express.js

## Description

An API for Movie Ticket Booking

## Library
1. [typescript](https://www.npmjs.com/package/typescript)
2. [express](https://www.npmjs.com/package/express)
3. [bcrypt](https://www.npmjs.com/package/bcrypt)
4. [express-openapi-validator](https://www.npmjs.com/package/express-openapi-validator)
5. [jwt](https://www.npmjs.com/package/jsonwebtoken)
5. [mysql2](https://www.npmjs.com/package/mysql2)

## How to run (with Docker)
1. Clone this repository.
2. Open project folder.
3. Type this on the Command Prompt.
	```
	docker compose up
	```
	This will generate a docker image and run a container that contain a MySQL container with DML & DDL data, and the server application container.
4. Wait until process completed, and the log showing :
	```properties
	app-1      | Database connected successfully
	app-1      | Server is running on 0.0.0.0:5000
	```
	If there is an error, it occurs because the server is already running while the DB is not done processing.

## Docker
1. [Server Dockerfile](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/blob/main/Dockerfile)  
This file is used to create a docker image for the server application.
2. [Docker Compose file](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/blob/main/docker-compose.yml)  
This file is used to run docker image from `Server Dockerfile` and `MySQL` image for the database. 


## API
For more details, open [api.yaml](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/blob/main/api.yaml) file

![image](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/assets/156976045/30607c61-e222-418e-9abe-f3118a9bf75f)

## Postman
### Collection [here](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/blob/main/postman/collection.json)
Collection is used to list all API used in the application.  
Using `/auth/login` with correct credential, will automatically set generated token from response, to enviroment variables `token`.

### Environment [here](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/blob/main/postman/environment.json)
Environment is used to define variables that used in the API Collection

## Database
### DDL [here](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/blob/main/database/DDL.sql)

```sql
use be-mini-project-4;

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
```

### DML [here](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/blob/main/database/DML.sql)

```sql
use be-mini-project-4;

-- MOVIES
INSERT INTO movies (id, title, rating, duration, synopsis) VALUES (1, "Movies 1", "G", 120, "Synopsis 1");
INSERT INTO movies (id, title, rating, duration, synopsis) VALUES (2, "Movies 2", "PG", 60, "Synopsis 2");

-- MOVIES CAST
INSERT INTO movies_cast_map (movie_id, actor, as_character) VALUES (1, "Actor 1", "Character A");
INSERT INTO movies_cast_map (movie_id, actor, as_character) VALUES (1, "Actor 2", "Character B");
INSERT INTO movies_cast_map (movie_id, actor, as_character) VALUES (2, "Actor 1", "Character A");
INSERT INTO movies_cast_map (movie_id, actor, as_character) VALUES (2, "Actor 3", "Character B");
INSERT INTO movies_cast_map (movie_id, actor, as_character) VALUES (2, "Actor 4", "Character C");

-- MOVIES GENRE
INSERT INTO movies_genre_map (movie_id, genre) VALUES (1, "Comedy");
INSERT INTO movies_genre_map (movie_id, genre) VALUES (1, "Horror");
INSERT INTO movies_genre_map (movie_id, genre) VALUES (2, "Romance");
INSERT INTO movies_genre_map (movie_id, genre) VALUES (2, "Mystery");
INSERT INTO movies_genre_map (movie_id, genre) VALUES (2, "Adventure");

-- MOVIES DIRECTOR
INSERT INTO movies_director_map (movie_id, director) VALUES (1, "Director 1");
INSERT INTO movies_director_map (movie_id, director) VALUES (2, "Director 1");
INSERT INTO movies_director_map (movie_id, director) VALUES (2, "Director 2");

-- THEATRE
INSERT INTO theatres (id, name) VALUES (1, "Theatre 1");
INSERT INTO theatres (id, name) VALUES (2, "Theatre 2");

-- THEATRE SEAT
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "A1");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "A2");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "A3");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "A4");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "B1");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "B2");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "B3");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (1, "B4");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "A1");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "A2");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "A3");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "A4");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "B1");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "B2");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "B3");
INSERT INTO theatres_seat (theatre_id, seat) VALUES (2, "B4");

-- SCREENING
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (1, 1, CONVERT_TZ("2024-04-15 10:55:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (1, 1, CONVERT_TZ("2024-05-13 19:00:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (1, 1, CONVERT_TZ("2024-05-13 10:00:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (1, 2, CONVERT_TZ("2024-05-13 15:30:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (1, 2, CONVERT_TZ("2024-05-14 11:00:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (2, 1, CONVERT_TZ("2024-05-13 06:00:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (2, 2, CONVERT_TZ("2024-05-13 08:00:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (2, 2, CONVERT_TZ("2024-05-13 10:00:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (2, 2, CONVERT_TZ("2024-05-13 12:30:00", '+07:00', 'UTC'));
INSERT INTO screening (movie_id, theatre_id, show_time) VALUES (2, 2, CONVERT_TZ("2024-05-14 11:00:00", '+07:00', 'UTC'));

-- USERS
INSERT INTO users (id, username, password, fullname, role) VALUES (1, "user1", "$2b$10$ciFu/0IRLNs6wGySiuj91.7sCe.fTWGmwv32BCeBEHvcmVYXyReTS", "User 1", "user");
INSERT INTO users (id, username, password, fullname, role) VALUES (2, "user2", "$2b$10$AQ7h5/Lk.Gwao1e9GgT9NuIXLyRBcuB4v7dwHliQkb3rshXnBLVii", "User 2", "user");
INSERT INTO users (id, username, password, fullname, role) VALUES (3, "admin", "$2b$10$YwGV2yjqdFIISSLyPKoeHOhTRQCz1jyf8mOjMZhn2z.G7SO43IwwG", "Admin", "admin");
```

### Schema
![image](https://github.com/ayaayawae-dxg/revou-be-mini-project-4-bona/assets/156976045/c635aedc-ebcd-4618-810f-4c7c5df476ea)
