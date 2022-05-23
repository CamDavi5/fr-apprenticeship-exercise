use fetchuser;

create table camdavis(
id int not null auto_increment primary key,
payer varchar(50) not null,
points int not null,
timestamp varchar(20));

insert into camdavis (id, payer, points, timestamp)
values (null, "DANNON", 1000, "2020-11-02T14:00:00Z");
insert into camdavis (id, payer, points, timestamp)
values (null, "UNVEILER", 200, "2020-10-31T11:00:00Z");
insert into camdavis (id, payer, points, timestamp)
values (null, "DANNON", -200, "2020-10-31T15:00:00Z");
insert into camdavis (id, payer, points, timestamp)
values (null, "MILLER COORS", 10000, "2020-11-01T14:00:00Z");
insert into camdavis (id, payer, points, timestamp)
values (null, "DANNON", 300, "2020-10-31T10:00:00Z");