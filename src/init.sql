CREATE TABLE if not exists album (
       id serial primary key,
       albumName text
);

CREATE TABLE if not exists files (
       id serial primary key,
       album_id int,
       fileName text,
       filePath text,
       deleted bool default false,
       expires date,
       createted timestamp,
       userName text,
       ipaddress text,
       fileSize numeric
);

CREATE TABLE if not exists comment (
       id serial primary key,
       fileID int,
       userName text,
       body text,
       commentDate date
);
