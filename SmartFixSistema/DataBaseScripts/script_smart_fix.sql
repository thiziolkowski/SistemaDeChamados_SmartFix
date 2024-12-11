CREATE DATABASE SMART_FIX;						-- DROP DATABASE SMART_FIX;

USE SMART_FIX;


-- ********************************************************************************************************
--                               DDL - DEFININDO ESTRUTURA DE TABELAS
-- ********************************************************************************************************
CREATE TABLE tb_classificacao (
    cla_id 		  INT AUTO_INCREMENT  NOT NULL UNIQUE,
    cla_nome 	  VARCHAR(20)         NOT NULL UNIQUE,
    
    PRIMARY KEY (cla_id)
);


CREATE TABLE tb_itens (
    itm_id 		INT AUTO_INCREMENT  NOT NULL UNIQUE,
    itm_nome 	VARCHAR(20)         NOT NULL UNIQUE,
    
    PRIMARY KEY (itm_id)
);


CREATE TABLE tb_bloco (
    bl_id 		INT AUTO_INCREMENT  NOT NULL UNIQUE,
    bl_nome 	VARCHAR(20)         	NULL UNIQUE,
    
    PRIMARY KEY (bl_id)
);


CREATE TABLE tb_sala (
    sl_id 		  INT AUTO_INCREMENT  NOT NULL UNIQUE,
    sl_num 		  VARCHAR(10)         NOT NULL,
    bl_id 		  INT           	  NOT NULL,
    
    PRIMARY KEY       (sl_id),
    KEY bl_nome_sala  (bl_id),
    CONSTRAINT tb_sala_ibfk_1 FOREIGN KEY (bl_id) 	REFERENCES 	tb_bloco(bl_id)
);


CREATE TABLE tb_maquina (
    maq_id 		INT AUTO_INCREMENT  NOT NULL UNIQUE,
    maq_num 	VARCHAR(10)         NOT NULL, 
    sl_id     	INT                 NOT NULL, 
    bl_id       INT                 NOT NULL,
    PRIMARY KEY     (maq_id),
    KEY sl_id_maq  (sl_id),
    KEY bl_id_maq  (bl_id),
    CONSTRAINT tb_maquina_ibfk_1 FOREIGN KEY (sl_id) 	REFERENCES 	tb_sala(sl_id),
    CONSTRAINT tb_maquina_ibfk_2 FOREIGN KEY (bl_id) 	REFERENCES 	tb_bloco(bl_id)
);


CREATE TABLE tb_chamado (
  cha_id 		    int(11) 		    NOT NULL AUTO_INCREMENT,
  cha_dt_inicio 	date 			   	NOT NULL,
  cla_id 		    int 			    NOT NULL,
  itm_id 		    int 			    NOT NULL,
  cha_assunto 		varchar(50) 		NOT NULL,
  maq_id 		    int 			    NOT NULL,
  sl_id 		    int 			    NOT NULL,
  bl_id 		    int 			    NOT NULL,
  cha_desc 		  	varchar(300) 		DEFAULT NULL,
  cha_sit 		  	varchar(20) 		NOT NULL DEFAULT 'Aberto',
  cha_dt_fim 	 	date 			    DEFAULT NULL,
  cha_notes 	 	varchar(300) 		DEFAULT NULL,
  
  PRIMARY KEY (cha_id),
  UNIQUE KEY 	  cha_id 	(cha_id),
  KEY 			  cla_id 	(cla_id),
  KEY 			  itm_id 	(itm_id),
  KEY 			  maq_id 	(maq_id),
  KEY 			  sl_id 	(sl_id),
  KEY 			  bl_id 	(bl_id),
  CONSTRAINT tb_chamado_ibfk_1 FOREIGN KEY (cla_id) 	REFERENCES tb_classificacao (cla_id),
  CONSTRAINT tb_chamado_ibfk_2 FOREIGN KEY (itm_id) 	REFERENCES tb_itens         (itm_id),
  CONSTRAINT tb_chamado_ibfk_3 FOREIGN KEY (maq_id) 	REFERENCES tb_maquina       (maq_id),
  CONSTRAINT tb_chamado_ibfk_4 FOREIGN KEY (sl_id) 	  REFERENCES tb_sala          (sl_id),
  CONSTRAINT tb_chamado_ibfk_5 FOREIGN KEY (bl_id) 	  REFERENCES tb_bloco         (bl_id)
);


CREATE TABLE tb_usuario (
  user_id     INT               NOT NULL AUTO_INCREMENT,
  cha_id      INT               NOT NULL,
  user_email  varchar(100)      NOT NULL,
  
  PRIMARY KEY (user_id),
  CONSTRAINT tb_usuario_ibfk_1 FOREIGN KEY (cha_id) 	REFERENCES 	tb_chamado(cha_id)
);


CREATE TABLE tb_administrador (
  adm_id      int(11)           NOT NULL,
  adm_nome    varchar(50)       DEFAULT NULL,
  adm_senha   varchar(100)      DEFAULT NULL,
  adm_status  smallint(6)       DEFAULT NULL,  
  
  PRIMARY KEY (adm_id)
);



