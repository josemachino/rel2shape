CREATE TABLE IF NOT EXISTS ProdSupp (
    P_ID VARCHAR(255) NOT NULL,
    S_ID VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    PRIMARY KEY (P_ID, S_ID)
)  ENGINE=INNODB;

INSERT INTO ProdSupp (P_ID, S_ID,product,supplier) VALUES ('P1', 'S1','Onion','Auchan');
INSERT INTO ProdSupp (P_ID, S_ID,product,supplier) VALUES ('P2', 'S2','Carrot','Carrefour');
