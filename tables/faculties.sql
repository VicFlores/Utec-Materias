CREATE TABLE public.faculties
(
    id serial NOT NULL,
    name character varying(150) NOT NULL,
    school character varying(150) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.faculties
    OWNER to vicflores11;