-- ********************************************************************************************************
--                                       CRIANDO PROCEDURE
-- ********************************************************************************************************

-- LISTA DE OPÇÕES DE ACTION

--  'Update_TbCha'			Atualizar chamado
--  'Delete_TbCha'			Deletar chamado
--  'Insert_TbCha'			Inserir chamado
--  'SelectId_TbCha'		Buscar chamado pelo ID
--  'SelectAll_TbCha'		Buscar todos chamados
--  'Update_TbBlo'			Atualizar bloco
--  'Delete_TbBlo'			Deletar bloco
--  'Insert_TbBlo'			Inserir bloco
--  'SelectId_TbBlo'		Buscar bloco por ID
--  'Select_TbBlo'     Selecionar bloco com filtros
--  'SelectAll_TbBlo'       Buscar todos blocos
--  'Update_TbCla'			Atualizar classificação
--  'Delete_TbCla'			Deletar classificação
--  'Insert_TbCla'			Inserir classificação
--  'SelectId_TbCla'		Buscar classificação pelo ID
--  'SelectAll_TbCla'       Buscar todas classificações
--  'Update_TbItm'          Atualizar item
--  'Delete_TbItm'			Deletar item
--  'Insert_TbItm'			Inserir item
--  'SelectId_TbItm'		Buscar item pelo ID
--  'SelectAll_TbItm'		Buscar todos itens
--  'Update_TbMaq'			Atualizar maquina
--  'Delete_TbMaq'			Deletar máquina
--  'Insert_TbMaq'			Inserir máquina
--  'SelectId_TbMaq'		Buscar máquina pelo ID
--  'Select_TbMaq''     Selecionar máquina com filtros
--  'SelectAll_TbMaq'		Buscar todas máquinas
--  'Update_TbSal'			Atualizar sala
--  'Delete_TbSal'			Deletar sala
--  'Insert_TbSal'			Inserir sala
--  'SelectId_TbSal' 		Selecionar sala pelo ID
--  'Select_TbSal''     Selecionar sala com filtros
--  'SelectAll_TbSal'		Selecionar todas salas

DELIMITER $$

CREATE PROCEDURE ComandosSmartFix(

  IN Action VARCHAR      (50),
  IN P_Cha_id       INT,
  IN P_Cha_Sit      VARCHAR(50),
  IN P_Cha_dt_fim   DATE,
  IN P_Cha_notes    VARCHAR(300),
  IN P_cla_nome     VARCHAR(20),
  IN P_itm_nome     VARCHAR(20),
  IN P_Cha_assunto  VARCHAR(50),
  IN P_maq_num      VARCHAR(10),
  IN P_sl_num       VARCHAR(10),
  IN P_bl_nome      VARCHAR(20),
  IN P_Cha_desc     VARCHAR(300),
  IN P_Bl_id        INT,
  IN P_Cl_id        INT,
  IN P_Itm_id       INT,
  IN P_Maq_id       INT,
  IN P_Sl_id        INT,
  IN P_bl_departamento VARCHAR(20),
  IN P_user_email VARCHAR(100),
  IN P_Cha_dt_inicio DATE
)
BEGIN

  -- --------------------------------------------------------------------------------------------
  -- Actions referentes a tb_chamado
  
  IF Action = 'Update_TbCha' THEN
	IF(select cha_sit from tb_chamado where cha_id= P_Cha_id) = (select "Finalizado") THEN
		select "erro";
	ELSE
    IF P_Cha_Sit = "Finalizado" THEN
		UPDATE tb_chamado
			SET cha_sit     = P_Cha_Sit,
				cha_dt_fim  = IFNULL(P_Cha_dt_fim, curdate()),
				cha_notes   = P_Cha_notes
			WHERE cha_id    = P_Cha_id;
		select * from tb_chamado where cha_id= P_Cha_id;
		ELSE
		UPDATE tb_chamado
			SET cha_sit     = P_Cha_Sit,
				cha_notes   = P_Cha_notes
			WHERE cha_id    = P_Cha_id;
     select * from tb_chamado where cha_id= P_Cha_id;
		END IF;
     END IF;
  END IF;

-- ----------------------------------------------    

  IF Action = 'Delete_TbCha' THEN
    
    DELETE FROM tb_chamado
          WHERE cha_id = P_Cha_id;
  END IF;
-- ----------------------------------------------    

  IF Action = 'Insert_TbCha' THEN
    
    INSERT INTO tb_chamado 
                (cla_id,cha_dt_inicio, itm_id, cha_assunto, maq_id, sl_id, bl_id, cha_desc)           
          VALUES 
                (P_Cl_id, curdate(),P_Itm_id, P_Cha_assunto, P_Maq_id, P_Sl_id, P_Bl_id, P_Cha_desc);
	SET @cha_fk = LAST_INSERT_ID();
                
	INSERT INTO tb_usuario
		(cha_id, user_email)
	VALUES
        (@cha_fk,P_user_email);
        
  END IF;
