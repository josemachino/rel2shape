CREATE TABLE IF NOT EXISTS Student (
    s_id VARCHAR(255) NOT NULL,
    s_name VARCHAR(255) NOT NULL,
	s_phone VARCHAR(255) NOT NULL,
	s_ssn VARCHAR(255) NOT NULL,
    PRIMARY KEY (s_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Professor (
    p_id VARCHAR(255) NOT NULL,
    p_name VARCHAR(255) NOT NULL,
	p_office VARCHAR(255) NOT NULL,
    PRIMARY KEY (p_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Course (
    c_id VARCHAR(255) NOT NULL,
    c_name VARCHAR(255) NOT NULL,
	prof_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (c_id),
	FOREIGN KEY (prof_id) REFERENCES Professor(p_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Enrollment (
    stud_id VARCHAR(255) NOT NULL,
    cour_id VARCHAR(255) NOT NULL,
	e_grade VARCHAR(255) NOT NULL,
    e_year VARCHAR(255) NOT NULL,
    PRIMARY KEY (stud_id, cour_id, e_year),
	FOREIGN KEY (stud_id) REFERENCES Student(s_id),
	FOREIGN KEY (cour_id) REFERENCES Course(c_id)
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS TA (
    stud_id VARCHAR(255) NOT NULL,
    cour_id VARCHAR(255) NOT NULL,
	e_year VARCHAR(255) NOT NULL,
	salary VARCHAR(255) NOT NULL,
    PRIMARY KEY (stud_id, cour_id,e_year),
	FOREIGN KEY (stud_id) REFERENCES Enrollment(stud_id),
	FOREIGN KEY (cour_id) REFERENCES Enrollment(cour_id),
	FOREIGN KEY (e_year) REFERENCES Enrollment(e_year)
)ENGINE=INNODB;

INSERT INTO Student (s_id, s_name,s_phone,s_ssn) VALUES ('100', 'Ana','0612208026','12');
INSERT INTO Student (s_id, s_name,s_phone,s_ssn) VALUES ('101', 'Pame','0612208027','13');
INSERT INTO Professor (p_id, p_name,p_office) VALUES ('100', 'Raul','B101');
INSERT INTO Course (c_id, c_name,prof_id) VALUES ('300', 'Math','100');

INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('100', '300', '09', '2016');
INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('100', '300', '15', '2017');
INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('101', '300', '18', '2016');

INSERT INTO TA (stud_id, cour_id,e_year,salary) VALUES ('101', '300','2016','100');
