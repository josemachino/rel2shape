CREATE TABLE IF NOT EXISTS MasterStudent (
    ms_id VARCHAR(255) NOT NULL,
    ms_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (ms_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS BachStudent (
    bs_id VARCHAR(255) NOT NULL,
    bs_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (bs_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Course (
    c_id VARCHAR(255) NOT NULL,
    c_subject VARCHAR(255) NOT NULL,
    PRIMARY KEY (c_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS MasterEnrollment (
    stud_id VARCHAR(255) NOT NULL,
    cour_id VARCHAR(255) NOT NULL,
	e_grade VARCHAR(255) NOT NULL,
    e_year VARCHAR(255) NOT NULL,
    PRIMARY KEY (stud_id, cour_id, e_year),
	FOREIGN KEY (stud_id) REFERENCES MasterStudent(ms_id),
	FOREIGN KEY (cour_id) REFERENCES Course(c_id)
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS BachEnrollment (
    stud_id VARCHAR(255) NOT NULL,
    cour_id VARCHAR(255) NOT NULL,
	e_grade VARCHAR(255) NOT NULL,
    e_year VARCHAR(255) NOT NULL,
    PRIMARY KEY (stud_id, cour_id, e_year),
	FOREIGN KEY (stud_id) REFERENCES BachEnrollment(bs_id),
	FOREIGN KEY (cour_id) REFERENCES Course(c_id)
)ENGINE=INNODB;

INSERT INTO MasterStudent (ms_id, ms_name) VALUES ('100', 'Ana');
INSERT INTO MasterStudent (ms_id, ms_name) VALUES ('101', 'Juan');

INSERT INTO BachStudent (bs_id, bs_name) VALUES ('200', 'Rosa');
INSERT INTO BachStudent (bs_id, bs_name) VALUES ('201', 'Pedro');

INSERT INTO Course (c_id, c_subject) VALUES ('300', 'Math');
INSERT INTO Course (c_id, c_subject) VALUES ('301', 'Logic');

INSERT INTO MasterEnrollment (stud_id, cour_id, e_grade, e_year) VALUES ('100', '300', '15', '2016');
INSERT INTO MasterEnrollment (stud_id, cour_id, e_grade, e_year) VALUES ('100', '300', '15', '2017');
INSERT INTO MasterEnrollment (stud_id, cour_id, e_grade, e_year) VALUES ('101', '301', '18', '2017');

INSERT INTO BachEnrollment (stud_id, cour_id, e_grade, e_year) VALUES ('201', '300', '14', '2016');
INSERT INTO BachEnrollment (stud_id, cour_id, e_grade, e_year) VALUES ('201', '300', '14', '2017');
INSERT INTO BachEnrollment (stud_id, cour_id, e_grade, e_year) VALUES ('201', '301', '16', '2016');
INSERT INTO BachEnrollment (stud_id, cour_id, e_grade, e_year) VALUES ('200', '301', '17', '2017');