-- ----------------------------------------------    
  IF Action = 'SelectId_TbCha' THEN
    
    SELECT * FROM tb_chamado
     WHERE cha_id = P_Cha_id;
  END IF;
-- ----------------------------------------------   

-- ----------------------------------------------    
  IF Action = 'Select_TbCha' THEN
    SELECT 
		cha_id, 
        cha_dt_inicio, 
        cla_nome, 
        cha_assunto,
        itm_nome,
        maq_num, 
        sl_num, 
        bl_nome,
        cha_sit,
        IFNULL(cha_dt_fim, "---") as cha_dt_fim,
        cha_notes
        FROM tb_chamado
	left join tb_bloco on
		tb_bloco.bl_id = tb_chamado.bl_id
	left join tb_sala on
		tb_sala.sl_id = tb_chamado.sl_id
	left join tb_maquina on
		tb_maquina.maq_id = tb_chamado.maq_id
	left join tb_classificacao on
		tb_classificacao.cla_id = tb_chamado.cla_id
	left join tb_itens on
		tb_itens.itm_id = tb_chamado.itm_id 
     WHERE (1=1)
     AND ((P_Cha_id is null) or (cha_id = P_Cha_id))
     AND ((P_Cl_id is null) or (tb_chamado.cla_id = P_Cl_id))
     AND ((P_Bl_id is null) or (tb_chamado.bl_id = P_Bl_id))
     AND ((P_Itm_id is null) or (tb_chamado.itm_id = P_Itm_id))
     AND ((P_Sl_id is null) or (tb_chamado.sl_id = P_Sl_id))
     AND ((P_Maq_id is null) or (tb_chamado.maq_id = P_Maq_id))
     AND ((P_Cha_Sit is null) or (cha_sit like CONCAT('%', P_Cha_Sit, '%')))
     AND ((P_Cha_dt_fim is null) or (cha_dt_fim = P_Cha_dt_fim))
     AND ((P_Cha_dt_inicio is null) or (cha_dt_inicio = P_Cha_dt_inicio));
  END IF;
-- ----------------------------------------------   

-- ----------------------------------------------    
  IF Action = 'Select_TbCha_Edit' THEN
    SELECT 
		cha_id, 
        cha_dt_inicio, 
        cla_nome, 
        cha_assunto,
        itm_nome,
        maq_num, 
        sl_num, 
        bl_nome,
        cha_sit,
        IFNULL(cha_dt_fim, "---") as cha_dt_fim
        FROM tb_chamado
	left join tb_bloco on
		tb_bloco.bl_id = tb_chamado.bl_id
	left join tb_sala on
		tb_sala.sl_id = tb_chamado.sl_id
	left join tb_maquina on
		tb_maquina.maq_id = tb_chamado.maq_id
	left join tb_classificacao on
		tb_classificacao.cla_id = tb_chamado.cla_id
	left join tb_itens on
		tb_itens.itm_id = tb_chamado.itm_id 
     WHERE (1=1)
     AND ((P_Cha_id is null) or (cha_id = P_Cha_id))
     AND ((P_Cl_id is null) or (tb_chamado.cla_id = P_Cl_id))
     AND ((P_Bl_id is null) or (tb_chamado.bl_id = P_Bl_id))
     AND ((P_Itm_id is null) or (tb_chamado.itm_id = P_Itm_id))
     AND ((P_Sl_id is null) or (tb_chamado.sl_id = P_Sl_id))
     AND ((P_Maq_id is null) or (tb_chamado.maq_id = P_Maq_id))
     AND cha_sit <> "Finalizado"
     AND ((P_Cha_dt_fim is null) or (cha_dt_fim = P_Cha_dt_fim))
     AND ((P_Cha_dt_inicio is null) or (cha_dt_inicio = P_Cha_dt_inicio));
  END IF;
-- ----------------------------------------------   

  IF Action = 'SelectAll_TbCha' THEN
    
    SELECT * FROM tb_chamado;
  END IF;


  -- --------------------------------------------------------------------------------------------
  -- Actions referentes a tb_bloco
  
  IF Action = 'Update_TbBlo' THEN
    
    IF NOT EXISTS(select * from tb_bloco where bl_nome = P_bl_nome) THEN
    UPDATE tb_bloco
       SET bl_nome  = P_bl_nome
     WHERE bl_id    = P_Bl_id;
    
	select * from tb_bloco where bl_id = P_Bl_id;
    ELSE
		select 'erro';
	END IF;
  END IF;
-- ----------------------------------------------    

  IF Action = 'Delete_TbBlo' THEN
    
    DELETE FROM tb_bloco
          WHERE bl_id = P_Bl_id;
  END IF;
-- ----------------------------------------------    

  IF Action = 'Insert_TbBlo' THEN
    
    IF NOT EXISTS(select * from tb_bloco where bl_nome = P_bl_nome) THEN
    INSERT INTO tb_bloco (bl_nome)
         VALUES (P_bl_nome);
	SET @P_bl_id = LAST_INSERT_ID();
    
    select * from tb_bloco where bl_id = @P_bl_id;
    ELSE
		select 'erro';
	END IF;
  END IF;
