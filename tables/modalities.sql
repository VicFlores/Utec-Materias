CREATE TABLE public.modalities
(
    id serial NOT NULL,
    types character varying(25) NOT NULL,
    class character varying(200) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.modalities
    OWNER to vicflores11;