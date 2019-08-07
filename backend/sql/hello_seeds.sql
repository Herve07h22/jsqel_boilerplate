INSERT INTO Hello (message) VALUES ('Hello world') ON CONFLICT DO NOTHING;
INSERT INTO Hello (message) VALUES ('Bonjour le monde') ON CONFLICT DO NOTHING;