-- ----------------------------------------------    

  IF Action = 'SelectId_TbBlo' THEN
    
    SELECT * FROM tb_bloco
     WHERE bl_id = P_Bl_id;
  END IF;
-- ----------------------------------------------    

  -- ----------------------------------------------    
  
  IF Action = 'Select_TbBlo' THEN 
 
    SELECT bl_id, bl_nome FROM tb_bloco
            WHERE (1 = 1)
            AND ((P_bl_nome is null) or (bl_nome like CONCAT('%', P_bl_nome, '%')));
  END IF;
  -- ----------------------------------------------  
  
  IF Action = 'SelectAll_TbBlo' THEN
    
    SELECT * FROM tb_bloco;
  END IF;

  -- --------------------------------------------------------------------------------------------
  -- Actions referentes a tb_classificacao

  IF Action = 'Update_TbCla' THEN

    UPDATE tb_classificacao
       SET cla_nome = P_cla_nome
     WHERE cla_id   = P_Cl_id;
  END IF;
-- ----------------------------------------------    

  IF Action = 'Delete_TbCla' THEN

    DELETE FROM tb_classificacao
          WHERE cla_id = P_Cl_id;
  END IF;
-- ----------------------------------------------    

  IF Action = 'Insert_TbCla' THEN

    INSERT INTO tb_classificacao (cla_nome)
         VALUES (P_cla_nome);
  END IF;
-- ----------------------------------------------    

  IF Action = 'SelectId_TbCla' THEN

    SELECT * FROM tb_classificacao
     WHERE cla_id = P_Cl_id;
  END IF;
-- ----------------------------------------------    

  IF Action = 'SelectAll_TbCla' THEN

    SELECT * FROM tb_classificacao;
  END IF;

  -- --------------------------------------------------------------------------------------------
  -- Actions referentes a tb_itens
  
  IF Action = 'Update_TbItm' THEN

    UPDATE tb_itens
       SET itm_nome = P_itm_nome
     WHERE itm_id   = P_Itm_id;
  END IF;
-- ----------------------------------------------    
  IF Action = 'Delete_TbItm' THEN

    DELETE FROM tb_itens
          WHERE itm_id = Itm_id;
  END IF;
-- ----------------------------------------------    

  IF Action = 'Insert_TbItm' THEN

    INSERT INTO tb_itens (itm_nome)
         VALUES (P_itm_nome);
  END IF;
-- ----------------------------------------------    

  IF Action = 'SelectId_TbItm' THEN

    SELECT * FROM tb_itens
     WHERE itm_id = P_Itm_id;
  END IF;
