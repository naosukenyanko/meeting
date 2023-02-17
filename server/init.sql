CREATE TABLE if not exists album (
       "id" serial primary key,
       "albumName" text
);


CREATE TABLE if not exists files (
       "id" serial primary key,
       "albumID" int,
       "fileName" text,
       "filePath" text,
       "thumbnail" text,
       "deleted" bool default false,
       "expires" date,
       "created" timestamp,
       "userName" text,
       "ipAddress" text,
       "fileSize" numeric
);

CREATE TABLE if not exists comment (
       "id" serial primary key,
       "fileID" int,
       "userName" text,
       "body" text,
       "commentDate" date
);
