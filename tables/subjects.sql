CREATE TABLE public.subjects
(
    id serial NOT NULL,
    name character varying(100) NOT NULL,
    cod_subject character varying(15) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.subjects
    OWNER to vicflores11;