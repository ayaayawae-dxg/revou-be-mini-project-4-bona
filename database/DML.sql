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
