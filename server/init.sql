
CREATE TABLE if not exists files (
       "id" serial primary key,
       "album" text,
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

CREATE TABLE if not exists log(
       "id" serial primary key,
       "timestamp" timestamp default CURRENT_TIMESTAMP, 
       "body" text,
       "ip" text
)      
