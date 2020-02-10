--Enumérations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'probabilities') THEN
        CREATE TYPE "probabilities" AS ENUM (
            'sure',
            'good',
            'hard',
            'testing'
        );
    END IF;
END$$;

-- Drop tables
DO $$
BEGIN
    DROP TABLE IF EXISTS opportunities CASCADE;
    DROP TABLE IF EXISTS leads CASCADE;
    DROP TABLE IF EXISTS opportunities_comments ;
END$$;

-- Drop tables
DO $$
BEGIN
    CREATE TABLE opportunities (
        id              SERIAL PRIMARY KEY,
        label           varchar(100) NOT NULL UNIQUE,
        created_at      date default now(),
        amount          float,
        probability     probabilities default 'testing'
    );

    CREATE TABLE leads (
        id              SERIAL PRIMARY KEY,
        email           varchar(100) NOT NULL,
        first_name      varchar(100) default '',
        last_name       varchar(100) default '',
        opportunity_id  int REFERENCES opportunities(id),
        created_at      date default now()

    );

    CREATE TABLE opportunities_comments (
        id              SERIAL PRIMARY KEY,
        users_id        varchar(40) REFERENCES users(id),
        opportunity_id  int REFERENCES opportunities(id),
        created_at      date default now(),
        comment         varchar(1000) default ''
    );
END$$;





