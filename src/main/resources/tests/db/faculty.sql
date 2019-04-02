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

CREATE TABLE IF NOT EXISTS Faculty (
    f_id VARCHAR(255) NOT NULL,
    f_name VARCHAR(255) NOT NULL,	
    PRIMARY KEY (f_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS FacultyProfessor (
    fac_id VARCHAR(255) NOT NULL,
    prof_id VARCHAR(255) NOT NULL,	
    PRIMARY KEY (fac_id,prof_id),
    FOREIGN KEY (prof_id) REFERENCES Professor(p_id),
    FOREIGN KEY (fac_id) REFERENCES Faculty(f_id)
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
	e_grade int,
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
INSERT INTO Student (s_id, s_name,s_phone,s_ssn) VALUES ('102', 'Ines','0612208028','14');
INSERT INTO Student (s_id, s_name,s_phone,s_ssn) VALUES ('103', 'Juan','0612208029','15');
INSERT INTO Professor (p_id, p_name,p_office) VALUES ('100', 'Raul','B101');
INSERT INTO Professor (p_id, p_name,p_office) VALUES ('103', 'Jose','B102');
INSERT INTO Course (c_id, c_name,prof_id) VALUES ('300', 'Math','103');
INSERT INTO Course (c_id, c_name,prof_id) VALUES ('301', 'Medicine','100');
INSERT INTO Course (c_id, c_name,prof_id) VALUES ('302', 'Biology','100');

INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('100', '300', 19, '2016');
INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('100', '300', 15, '2017');
INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('101', '301', 12, '2016');
INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('102', '301', 13, '2016');
INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('102', '300', 18, '2015');
INSERT INTO Enrollment (stud_id, cour_id, e_grade, e_year) VALUES ('103', '302', 17, '2016');

INSERT INTO TA (stud_id, cour_id,e_year,salary) VALUES ('101', '301','2016','100');
INSERT INTO TA (stud_id, cour_id,e_year,salary) VALUES ('102', '301','2016','100');
INSERT INTO TA (stud_id, cour_id,e_year,salary) VALUES ('102', '300','2015','100');
INSERT INTO TA (stud_id, cour_id,e_year,salary) VALUES ('103', '302','2016','100');

INSERT INTO Faculty (f_id, f_name) VALUES ('1', 'BIO-Molecular');
INSERT INTO Faculty (f_id, f_name) VALUES ('2', 'BIO-Agriculture');
INSERT INTO Faculty (f_id, f_name) VALUES ('3', 'Computer Science');
INSERT INTO FacultyProfessor (fac_id, prof_id) VALUES ('1', '100');
INSERT INTO FacultyProfessor (fac_id, prof_id) VALUES ('2', '100');
INSERT INTO FacultyProfessor (fac_id, prof_id) VALUES ('3', '103');
