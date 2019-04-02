CREATE TABLE IF NOT EXISTS User (
    uid VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (uid)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Email (
    uid VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    PRIMARY KEY (uid),
    FOREIGN KEY (uid) REFERENCES User(uid)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Track (
    uid VARCHAR(255) NOT NULL,
    bid VARCHAR(255) NOT NULL,
    PRIMARY KEY (uid, bid),
	FOREIGN KEY (uid) REFERENCES User(uid),
	FOREIGN KEY (bid) REFERENCES Bug(bid)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Bug (
    bid VARCHAR(255) NOT NULL,
    descr VARCHAR(255) NOT NULL,
    uid VARCHAR(255) NOT NULL,
    PRIMARY KEY (bid),
	FOREIGN KEY (uid) REFERENCES User(uid)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Rel (
    bid VARCHAR(255) NOT NULL,
    rid VARCHAR(255) NOT NULL,
    PRIMARY KEY (bid, rid),
	FOREIGN KEY (bid) REFERENCES Bug(bid),
	FOREIGN KEY (rid) REFERENCES Bug(bid),
)  ENGINE=INNODB;

INSERT INTO User (uid, name) VALUES ('1', 'Jose');
INSERT INTO User (uid, name) VALUES ('2', 'Edith');
INSERT INTO Email (uid, mail) VALUES ('1', 'j@ex.com');
INSERT INTO Track (uid, bid) VALUES ('1', '1');
INSERT INTO Track (uid, bid) VALUES ('1', '2');

INSERT INTO Bug (bid, descr,uid) VALUES ('1', 'Boom!','1');
INSERT INTO Bug (bid, descr,uid) VALUES ('2', 'Kabang!','1');
INSERT INTO Bug (bid, descr,uid) VALUES ('3', 'Bang!','2');

INSERT INTO Rel (bid, rid) VALUES ('2', '1');
INSERT INTO Rel (bid, rid) VALUES ('1', '3');
