CREATE TABLE users (
    id                  CHAR(8)                     NOT NULL,
    name                VARCHAR(45)                 NOT NULL
    email               VARCHAR(315)                NOT NULL,
    password            BLOB                        NOT NULL,
    primary key (id)
);

CREATE TABLE courses (
    id                  CHAR(8)         NOT NULL,
    name                VARCHAR(125)    NOT NULL,
    PRIMARY KEY (code)
);

CREATE TABLE students (
    id                  CHAR(8)         NOT NULL,
    name                VARCHAR(45)     NOT NULL,
    last_name           VARCHAR(45)     NOT NULL,
    half_year           CHAR(2)         NOT NULL,
    course              CHAR(8)         NOT NULL,
    img_profile         VARCHAR(255)    NULL DEFAULT ('none'),
    PRIMARY KEY (id),
    FOREIGN KEY (user_assigned) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(code)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE students_about_me (
    id_student          CHAR(8)         NOT NULL,
    description         TEXT            DEFAULT ('none'),
    skills              TEXT            DEFAULT ('none'),
    goals               TEXT            DEFAULT ('none'),
    strengths           TEXT            DEFAULT ('none'),
    academic_interests  TEXT            DEFAULT ('none'),
    achievements        TEXT            DEFAULT ('none'),
    phrase              TEXT            DEFAULT ('none'),
    FOREIGN KEY (id_student) REFERENCES students(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE students_projects (
    id                  CHAR(8)         NOT NULL,
    id_student          CHAR(8)         NOT NULL,
    title               TEXT            DEFAULT ('none'),
    description         TEXT            DEFAULT ('none'),
    images              TEXT            DEFAULT ('none'),
    link                TEXT            DEFAULT ('none'),
    PRIMARY KEY (id),
    FOREIGN KEY (id_student) REFERENCES students(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO courses (code, name)
VALUES ('000-none', 'Sin asignar'),
       ('ARQ-2023', 'Licenciatura en arquitectura'),
       ('TUR-2023', 'Licenciatura en Turismo '),
       ('GAS-2023', 'Licenciatura en Gastronomía'),
       ('EMP-2023', 'Ingeniería en Gestión Empresarial '),
       ('ELE-2023', 'Ingeniería en electromecánica'),
       ('SIS-2023', 'Ingeniería en Sistemas Computacionales');