-- ----------------------------------------------    

  IF Action = 'SelectAll_TbItm' THEN

    SELECT * FROM tb_itens;
  END IF;

  -- --------------------------------------------------------------------------------------------
  -- Actions referentes a tb_maquina
 
  IF Action = 'Update_TbMaq' THEN
 
 IF NOT EXISTS(select * from tb_maquina where maq_num = P_maq_num and sl_id = P_Sl_id and bl_id = P_Bl_id) THEN
    UPDATE tb_maquina
       SET maq_num  = P_maq_num,
		   sl_id    = P_Sl_id,
		   bl_id    = P_Bl_id
     WHERE maq_id   = P_Maq_id;
    
	select * from tb_maquina where maq_id = P_Maq_id;
 ELSE
	SELECT 'erro';
   END IF;
  END IF;
  -- ----------------------------------------------    
  IF Action = 'Delete_TbMaq' THEN
 
    DELETE FROM tb_maquina
          WHERE maq_id = P_Maq_id;
  END IF;
  -- ----------------------------------------------    

  IF Action = 'Insert_TbMaq' THEN
 
 IF NOT EXISTS(select * from tb_maquina where maq_num = P_maq_num and sl_id = P_Sl_id and bl_id = P_Bl_id) THEN
    INSERT INTO tb_maquina (maq_num, sl_id, bl_id)
         VALUES (P_maq_num, P_Sl_id, P_Bl_id);
	SET @P_maq_id = LAST_INSERT_ID();
    
	select * from tb_maquina where maq_id = @P_maq_id;
 ELSE
	SELECT 'erro';
  END IF;
  END IF;
  -- ----------------------------------------------    

  IF Action = 'SelectId_TbMaq' THEN
 
    SELECT * FROM tb_maquina
    WHERE maq_id = P_Maq_id;
  END IF;
  -- ----------------------------------------------    

 -- ----------------------------------------------    
  
  IF Action = 'Select_TbMaq' THEN 
 
    SELECT maq_id, maq_num, sl_num, bl_nome, tb_maquina.sl_id, tb_maquina.bl_id FROM tb_maquina
    inner join tb_bloco on
		tb_bloco.bl_id = tb_maquina.bl_id
	inner join tb_sala on
		tb_sala.sl_id = tb_maquina.sl_id
            WHERE (1 = 1)
            AND ((P_maq_num is null) or (maq_num like CONCAT('%',P_maq_num,'%')))
            AND ((P_Sl_id is null) or (tb_maquina.sl_id = P_Sl_id))
            AND ((P_Bl_id is null) or  (tb_maquina.bl_id = P_Bl_id));
  END IF;
  -- ----------------------------------------------    
  
  IF Action = 'SelectAll_TbMaq' THEN
 
    SELECT * FROM tb_maquina;
  END IF;
 
  -- --------------------------------------------------------------------------------------------
  -- Actions referentes a tb_sala
 
  IF Action = 'Update_TbSal' THEN
 
 IF NOT EXISTS(select * from tb_sala where sl_num = P_sl_num and bl_id = P_Bl_id) THEN
     UPDATE tb_sala
        SET sl_num = P_sl_num,
			bl_id = P_Bl_id
      WHERE sl_id = P_Sl_id;
    
	select * from tb_sala where sl_id = P_Sl_id;
    ELSE 
		SELECT 'erro';
	END IF;
  END IF;
  -- ----------------------------------------------    
  IF Action = 'Delete_TbSal' THEN
 
    DELETE FROM tb_sala
          WHERE sl_id = P_Sl_id;
  END IF;
  -- ----------------------------------------------    

  IF Action = 'Insert_TbSal' THEN
 
 IF NOT EXISTS(select * from tb_sala where sl_num = P_sl_num and bl_id = P_Bl_id) THEN
    INSERT INTO tb_sala (sl_num, bl_id)
         VALUES (P_sl_num, P_Bl_id);
         
	SET @P_sl_id = LAST_INSERT_ID();
    
    select * from tb_sala where sl_id = @P_sl_id;
	ELSE 
		SELECT 'erro';
	END IF;
  END IF;
  -- ----------------------------------------------    
  
  IF Action = 'SelectId_TbSal' THEN 
 
    SELECT * FROM tb_sala
            WHERE sl_id = P_Sl_id;  
  END IF;
  -- ---------------------------------------------- 
  
  -- ----------------------------------------------    
  
  IF Action = 'Select_TbSal' THEN 
 
    SELECT sl_id, sl_num, bl_nome, tb_sala.bl_id FROM tb_sala
    inner join tb_bloco on
		tb_bloco.bl_id = tb_sala.bl_id
            WHERE (1 = 1)
            AND ((P_sl_num is null) or (sl_num = P_sl_num))
            AND ((P_Bl_id is null) or  (tb_sala.bl_id = P_Bl_id));
  END IF;
  -- ----------------------------------------------    
  
  IF Action = 'SelectAll_TbSal' THEN
    SELECT * FROM tb_sala;
  END IF;

END $$

DELIMITER ;



DELIMITER $$
create procedure DDL(
IN Action int,
IN sala_id int,
IN bloco_id int
)
BEGIN

IF Action = 1 THEN
select bl_id ,bl_nome from tb_bloco;
end if;

If Action = 2 then
select itm_id, itm_nome from tb_itens;
end IF;

If Action = 3 then
select cla_id, cla_nome from tb_classificacao;
end IF;

If Action = 4 then
select maq_id, maq_num from tb_maquina
inner join tb_sala on
tb_sala.sl_id = tb_maquina.sl_id
where tb_maquina.sl_id = sala_id;
end IF;

If Action = 5 then
select sl_id, sl_num from tb_sala
inner join tb_bloco on
tb_bloco.bl_id = tb_sala.bl_id
where tb_sala.bl_id = bloco_id;
end IF;

END $$


DELIMITER $$
create procedure LOGIN(
IN Senha nvarchar(100), 
IN Nome varchar(50)
)
BEGIN

SELECT * 
FROM tb_administrador
WHERE adm_senha = MD5(Senha) and adm_nome = Nome and adm_status = 0; -- verifica login

END $$


-- ----------------------------------------------------------------------------------------
-- CRIANDO PROCEDURE GRAFANA
DELIMITER $$
create procedure GRAFANA(
IN Action  varchar(80)
)
BEGIN

-- --------------------------------------------------------------------------------------------------
IF Action = 'Chamados' then           -- Visão geral dos Chamados Aberto | Finalizado | Andamento

		SELECT 
			cha_sit  AS Status,
			COUNT(*) AS Quantidade
		FROM 
			tb_chamado
		GROUP BY 
			cha_sit;
end if;   -- CALL GRAFANA ('Chamados')


-- --------------------------------------------------------------------------------------------------
IF Action = 'Cha_classificacao' then           -- Visão geral dos Chamados Problema | Melhoria | Instalação |...

		SELECT 
			cla_nome 	 AS Tipo,    
			COUNT(*) AS Quantidade
		FROM 
			tb_chamado					 cha
			INNER JOIN tb_classificacao  cla ON cha.cla_ID = cla.cla_ID
		GROUP BY 
			cla_nome
		ORDER BY 
			Quantidade DESC;
end if;  -- CALL GRAFANA ('Cha_classificacao')


