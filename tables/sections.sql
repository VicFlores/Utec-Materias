CREATE TABLE public.sections
(
    id serial NOT NULL,
    sections integer NOT NULL,
    hours character varying(10) NOT NULL,
	days character varying(20) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.sections
    OWNER to vicflores11;