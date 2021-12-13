CREATE TABLE public.time_stamp
(
    id serial NOT NULL,
    start character varying(25) NOT NULL,
    finish character varying(25) NOT NULL,
	students INTEGER NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.time_stamp
    OWNER to vicflores11;