-- --------------------------------------------------------------------------------------------------
IF Action = 'Cha_novos_abertos_mes' then           -- Chamados abertos por mÊs

		SET lc_time_names = 'pt_BR';
		SELECT 
			DATE_FORMAT(cha_dt_inicio, '%b-%y') AS Mes_Ano,
			COUNT(*) AS Total_Chamados
		FROM 
			tb_chamado
		GROUP BY 
			DATE_FORMAT(cha_dt_inicio, '%b-%y')
		ORDER BY 
			YEAR(cha_dt_inicio), MONTH(cha_dt_inicio);
end if; -- CALL GRAFANA ('Cha_novos_abertos_mes')


-- --------------------------------------------------------------------------------------------------
IF Action = 'Cha_pendentes_mes' then           -- Chamados que ainda constam em aberto - Por mÊs

		SET lc_time_names = 'pt_BR';
		SELECT 
			DATE_FORMAT(cha_dt_inicio, '%b-%y') AS Mes_Ano,
			COUNT(*) AS "Total Chamados",
			CASE
				WHEN DATEDIFF(CURDATE(), cha_dt_inicio) > 60 THEN 'Crítico' 
				ELSE 'Normal'
			END AS Superior_60_dias
		FROM 
			tb_chamado
		WHERE
			cha_sit = 'aberto'
		GROUP BY 
			DATE_FORMAT(cha_dt_inicio, '%b-%y')
		ORDER BY 
			YEAR(cha_dt_inicio), MONTH(cha_dt_inicio);
end if; -- CALL GRAFANA ('Cha_pendentes_mes')


-- --------------------------------------------------------------------------------------------------
IF Action = 'Cha_media_resolucao' then           -- Tempo médio de resolução de chamados - Por mÊs

		SET lc_time_names = 'pt_BR';
		SELECT 
			DATE_FORMAT(cha_dt_inicio, '%b-%y') AS Mes_Ano,
			ROUND(AVG(DATEDIFF(cha_dt_fim, cha_dt_inicio))) AS Tempo_Medio_Resolucao  
		FROM 
			tb_chamado
		WHERE
			cha_sit = 'finalizado'
		GROUP BY 
			DATE_FORMAT(cha_dt_inicio, '%b-%y')
		ORDER BY 
			YEAR(cha_dt_inicio), MONTH(cha_dt_inicio);
end if; -- CALL GRAFANA ('Cha_media_resolucao')


-- --------------------------------------------------------------------------------------------------
IF Action = 'Cha_itens' then           -- Chamados abertos por itens/equipamentos

		SELECT 
			itm_nome AS Item, 
			COUNT(*) AS "Total Chamados",
			ROUND((COUNT(*) / (SELECT COUNT(*) FROM tb_chamado) * 100)) AS Percentual
		FROM 
			tb_chamado cha
			INNER JOIN tb_itens itm ON cha.itm_id = itm.itm_id
		GROUP BY 
			itm.itm_id
		ORDER BY 
			"Total Chamados" DESC;
end if; -- CALL GRAFANA ('Cha_itens')


END $$


-- ********************************************************************************************************
--                                       DML - POPULANDO TABELAS
-- ********************************************************************************************************

INSERT INTO tb_bloco (bl_nome)
VALUES 	('Bloco A'      ),
		('Bloco B'      ),
        ('Bloco C'      ),
        ('Bloco D'      ),
        ('EMC-CITEC I'  ),
        ('Dpto. Adm.'   ),
        ('Dpto. RH'     ),
        ('Dpto. Financ.');                           -- SELECT * FROM tb_bloco ORDER BY bl_id;
        
        
INSERT INTO tb_sala (sl_num, bl_id)
VALUES 	('Lab 01'   , 1),
        ('Lab 02'   , 1),
        ('Lab 03'   , 2),
        ('Lab 04'   , 2),
        ('Lab 05'   , 3),
        ('Lab 06'  	, 3),
	    ('Lab 07'  	, 4),
        ('Lab 08'  	, 4),
        ('Sl 311'   , 6),
	    ('Sl 315'   , 7),
        ('Sl 316'   , 8);                                    -- SELECT * FROM tb_sala ORDER BY sl_id;


INSERT INTO tb_maquina (maq_num, sl_id, bl_id)
VALUES 	('BAR-311',   1, 1),
        ('BAR-312',   2, 2),
        ('BAR-313',   2, 2),
        ('BAR-314',   3, 3),
        ('BAR-315',   3, 3),
        ('BAR-316',   4, 4),
        ('BAR-317',   4, 4),
        ('BAR-318',   4, 4),
        ('Todas lab-01',   1, 1);                                -- SELECT * FROM tb_maquina ORDER BY maq_id;


INSERT INTO tb_classificacao (cla_nome)
VALUES  ('Problema'),
	   	('Instalação'), 
        ('Melhoria'), 
        ('Outros');                                             -- SELECT * FROM tb_classificacao ORDER BY cla_id;


INSERT INTO tb_itens (itm_nome)
VALUES 	('CPU'      ),
		('Monitor'  ),
        ('Mouse'    ),
        ('Teclado'  ),
        ('Som'      ),
        ('Internet' ),
        ('Software' ),
        ('Outros'   );                                -- SELECT * FROM tb_itens ORDER BY itm_id;


INSERT INTO tb_administrador
            (adm_id, adm_nome, adm_senha, adm_status)
VALUES 
       (1,'Admin' , MD5('AdminSistAcess123' ), 0),
       (2,'Thiago', MD5('2222'              ), 0);
	

INSERT INTO tb_chamado -- populando tabelas para análise do funcionamento
			(
			cha_dt_inicio,
			cla_id,
			itm_id,
			cha_assunto,
			maq_id,
			sl_id,
			bl_id,
			cha_desc,
			cha_sit,
			cha_dt_fim,
			cha_notes)
	VALUES
			
('2024-01-09',	1,	2,	'Monitor com linhas'					,	4,	3,	2,	'Monitor ta com defeito'							,	'Finalizado'	,	'2024-01-26',	'Troca de placa'						),
('2024-01-14',	1,	1,	'CPU desligando'						,	1,	1,	1,	'CPU liga a ventoinha e depois desliga'				,	'Em Andamento'	, 			NULL,	'Sem solução no momento'				),
('2024-01-15',	1,	7,	'Software travando'						,	2,	1,	1,	'MS Project não roda bem na máquina, fica travando'	,	'Finalizado'	,	'2024-01-16',	'Upgrade de memória RAM'				),
('2024-01-19',	3,	6,	'Conexão intermitente'					,	7,	6,	3,	'Internet fica caindo'								,	'Aberto'		, 			NULL,	 NULL									),
('2024-01-20',	3,	6,	'Internet lenta'						,	5,	4,	2,	'Sinal da internet muito fraco para notebook'		,	'Finalizado'	,	'2024-02-13',	'Instalação de repetidor de sinal'		),
('2024-01-22',	1,	2,	'Monitor com linhas'					,	4,	3,	2,	'Monitor fica com linhas e está ruim de visualizar'	,	'Finalizado'	,	'2024-02-03',	'Placa trocada'							),
('2024-01-28',	1,	1,	'CPU desligando'						,	2,	1,	1,	'Computador desliga sozinho'						,	'Finalizado'	, 	'2024-01-30',	'Atualização feita'						),
('2024-02-25',	1,	3,	'Mouse não responde'					,	5,	4,	2,	'Mouse fica travando'								,	'Finalizado'	,	'2024-02-26',	'Mouse substituído'						),
('2024-03-03',	1,	7,	'Software travando'						,	7,	6,	3,	'Power BI fica travando'							,	'Finalizado'	,	'2024-03-07',	'Upgrade de memória RAM'				),
('2024-03-09',	3,	8,	'Sala muito quente'						,	7,	6,	3,	'Sala muito quente que chega ser dificil concentrar',	'Finalizado'	,	'2024-04-10',	'Instalação de ventiladores'			),
('2024-03-12',	1,	3,	'Mouse não responde'					,	9,	8,	4,	'Mouse não responde'								,	'Aberto'		,			NULL,	NULL									),
('2024-03-14',	1,	2,	'Monitor com linhas'					,	4,	3,	2,	'Tela tem umas linhas que dificultam a leitura'		,	'Em Andamento'	,			NULL, 	'Sem solução no momento'				),
('2024-03-27',	1,	6,	'Tela travada'							,	8,	7,	4,	'A internet esta muito ruim e a tela fica travada'	,	'Aberto'		,			NULL,	NULL									),
('2024-04-09',	1,	2,	'Monitor com linhas'					,	4,	3,	2,	'Monitor fica com linhas e está ruim de visualizar'	,	'Em Andamento'	,			NULL,	'Investigação em curso'					),
('2024-04-16',	2,	1,	'Atualização de sistema'				,	6,	5,	3,	'Windows não abre'									,	'Aberto'		,			NULL,	NULL									),
('2024-04-20',	1,	3,	'Mouse não responde'					,	5,	4,	2,  NULL												,	'Finalizado'	,	'2024-04-21',	'Peça substituída'						),
('2024-05-02',	1,	1,	'Atualização de sistema'				,	4,	3,	2,	'Sistema fica atualizando e não carrega'			,	'Finalizado'	,	'2024-06-01',	'Máquina formatada'						),
('2024-05-04',	1,	7,	'Software travando'						,	8,	7,	4,	'Tentei abrir o Android studio mas fica travado'	,	'Finalizado'	,	'2024-06-02',	'Programa atualizado'					),
('2024-05-12',	2,	7,	'Instalação de MS Project'				,	6,	5,	3,	'Liberar o aplicativo para uso em sala'				,	'Finalizado'	,	'2024-05-14',	'Atualização feita'						),
('2024-06-04',	2,	3,	'Tela travada'							,	1,	1,	1,	'Tela trava e não tem como usar'					,	'Finalizado'	,	'2024-06-30',	'Troca de placa'						),
('2024-07-04',	1,	3,	'Mouse não responde'					,	4,	3,	2,	'Mouse não responde'								,	'Finalizado'	,	'2024-07-08',	'Mouse descartado'						),
('2024-07-18',	4,	8,	'Cadeira muito desconfortavel'			,	7,	6,	3,	'Cadeira não tem uma boa ergonomia'					,	'Em Andamento'	,			NULL,	'Analisando o caso'						),
('2024-08-12',	2,	7,	'Atualização de sistema'				,	8,	7,	4,	'Computadir fica pedindo para atualizar'			,	'Aberto'		,			NULL,	NULL									),
('2024-08-30',	4,	8,	'Cadeira quebrou'						,	4,	3,	2,	'Cadeira quebrou ao sentar'							, 	'Finalizado'	,	'2024-09-02',	'Troca realizada'						),
('2024-09-04',	3,	6,	'Internet lenta'						,	7,	6,	3,	'Precisam melhorar essa internet esta muito lenta'	,	'Finalizado'	,	'2024-09-05',	'Problema foi na operadora de internet'	),
('2024-10-06',	3,	5,	'Audio muito baixo'						,	8,	7,	4,	'Para apresentações o audio deixa a desejar'		,	'Finalizado'	,	'2024-10-14',	'Compra de novo aparelho'				),
('2024-10-14',	3,	6,	'Internet lenta'						,	8,	7,	4,	'Internet muito lenta'								,	'Finalizado'	,	'2024-11-12',	'Problema foi na operadora de internet'	),
('2024-10-16',	1,	2,	'Não liga'								,	6,	5,	3,	'Monitor não quer ligar'							,	'Finalizado'	,	'2024-10-20',	'Peça substituída'						),
('2024-10-18',	4,	8,	'Ar condicionado não está gelando'		,	9,	8,	4,	'O ar condicionado liga mas não gela'				,	'Em Andamento'	,			NULL,	'Aguardando técnico'					),
('2024-10-23',	3,	1,	'Poderiam fazer uma atualização maquinas',	6,	5,	3,	'Essas máquinas estão meio desatualizadas'			,	'Aberto'		,			NULL,	NULL									),
('2024-10-31',	3,	8,	'Projetor não tem uma boa qualidade'	,	1,	1,	1,	'Projetor não tem uma boa qualidade'				,	'Aberto'		,			NULL,	NULL									),
('2024-11-05',	1,	6,	'Internet lenta'						,	5,	4,	2,	'Internet demora muito para carregar a página'		,	'Aberto'		,			NULL,	NULL									),
('2024-11-21',	4,	4,	'Derrubei café no teclado'				,	5,	4,	2,	'Acabei esbarrando e derrubei café no teclado'		,	'Finalizado'	,	'2024-11-28',	'Teclado substituido'					),
('2024-11-27',	1,	2,	'Monitor com linhas'					,	7,	6,	3,	'Imagem ruim de ver tem umas linhas'				,	'Finalizado'	,	'2024-12-01',	'Monitor substituido'					),
('2024-11-28',	4,	8,	'Sala com luz queimada'					,	9,	8,	4,	'Tem  luz queimada e umas piscando'					,	'Em Andamento'	,			NULL,	'Vendo fiação'							),
('2024-11-28',	2,	2,	'Tela travada'							,	5,	4,	2,	'Tela travou'										,	'Em Andamento'	,			NULL,	'Aguardando técnico'					),
('2024-11-30',	3,	4,	'Formato do teclado não é padrão ABNT'	,	1,	1,	1,	'Poderia ter um teclado com melhor espaçamento'		, 	'Em Andamento'	,			NULL,	'Investigação em curso'					),
('2024-12-01',	1,	2,	'Monitor piscando'						,	3,	2,	1,	NULL												,	'Aberto'		,			NULL,	NULL									),
('2024-12-01',	1,	6,	'Conexão Wi-Fi caindo'					,	2,	1,	1,	NULL												,	'Aberto'		,			NULL,	NULL									),
('2024-12-02',	1,	6,	'Falha na rede'							,	6,	5,	3,	'Rede de internet esta com problema'				,	'Em Andamento'	,			NULL,	'Analisando o caso'						),
('2024-12-02',	1,	7,	'Erro ao abrir Excel'					,	4,	3,	2,	'Excel não abre'									,	'Aberto'		,			NULL,	NULL									),
('2024-12-03',	3,	8,	'Permitir conectar na impressora'		,	6,	5,	3,	'Preciso imprimir um trabalho e não consigo'		,	'Aberto'		,			NULL,	NULL									),
('2024-12-04',	1,	7,	'Licença de software expirada'			,	3,	2,	1,	'Licença do Microsoft expirou e não acesso o Word'	,	'Em Andamento'	,			NULL,	'Atualizando licenças'					),
('2024-12-05',	1,	8,	'Perdi meus dados na rede'				,	6,	5,	3,	'Salvei meus dados na rede mas não acho onde'		,	'Em Andamento'	,			NULL,	'Analisando recuperação de dados'		),
('2024-12-06',	3,	8,	'Cabos de rede danificados'				,	8,	7,	4,	'Os cabos de rede estão danificados'				,	'Aberto'		,			NULL,	NULL									);



-- --------------------------------------------------------------------------------------------
-- Chamando funções da PROCEDURE







